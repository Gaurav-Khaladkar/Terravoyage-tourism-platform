package com.terravoyage.tourism.service;

import com.terravoyage.tourism.domain.Review;
import com.terravoyage.tourism.domain.TourPackage;
import com.terravoyage.tourism.domain.User;
import com.terravoyage.tourism.dto.ReviewDTO;
import com.terravoyage.tourism.exception.ResourceNotFoundException;
import com.terravoyage.tourism.repository.ReviewRepository;
import com.terravoyage.tourism.repository.TourPackageRepository;
import com.terravoyage.tourism.repository.UserRepository;
import com.terravoyage.tourism.security.UserPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final TourPackageRepository tourPackageRepository;
    private final UserRepository userRepository;

    public ReviewService(ReviewRepository reviewRepository,
                         TourPackageRepository tourPackageRepository,
                         UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.tourPackageRepository = tourPackageRepository;
        this.userRepository = userRepository;
    }

    public List<ReviewDTO> getReviewsByPackageId(Long packageId) {
        return reviewRepository.findByTourPackageIdOrderByCreatedAtDesc(packageId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<ReviewDTO> getRecentReviews() {
        return reviewRepository.findTop10ByOrderByCreatedAtDesc().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ReviewDTO createReview(UserPrincipal currentUser, ReviewDTO dto) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        TourPackage tourPackage = tourPackageRepository.findById(dto.getTourPackageId())
                .orElseThrow(() -> new ResourceNotFoundException("Tour package not found"));

        Review review = new Review(
                user,
                tourPackage,
                dto.getRating(),
                dto.getTitle(),
                dto.getComment(),
                true
        );

        Review saved = reviewRepository.save(review);

        // Update package rating average
        List<Review> allReviews = reviewRepository.findByTourPackageIdOrderByCreatedAtDesc(tourPackage.getId());
        double avg = allReviews.stream().mapToInt(Review::getRating).average().orElse(5.0);
        tourPackage.setRating(Math.round(avg * 10.0) / 10.0);
        tourPackage.setReviewCount(allReviews.size());
        tourPackageRepository.save(tourPackage);

        return mapToDTO(saved);
    }

    public ReviewDTO mapToDTO(Review review) {
        ReviewDTO dto = new ReviewDTO();
        dto.setId(review.getId());
        if (review.getTourPackage() != null) {
            dto.setTourPackageId(review.getTourPackage().getId());
        }
        dto.setRating(review.getRating());
        dto.setTitle(review.getTitle());
        dto.setComment(review.getComment());
        if (review.getUser() != null) {
            dto.setReviewerName(review.getUser().getFullName());
            dto.setReviewerAvatar(review.getUser().getAvatarUrl());
        }
        dto.setVerifiedBooking(review.isVerifiedBooking());
        dto.setCreatedAt(review.getCreatedAt());
        return dto;
    }
}
