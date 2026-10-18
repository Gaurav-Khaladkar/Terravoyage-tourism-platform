package com.terravoyage.tourism.domain;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tour_packages")
public class TourPackage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "destination_id", nullable = false)
    private Destination destination;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TourCategory category;

    @Column(nullable = false)
    private int durationDays;

    @Column(nullable = false)
    private int durationNights;

    @Column(nullable = false)
    private Double basePrice;

    private Double discountedPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Difficulty difficulty = Difficulty.MODERATE;

    private int maxGroupSize = 16;
    private int availableSlots = 12;
    private Double rating = 4.8;
    private int reviewCount = 0;

    private String bannerImageUrl;

    @Column(length = 3000)
    private String overview;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "package_inclusions", joinColumns = @JoinColumn(name = "package_id"))
    @Column(name = "inclusion")
    private List<String> inclusions = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "package_exclusions", joinColumns = @JoinColumn(name = "package_id"))
    @Column(name = "exclusion")
    private List<String> exclusions = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "package_highlights", joinColumns = @JoinColumn(name = "package_id"))
    @Column(name = "highlight")
    private List<String> highlights = new ArrayList<>();

    private boolean active = true;

    @OneToMany(mappedBy = "tourPackage", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("dayNumber ASC")
    private List<ItineraryDay> itinerary = new ArrayList<>();

    public TourPackage() {}

    public void addItineraryDay(ItineraryDay day) {
        itinerary.add(day);
        day.setTourPackage(this);
    }

    public void removeItineraryDay(ItineraryDay day) {
        itinerary.remove(day);
        day.setTourPackage(null);
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Destination getDestination() { return destination; }
    public void setDestination(Destination destination) { this.destination = destination; }

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

    public List<ItineraryDay> getItinerary() { return itinerary; }
    public void setItinerary(List<ItineraryDay> itinerary) { this.itinerary = itinerary; }
}
