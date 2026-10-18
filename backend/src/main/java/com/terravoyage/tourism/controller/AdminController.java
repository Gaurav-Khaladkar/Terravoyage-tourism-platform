package com.terravoyage.tourism.controller;

import com.terravoyage.tourism.domain.BookingStatus;
import com.terravoyage.tourism.dto.ApiResponse;
import com.terravoyage.tourism.dto.BookingResponseDTO;
import com.terravoyage.tourism.dto.DashboardStatsDTO;
import com.terravoyage.tourism.service.AnalyticsService;
import com.terravoyage.tourism.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Console & Analytics", description = "Backoffice administration and revenue analytics")
public class AdminController {

    private final AnalyticsService analyticsService;
    private final BookingService bookingService;

    public AdminController(AnalyticsService analyticsService, BookingService bookingService) {
        this.analyticsService = analyticsService;
        this.bookingService = bookingService;
    }

    @GetMapping("/analytics")
    @Operation(summary = "Get platform metrics and booking analytics")
    public ResponseEntity<ApiResponse<DashboardStatsDTO>> getAnalytics() {
        return ResponseEntity.ok(ApiResponse.success("Analytics retrieved", analyticsService.getDashboardStats()));
    }

    @GetMapping("/bookings")
    @Operation(summary = "List all customer bookings across the platform")
    public ResponseEntity<ApiResponse<List<BookingResponseDTO>>> getAllBookings() {
        return ResponseEntity.ok(ApiResponse.success("All bookings retrieved", bookingService.getAllBookingsAdmin()));
    }

    @PutMapping("/bookings/{reference}/status")
    @Operation(summary = "Update booking status (CONFIRMED, COMPLETED, CANCELLED)")
    public ResponseEntity<ApiResponse<BookingResponseDTO>> updateStatus(
            @PathVariable String reference,
            @RequestBody Map<String, String> payload
    ) {
        String statusStr = payload.get("status");
        BookingStatus status = BookingStatus.valueOf(statusStr);
        BookingResponseDTO updated = bookingService.updateBookingStatus(reference, status);
        return ResponseEntity.ok(ApiResponse.success("Status updated", updated));
    }
}
