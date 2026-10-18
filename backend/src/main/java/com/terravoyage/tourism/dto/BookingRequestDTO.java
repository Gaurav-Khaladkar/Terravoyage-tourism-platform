package com.terravoyage.tourism.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class BookingRequestDTO {

    @NotNull(message = "Tour package ID is required")
    private Long tourPackageId;

    @NotNull(message = "Travel date is required")
    @Future(message = "Travel date must be in the future")
    private LocalDate travelDate;

    @Min(value = 1, message = "At least one adult is required")
    private int adultCount = 1;

    private int childCount = 0;

    private String couponCode;
    private String specialRequests;
    private boolean airportTransferSelected = false;
    private boolean insuranceSelected = false;

    public BookingRequestDTO() {}

    public Long getTourPackageId() { return tourPackageId; }
    public void setTourPackageId(Long tourPackageId) { this.tourPackageId = tourPackageId; }

    public LocalDate getTravelDate() { return travelDate; }
    public void setTravelDate(LocalDate travelDate) { this.travelDate = travelDate; }

    public int getAdultCount() { return adultCount; }
    public void setAdultCount(int adultCount) { this.adultCount = adultCount; }

    public int getChildCount() { return childCount; }
    public void setChildCount(int childCount) { this.childCount = childCount; }

    public String getCouponCode() { return couponCode; }
    public void setCouponCode(String couponCode) { this.couponCode = couponCode; }

    public String getSpecialRequests() { return specialRequests; }
    public void setSpecialRequests(String specialRequests) { this.specialRequests = specialRequests; }

    public boolean isAirportTransferSelected() { return airportTransferSelected; }
    public void setAirportTransferSelected(boolean airportTransferSelected) { this.airportTransferSelected = airportTransferSelected; }

    public boolean isInsuranceSelected() { return insuranceSelected; }
    public void setInsuranceSelected(boolean insuranceSelected) { this.insuranceSelected = insuranceSelected; }
}
