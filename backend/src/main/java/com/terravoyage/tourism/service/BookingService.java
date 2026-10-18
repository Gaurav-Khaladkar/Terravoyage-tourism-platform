package com.terravoyage.tourism.service;

import com.terravoyage.tourism.domain.Booking;
import com.terravoyage.tourism.domain.BookingStatus;
import com.terravoyage.tourism.domain.TourPackage;
import com.terravoyage.tourism.domain.User;
import com.terravoyage.tourism.dto.BookingRequestDTO;
import com.terravoyage.tourism.dto.BookingResponseDTO;
import com.terravoyage.tourism.dto.CouponValidationDTO;
import com.terravoyage.tourism.exception.BadRequestException;
import com.terravoyage.tourism.exception.ResourceNotFoundException;
import com.terravoyage.tourism.repository.BookingRepository;
import com.terravoyage.tourism.repository.TourPackageRepository;
import com.terravoyage.tourism.repository.UserRepository;
import com.terravoyage.tourism.security.UserPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final TourPackageRepository tourPackageRepository;
    private final UserRepository userRepository;
    private final CouponService couponService;

    public BookingService(BookingRepository bookingRepository,
                          TourPackageRepository tourPackageRepository,
                          UserRepository userRepository,
                          CouponService couponService) {
        this.bookingRepository = bookingRepository;
        this.tourPackageRepository = tourPackageRepository;
        this.userRepository = userRepository;
        this.couponService = couponService;
    }

    @Transactional
    public BookingResponseDTO createBooking(UserPrincipal currentUser, BookingRequestDTO dto) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        TourPackage tourPackage = tourPackageRepository.findById(dto.getTourPackageId())
                .orElseThrow(() -> new ResourceNotFoundException("Tour package not found"));

        int totalTravelers = dto.getAdultCount() + dto.getChildCount();
        if (tourPackage.getAvailableSlots() < totalTravelers) {
            throw new BadRequestException("Not enough available slots for this tour. Remaining: " + tourPackage.getAvailableSlots());
        }

        double unitPrice = tourPackage.getDiscountedPrice() != null ? tourPackage.getDiscountedPrice() : tourPackage.getBasePrice();
        double adultTotal = dto.getAdultCount() * unitPrice;
        double childTotal = dto.getChildCount() * (unitPrice * 0.70); // 30% discount for children
        double baseAmount = adultTotal + childTotal;

        double addOnAmount = 0.0;
        if (dto.isAirportTransferSelected()) {
            addOnAmount += 60.0;
        }
        if (dto.isInsuranceSelected()) {
            addOnAmount += (35.0 * totalTravelers);
        }

        double discountAmount = 0.0;
        String validCoupon = null;
        if (dto.getCouponCode() != null && !dto.getCouponCode().trim().isEmpty()) {
            CouponValidationDTO validation = couponService.validateCoupon(dto.getCouponCode(), baseAmount + addOnAmount);
            if (validation.isValid()) {
                discountAmount = validation.getDiscountAmount();
                validCoupon = validation.getCode();
            }
        }

        double finalTotal = Math.max(0.0, (baseAmount + addOnAmount) - discountAmount);

        // Deduct slots
        tourPackage.setAvailableSlots(tourPackage.getAvailableSlots() - totalTravelers);
        tourPackageRepository.save(tourPackage);

        Booking booking = new Booking();
        String bookingRef = "TV-" + LocalDate.now().getYear() + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        booking.setBookingReference(bookingRef);
        booking.setUser(user);
        booking.setTourPackage(tourPackage);
        booking.setTravelDate(dto.getTravelDate());
        booking.setAdultCount(dto.getAdultCount());
        booking.setChildCount(dto.getChildCount());
        booking.setBaseAmount(baseAmount);
        booking.setAddOnAmount(addOnAmount);
        booking.setDiscountAmount(discountAmount);
        booking.setTotalAmount(finalTotal);
        booking.setStatus(BookingStatus.CONFIRMED); // Confirmed on reservation
        booking.setCouponCode(validCoupon);
        booking.setSpecialRequests(dto.getSpecialRequests());
        booking.setCreatedAt(LocalDateTime.now());

        Booking saved = bookingRepository.save(booking);
        return mapToDTO(saved);
    }

    public List<BookingResponseDTO> getUserBookings(UserPrincipal currentUser) {
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId()).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public BookingResponseDTO getBookingByReference(String reference, UserPrincipal currentUser) {
        Booking booking = bookingRepository.findByBookingReference(reference)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with reference: " + reference));

        boolean isAdmin = currentUser.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!isAdmin && !booking.getUser().getId().equals(currentUser.getId())) {
            throw new BadRequestException("Unauthorized access to this booking");
        }

        return mapToDTO(booking);
    }

    @Transactional
    public BookingResponseDTO cancelBooking(String reference, UserPrincipal currentUser) {
        Booking booking = bookingRepository.findByBookingReference(reference)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with reference: " + reference));

        boolean isAdmin = currentUser.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!isAdmin && !booking.getUser().getId().equals(currentUser.getId())) {
            throw new BadRequestException("Unauthorized access to this booking");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        // Release slots back
        TourPackage pkg = booking.getTourPackage();
        pkg.setAvailableSlots(pkg.getAvailableSlots() + booking.getAdultCount() + booking.getChildCount());
        tourPackageRepository.save(pkg);

        Booking updated = bookingRepository.save(booking);
        return mapToDTO(updated);
    }

    public List<BookingResponseDTO> getAllBookingsAdmin() {
        return bookingRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookingResponseDTO updateBookingStatus(String reference, BookingStatus newStatus) {
        Booking booking = bookingRepository.findByBookingReference(reference)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with reference: " + reference));

        booking.setStatus(newStatus);
        Booking updated = bookingRepository.save(booking);
        return mapToDTO(updated);
    }

    public BookingResponseDTO mapToDTO(Booking booking) {
        BookingResponseDTO dto = new BookingResponseDTO();
        dto.setId(booking.getId());
        dto.setBookingReference(booking.getBookingReference());
        if (booking.getTourPackage() != null) {
            dto.setTourPackageId(booking.getTourPackage().getId());
            dto.setTourTitle(booking.getTourPackage().getTitle());
            if (booking.getTourPackage().getDestination() != null) {
                dto.setDestinationName(booking.getTourPackage().getDestination().getName());
                dto.setDestinationCountry(booking.getTourPackage().getDestination().getCountry());
            }
            dto.setBannerImageUrl(booking.getTourPackage().getBannerImageUrl());
        }
        if (booking.getUser() != null) {
            dto.setTravelerName(booking.getUser().getFullName());
            dto.setTravelerEmail(booking.getUser().getEmail());
        }
        dto.setTravelDate(booking.getTravelDate());
        dto.setAdultCount(booking.getAdultCount());
        dto.setChildCount(booking.getChildCount());
        dto.setBaseAmount(booking.getBaseAmount());
        dto.setDiscountAmount(booking.getDiscountAmount());
        dto.setAddOnAmount(booking.getAddOnAmount());
        dto.setTotalAmount(booking.getTotalAmount());
        dto.setStatus(booking.getStatus());
        dto.setCouponCode(booking.getCouponCode());
        dto.setSpecialRequests(booking.getSpecialRequests());
        dto.setCreatedAt(booking.getCreatedAt());
        return dto;
    }
}
