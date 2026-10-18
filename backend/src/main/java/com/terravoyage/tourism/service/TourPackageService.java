package com.terravoyage.tourism.service;

import com.terravoyage.tourism.domain.Destination;
import com.terravoyage.tourism.domain.Difficulty;
import com.terravoyage.tourism.domain.ItineraryDay;
import com.terravoyage.tourism.domain.TourCategory;
import com.terravoyage.tourism.domain.TourPackage;
import com.terravoyage.tourism.dto.TourPackageDTO;
import com.terravoyage.tourism.exception.ResourceNotFoundException;
import com.terravoyage.tourism.repository.DestinationRepository;
import com.terravoyage.tourism.repository.TourPackageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TourPackageService {

    private final TourPackageRepository tourPackageRepository;
    private final DestinationRepository destinationRepository;

    public TourPackageService(TourPackageRepository tourPackageRepository, DestinationRepository destinationRepository) {
        this.tourPackageRepository = tourPackageRepository;
        this.destinationRepository = destinationRepository;
    }

    public List<TourPackageDTO> getAllPackages() {
        return tourPackageRepository.findByActiveTrue().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<TourPackageDTO> getFeaturedPackages() {
        return tourPackageRepository.findTop6ByActiveTrueOrderByRatingDesc().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<TourPackageDTO> searchPackages(String keyword, TourCategory category, Difficulty difficulty, Long destinationId, Double minPrice, Double maxPrice) {
        return tourPackageRepository.searchPackages(keyword, category, difficulty, destinationId, minPrice, maxPrice).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public TourPackageDTO getPackageDTOById(Long id) {
        TourPackage pkg = tourPackageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tour package not found with id: " + id));
        return mapToDTO(pkg);
    }

    public TourPackage getPackageEntityById(Long id) {
        return tourPackageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tour package not found with id: " + id));
    }

    @Transactional
    public TourPackageDTO createPackage(TourPackageDTO dto) {
        Destination destination = destinationRepository.findById(dto.getDestinationId())
                .orElseThrow(() -> new ResourceNotFoundException("Destination not found with id: " + dto.getDestinationId()));

        TourPackage pkg = new TourPackage();
        copyProperties(dto, pkg, destination);

        TourPackage saved = tourPackageRepository.save(pkg);
        return mapToDTO(saved);
    }

    @Transactional
    public TourPackageDTO updatePackage(Long id, TourPackageDTO dto) {
        TourPackage pkg = tourPackageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tour package not found with id: " + id));

        Destination destination = pkg.getDestination();
        if (dto.getDestinationId() != null && !dto.getDestinationId().equals(destination.getId())) {
            destination = destinationRepository.findById(dto.getDestinationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Destination not found with id: " + dto.getDestinationId()));
        }

        copyProperties(dto, pkg, destination);
        TourPackage updated = tourPackageRepository.save(pkg);
        return mapToDTO(updated);
    }

    @Transactional
    public void deletePackage(Long id) {
        TourPackage pkg = tourPackageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tour package not found with id: " + id));
        pkg.setActive(false);
        tourPackageRepository.save(pkg);
    }

    private void copyProperties(TourPackageDTO dto, TourPackage pkg, Destination destination) {
        pkg.setTitle(dto.getTitle());
        pkg.setDestination(destination);
        pkg.setCategory(dto.getCategory() != null ? dto.getCategory() : TourCategory.ADVENTURE);
        pkg.setDurationDays(dto.getDurationDays());
        pkg.setDurationNights(dto.getDurationNights());
        pkg.setBasePrice(dto.getBasePrice());
        pkg.setDiscountedPrice(dto.getDiscountedPrice());
        pkg.setDifficulty(dto.getDifficulty() != null ? dto.getDifficulty() : Difficulty.MODERATE);
        pkg.setMaxGroupSize(dto.getMaxGroupSize() > 0 ? dto.getMaxGroupSize() : 16);
        pkg.setAvailableSlots(dto.getAvailableSlots() > 0 ? dto.getAvailableSlots() : 12);
        pkg.setBannerImageUrl(dto.getBannerImageUrl());
        pkg.setOverview(dto.getOverview());
        if (dto.getInclusions() != null) pkg.setInclusions(new ArrayList<>(dto.getInclusions()));
        if (dto.getExclusions() != null) pkg.setExclusions(new ArrayList<>(dto.getExclusions()));
        if (dto.getHighlights() != null) pkg.setHighlights(new ArrayList<>(dto.getHighlights()));

        if (dto.getItinerary() != null) {
            pkg.getItinerary().clear();
            for (TourPackageDTO.ItineraryDayDTO dayDTO : dto.getItinerary()) {
                ItineraryDay day = new ItineraryDay(
                        dayDTO.getDayNumber(),
                        dayDTO.getTitle(),
                        dayDTO.getDescription(),
                        dayDTO.getAccommodation(),
                        dayDTO.getMealsIncluded()
                );
                pkg.addItineraryDay(day);
            }
        }
    }

    public TourPackageDTO mapToDTO(TourPackage pkg) {
        TourPackageDTO dto = new TourPackageDTO();
        dto.setId(pkg.getId());
        dto.setTitle(pkg.getTitle());
        if (pkg.getDestination() != null) {
            dto.setDestinationId(pkg.getDestination().getId());
            dto.setDestinationName(pkg.getDestination().getName());
            dto.setDestinationCountry(pkg.getDestination().getCountry());
        }
        dto.setCategory(pkg.getCategory());
        dto.setDurationDays(pkg.getDurationDays());
        dto.setDurationNights(pkg.getDurationNights());
        dto.setBasePrice(pkg.getBasePrice());
        dto.setDiscountedPrice(pkg.getDiscountedPrice());
        dto.setDifficulty(pkg.getDifficulty());
        dto.setMaxGroupSize(pkg.getMaxGroupSize());
        dto.setAvailableSlots(pkg.getAvailableSlots());
        dto.setRating(pkg.getRating());
        dto.setReviewCount(pkg.getReviewCount());
        dto.setBannerImageUrl(pkg.getBannerImageUrl());
        dto.setOverview(pkg.getOverview());
        dto.setInclusions(pkg.getInclusions());
        dto.setExclusions(pkg.getExclusions());
        dto.setHighlights(pkg.getHighlights());
        dto.setActive(pkg.isActive());

        if (pkg.getItinerary() != null) {
            List<TourPackageDTO.ItineraryDayDTO> itineraryDTOs = pkg.getItinerary().stream()
                    .map(d -> new TourPackageDTO.ItineraryDayDTO(
                            d.getDayNumber(),
                            d.getTitle(),
                            d.getDescription(),
                            d.getAccommodation(),
                            d.getMealsIncluded()
                    ))
                    .collect(Collectors.toList());
            dto.setItinerary(itineraryDTOs);
        }
        return dto;
    }
}
