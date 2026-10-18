package com.terravoyage.tourism.dto;

import com.terravoyage.tourism.domain.Difficulty;
import com.terravoyage.tourism.domain.TourCategory;
import java.util.List;

public class TourPackageDTO {

    private Long id;
    private String title;
    private Long destinationId;
    private String destinationName;
    private String destinationCountry;
    private TourCategory category;
    private int durationDays;
    private int durationNights;
    private Double basePrice;
    private Double discountedPrice;
    private Difficulty difficulty;
    private int maxGroupSize;
    private int availableSlots;
    private Double rating;
    private int reviewCount;
    private String bannerImageUrl;
    private String overview;
    private List<String> inclusions;
    private List<String> exclusions;
    private List<String> highlights;
    private boolean active;
    private List<ItineraryDayDTO> itinerary;

    public TourPackageDTO() {}

    public static class ItineraryDayDTO {
        private int dayNumber;
        private String title;
        private String description;
        private String accommodation;
        private String mealsIncluded;

        public ItineraryDayDTO() {}

        public ItineraryDayDTO(int dayNumber, String title, String description, String accommodation, String mealsIncluded) {
            this.dayNumber = dayNumber;
            this.title = title;
            this.description = description;
            this.accommodation = accommodation;
            this.mealsIncluded = mealsIncluded;
        }

        public int getDayNumber() { return dayNumber; }
        public void setDayNumber(int dayNumber) { this.dayNumber = dayNumber; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getAccommodation() { return accommodation; }
        public void setAccommodation(String accommodation) { this.accommodation = accommodation; }
        public String getMealsIncluded() { return mealsIncluded; }
        public void setMealsIncluded(String mealsIncluded) { this.mealsIncluded = mealsIncluded; }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public Long getDestinationId() { return destinationId; }
    public void setDestinationId(Long destinationId) { this.destinationId = destinationId; }
    public String getDestinationName() { return destinationName; }
    public void setDestinationName(String destinationName) { this.destinationName = destinationName; }
    public String getDestinationCountry() { return destinationCountry; }
    public void setDestinationCountry(String destinationCountry) { this.destinationCountry = destinationCountry; }
    public TourCategory getCategory() { return category; }
    public void setCategory(TourCategory category) { this.category = category; }
    public int getDurationDays() { return durationDays; }
    public void setDurationDays(int durationDays) { this.durationDays = durationDays; }
    public int getDurationNights() { return durationNights; }
    public void setDurationNights(int durationNights) { this.durationNights = durationNights; }
    public Double getBasePrice() { return basePrice; }
    public void setBasePrice(Double basePrice) { this.basePrice = basePrice; }
    public Double getDiscountedPrice() { return discountedPrice; }
    public void setDiscountedPrice(Double discountedPrice) { this.discountedPrice = discountedPrice; }
    public Difficulty getDifficulty() { return difficulty; }
    public void setDifficulty(Difficulty difficulty) { this.difficulty = difficulty; }
    public int getMaxGroupSize() { return maxGroupSize; }
    public void setMaxGroupSize(int maxGroupSize) { this.maxGroupSize = maxGroupSize; }
    public int getAvailableSlots() { return availableSlots; }
    public void setAvailableSlots(int availableSlots) { this.availableSlots = availableSlots; }
    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }
    public int getReviewCount() { return reviewCount; }
    public void setReviewCount(int reviewCount) { this.reviewCount = reviewCount; }
    public String getBannerImageUrl() { return bannerImageUrl; }
    public void setBannerImageUrl(String bannerImageUrl) { this.bannerImageUrl = bannerImageUrl; }
    public String getOverview() { return overview; }
    public void setOverview(String overview) { this.overview = overview; }
    public List<String> getInclusions() { return inclusions; }
    public void setInclusions(List<String> inclusions) { this.inclusions = inclusions; }
    public List<String> getExclusions() { return exclusions; }
    public void setExclusions(List<String> exclusions) { this.exclusions = exclusions; }
    public List<String> getHighlights() { return highlights; }
    public void setHighlights(List<String> highlights) { this.highlights = highlights; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    public List<ItineraryDayDTO> getItinerary() { return itinerary; }
    public void setItinerary(List<ItineraryDayDTO> itinerary) { this.itinerary = itinerary; }
}
