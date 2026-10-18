package com.terravoyage.tourism.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class ReviewDTO {

    private Long id;

    @NotNull(message = "Tour package ID is required")
    private Long tourPackageId;

    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating cannot exceed 5")
    private int rating;

    private String title;

    @NotBlank(message = "Comment cannot be blank")
    private String comment;

    private String reviewerName;
    private String reviewerAvatar;
    private boolean verifiedBooking;
    private LocalDateTime createdAt;

    public ReviewDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getTourPackageId() { return tourPackageId; }
    public void setTourPackageId(Long tourPackageId) { this.tourPackageId = tourPackageId; }

    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public String getReviewerName() { return reviewerName; }
    public void setReviewerName(String reviewerName) { this.reviewerName = reviewerName; }

    public String getReviewerAvatar() { return reviewerAvatar; }
    public void setReviewerAvatar(String reviewerAvatar) { this.reviewerAvatar = reviewerAvatar; }

    public boolean isVerifiedBooking() { return verifiedBooking; }
    public void setVerifiedBooking(boolean verifiedBooking) { this.verifiedBooking = verifiedBooking; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
