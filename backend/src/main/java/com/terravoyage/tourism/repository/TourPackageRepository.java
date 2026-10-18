package com.terravoyage.tourism.repository;

import com.terravoyage.tourism.domain.Difficulty;
import com.terravoyage.tourism.domain.TourCategory;
import com.terravoyage.tourism.domain.TourPackage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TourPackageRepository extends JpaRepository<TourPackage, Long> {

    List<TourPackage> findByActiveTrue();

    List<TourPackage> findTop6ByActiveTrueOrderByRatingDesc();

    List<TourPackage> findByCategoryAndActiveTrue(TourCategory category);

    List<TourPackage> findByDestinationIdAndActiveTrue(Long destinationId);

    @Query("SELECT p FROM TourPackage p WHERE p.active = true " +
           "AND (:category IS NULL OR p.category = :category) " +
           "AND (:difficulty IS NULL OR p.difficulty = :difficulty) " +
           "AND (:destinationId IS NULL OR p.destination.id = :destinationId) " +
           "AND (:minPrice IS NULL OR p.basePrice >= :minPrice) " +
           "AND (:maxPrice IS NULL OR p.basePrice <= :maxPrice) " +
           "AND (:keyword IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "     OR LOWER(p.destination.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "     OR LOWER(p.destination.country) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "ORDER BY p.rating DESC")
    List<TourPackage> searchPackages(
            @Param("keyword") String keyword,
            @Param("category") TourCategory category,
            @Param("difficulty") Difficulty difficulty,
            @Param("destinationId") Long destinationId,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice
    );
}
