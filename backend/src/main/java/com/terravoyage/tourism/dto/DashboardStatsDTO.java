package com.terravoyage.tourism.dto;

import java.util.Map;

public class DashboardStatsDTO {

    private Double totalRevenue;
    private long totalBookings;
    private long confirmedBookings;
    private long pendingBookings;
    private long cancelledBookings;
    private long totalDestinations;
    private long activeTourPackages;
    private Map<String, Long> bookingsByCategory;
    private Map<String, Long> bookingsByStatus;

    public DashboardStatsDTO() {}

    public Double getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(Double totalRevenue) { this.totalRevenue = totalRevenue; }

    public long getTotalBookings() { return totalBookings; }
    public void setTotalBookings(long totalBookings) { this.totalBookings = totalBookings; }

    public long getConfirmedBookings() { return confirmedBookings; }
    public void setConfirmedBookings(long confirmedBookings) { this.confirmedBookings = confirmedBookings; }

    public long getPendingBookings() { return pendingBookings; }
    public void setPendingBookings(long pendingBookings) { this.pendingBookings = pendingBookings; }

    public long getCancelledBookings() { return cancelledBookings; }
    public void setCancelledBookings(long cancelledBookings) { this.cancelledBookings = cancelledBookings; }

    public long getTotalDestinations() { return totalDestinations; }
    public void setTotalDestinations(long totalDestinations) { this.totalDestinations = totalDestinations; }

    public long getActiveTourPackages() { return activeTourPackages; }
    public void setActiveTourPackages(long activeTourPackages) { this.activeTourPackages = activeTourPackages; }

    public Map<String, Long> getBookingsByCategory() { return bookingsByCategory; }
    public void setBookingsByCategory(Map<String, Long> bookingsByCategory) { this.bookingsByCategory = bookingsByCategory; }

    public Map<String, Long> getBookingsByStatus() { return bookingsByStatus; }
    public void setBookingsByStatus(Map<String, Long> bookingsByStatus) { this.bookingsByStatus = bookingsByStatus; }
}
