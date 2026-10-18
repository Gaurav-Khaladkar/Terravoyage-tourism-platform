package com.terravoyage.tourism.controller;

import com.terravoyage.tourism.dto.ApiResponse;
import com.terravoyage.tourism.dto.ReviewDTO;
import com.terravoyage.tourism.security.UserPrincipal;
import com.terravoyage.tourism.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reviews")
@Tag(name = "Reviews & Ratings", description = "Verified traveler reviews and rating system")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/package/{packageId}")
    @Operation(summary = "Get reviews for a specific tour package")
    public ResponseEntity<ApiResponse<List<ReviewDTO>>> getPackageReviews(@PathVariable Long packageId) {
        return ResponseEntity.ok(ApiResponse.success("Reviews retrieved", reviewService.getReviewsByPackageId(packageId)));
    }

    @GetMapping("/recent")
    @Operation(summary = "Get most recent global traveler reviews")
    public ResponseEntity<ApiResponse<List<ReviewDTO>>> getRecentReviews() {
        return ResponseEntity.ok(ApiResponse.success("Recent reviews retrieved", reviewService.getRecentReviews()));
    }

    @PostMapping
    @Operation(summary = "Submit a verified review for a tour package")
    public ResponseEntity<ApiResponse<ReviewDTO>> createReview(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody ReviewDTO dto
    ) {
        ReviewDTO created = reviewService.createReview(currentUser, dto);
        return ResponseEntity.ok(ApiResponse.success("Review published successfully", created));
    }
}
