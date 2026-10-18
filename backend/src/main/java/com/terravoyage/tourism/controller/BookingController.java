package com.terravoyage.tourism.controller;

import com.terravoyage.tourism.dto.ApiResponse;
import com.terravoyage.tourism.dto.BookingRequestDTO;
import com.terravoyage.tourism.dto.BookingResponseDTO;
import com.terravoyage.tourism.security.UserPrincipal;
import com.terravoyage.tourism.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/bookings")
@Tag(name = "Booking & Reservations", description = "Endpoints for booking tours, viewing travel history, and cancellations")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    @Operation(summary = "Create a new tour booking reservation")
    public ResponseEntity<ApiResponse<BookingResponseDTO>> createBooking(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody BookingRequestDTO request
    ) {
        BookingResponseDTO response = bookingService.createBooking(currentUser, request);
        return ResponseEntity.ok(ApiResponse.success("Booking confirmed successfully", response));
    }

    @GetMapping("/my")
    @Operation(summary = "Get bookings for the currently authenticated traveler")
    public ResponseEntity<ApiResponse<List<BookingResponseDTO>>> getMyBookings(@AuthenticationPrincipal UserPrincipal currentUser) {
        List<BookingResponseDTO> bookings = bookingService.getUserBookings(currentUser);
        return ResponseEntity.ok(ApiResponse.success("My bookings retrieved", bookings));
    }

    @GetMapping("/{reference}")
    @Operation(summary = "Get booking details and digital boarding voucher by reference")
    public ResponseEntity<ApiResponse<BookingResponseDTO>> getBookingByReference(
            @PathVariable String reference,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        BookingResponseDTO response = bookingService.getBookingByReference(reference, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Booking details retrieved", response));
    }

    @PostMapping("/{reference}/cancel")
    @Operation(summary = "Cancel a reservation and release slots")
    public ResponseEntity<ApiResponse<BookingResponseDTO>> cancelBooking(
            @PathVariable String reference,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        BookingResponseDTO response = bookingService.cancelBooking(reference, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled successfully", response));
    }
}
