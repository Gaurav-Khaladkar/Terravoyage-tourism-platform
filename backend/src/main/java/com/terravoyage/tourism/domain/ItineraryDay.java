package com.terravoyage.tourism.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "itinerary_days")
public class ItineraryDay {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private int dayNumber;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    private String accommodation;
    private String mealsIncluded;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tour_package_id")
    @JsonIgnore
    private TourPackage tourPackage;

    public ItineraryDay() {}

    public ItineraryDay(int dayNumber, String title, String description, String accommodation, String mealsIncluded) {
        this.dayNumber = dayNumber;
        this.title = title;
        this.description = description;
        this.accommodation = accommodation;
        this.mealsIncluded = mealsIncluded;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public TourPackage getTourPackage() { return tourPackage; }
    public void setTourPackage(TourPackage tourPackage) { this.tourPackage = tourPackage; }
}
