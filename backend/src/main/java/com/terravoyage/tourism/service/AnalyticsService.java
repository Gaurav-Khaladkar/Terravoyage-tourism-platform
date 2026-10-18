package com.terravoyage.tourism.service;

import com.terravoyage.tourism.domain.Booking;
import com.terravoyage.tourism.domain.BookingStatus;
import com.terravoyage.tourism.dto.DashboardStatsDTO;
import com.terravoyage.tourism.repository.BookingRepository;
import com.terravoyage.tourism.repository.DestinationRepository;
import com.terravoyage.tourism.repository.TourPackageRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {

    private final BookingRepository bookingRepository;
    private final TourPackageRepository tourPackageRepository;
    private final DestinationRepository destinationRepository;

    public AnalyticsService(BookingRepository bookingRepository,
                            TourPackageRepository tourPackageRepository,
                            DestinationRepository destinationRepository) {
        this.bookingRepository = bookingRepository;
        this.tourPackageRepository = tourPackageRepository;
        this.destinationRepository = destinationRepository;
    }

    public DashboardStatsDTO getDashboardStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();

        stats.setTotalRevenue(bookingRepository.calculateTotalRevenue());
        stats.setTotalBookings(bookingRepository.count());
        stats.setConfirmedBookings(bookingRepository.countByStatus(BookingStatus.CONFIRMED));
        stats.setPendingBookings(bookingRepository.countByStatus(BookingStatus.PENDING));
        stats.setCancelledBookings(bookingRepository.countByStatus(BookingStatus.CANCELLED));
        stats.setTotalDestinations(destinationRepository.count());
        stats.setActiveTourPackages(tourPackageRepository.count());

        List<Booking> allBookings = bookingRepository.findAll();
        Map<String, Long> categoryCount = new HashMap<>();
        Map<String, Long> statusCount = new HashMap<>();

        for (Booking b : allBookings) {
            if (b.getTourPackage() != null && b.getTourPackage().getCategory() != null) {
                String cat = b.getTourPackage().getCategory().name();
                categoryCount.put(cat, categoryCount.getOrDefault(cat, 0L) + 1L);
            }
            if (b.getStatus() != null) {
                String st = b.getStatus().name();
                statusCount.put(st, statusCount.getOrDefault(st, 0L) + 1L);
            }
        }

        stats.setBookingsByCategory(categoryCount);
        stats.setBookingsByStatus(statusCount);

        return stats;
    }
}
