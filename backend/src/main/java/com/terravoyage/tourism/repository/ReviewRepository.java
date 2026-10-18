package com.terravoyage.tourism.repository;

import com.terravoyage.tourism.domain.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByTourPackageIdOrderByCreatedAtDesc(Long tourPackageId);
    List<Review> findTop10ByOrderByCreatedAtDesc();
}
