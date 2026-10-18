package com.terravoyage.tourism.repository;

import com.terravoyage.tourism.domain.Booking;
import com.terravoyage.tourism.domain.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<Booking> findByBookingReference(String bookingReference);

    long countByStatus(BookingStatus status);

    @Query("SELECT COALESCE(SUM(b.totalAmount), 0.0) FROM Booking b WHERE b.status = com.terravoyage.tourism.domain.BookingStatus.CONFIRMED OR b.status = com.terravoyage.tourism.domain.BookingStatus.COMPLETED")
    Double calculateTotalRevenue();

    List<Booking> findAllByOrderByCreatedAtDesc();
}
