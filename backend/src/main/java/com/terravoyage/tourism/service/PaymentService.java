package com.terravoyage.tourism.service;

import com.terravoyage.tourism.domain.Booking;
import com.terravoyage.tourism.domain.BookingStatus;
import com.terravoyage.tourism.domain.PaymentStatus;
import com.terravoyage.tourism.domain.PaymentTransaction;
import com.terravoyage.tourism.dto.PaymentIntentDTO;
import com.terravoyage.tourism.exception.BadRequestException;
import com.terravoyage.tourism.exception.ResourceNotFoundException;
import com.terravoyage.tourism.repository.BookingRepository;
import com.terravoyage.tourism.repository.PaymentTransactionRepository;
import com.terravoyage.tourism.security.UserPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PaymentService {

    private final PaymentTransactionRepository paymentRepository;
    private final BookingRepository bookingRepository;

    public PaymentService(PaymentTransactionRepository paymentRepository, BookingRepository bookingRepository) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
    }

    @Transactional
    public PaymentTransaction processPayment(UserPrincipal currentUser, PaymentIntentDTO dto) {
        Booking booking = bookingRepository.findByBookingReference(dto.getBookingReference())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with reference: " + dto.getBookingReference()));

        if (!booking.getUser().getId().equals(currentUser.getId())) {
            throw new BadRequestException("Unauthorized to process payment for this booking");
        }

        if (paymentRepository.findByBookingId(booking.getId()).isPresent()) {
            throw new BadRequestException("Payment for this booking has already been processed");
        }

        String txnRef = "TXN-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        PaymentTransaction txn = new PaymentTransaction(
                txnRef,
                booking,
                dto.getAmount() != null ? dto.getAmount() : booking.getTotalAmount(),
                dto.getPaymentMethod() != null ? dto.getPaymentMethod() : "CREDIT_CARD",
                PaymentStatus.SUCCESS
        );
        txn.setPaidAt(LocalDateTime.now());

        booking.setStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(booking);

        return paymentRepository.save(txn);
    }
}
