package com.terravoyage.tourism.controller;

import com.terravoyage.tourism.domain.Difficulty;
import com.terravoyage.tourism.domain.TourCategory;
import com.terravoyage.tourism.dto.ApiResponse;
import com.terravoyage.tourism.dto.TourPackageDTO;
import com.terravoyage.tourism.service.TourPackageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/packages")
@Tag(name = "Tour Packages & Expeditions", description = "Endpoints for discovering, filtering, and managing vacation packages")
public class TourPackageController {

    private final TourPackageService tourPackageService;

    public TourPackageController(TourPackageService tourPackageService) {
        this.tourPackageService = tourPackageService;
    }

    @GetMapping
    @Operation(summary = "Search and filter tour packages")
    public ResponseEntity<ApiResponse<List<TourPackageDTO>>> searchPackages(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) TourCategory category,
            @RequestParam(required = false) Difficulty difficulty,
            @RequestParam(required = false) Long destinationId,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice
    ) {
        List<TourPackageDTO> packages = tourPackageService.searchPackages(keyword, category, difficulty, destinationId, minPrice, maxPrice);
        return ResponseEntity.ok(ApiResponse.success("Packages retrieved successfully", packages));
    }

    @GetMapping("/featured")
    @Operation(summary = "Get top featured expeditions")
    public ResponseEntity<ApiResponse<List<TourPackageDTO>>> getFeaturedPackages() {
        return ResponseEntity.ok(ApiResponse.success("Featured packages retrieved", tourPackageService.getFeaturedPackages()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get tour package details by ID including day-by-day itinerary")
    public ResponseEntity<ApiResponse<TourPackageDTO>> getPackageById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Package retrieved", tourPackageService.getPackageDTOById(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new tour package (Admin only)")
    public ResponseEntity<ApiResponse<TourPackageDTO>> createPackage(@Valid @RequestBody TourPackageDTO dto) {
        return ResponseEntity.ok(ApiResponse.success("Package created successfully", tourPackageService.createPackage(dto)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update an existing tour package (Admin only)")
    public ResponseEntity<ApiResponse<TourPackageDTO>> updatePackage(@PathVariable Long id, @Valid @RequestBody TourPackageDTO dto) {
        return ResponseEntity.ok(ApiResponse.success("Package updated successfully", tourPackageService.updatePackage(id, dto)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Deactivate/Delete a tour package (Admin only)")
    public ResponseEntity<ApiResponse<Void>> deletePackage(@PathVariable Long id) {
        tourPackageService.deletePackage(id);
        return ResponseEntity.ok(ApiResponse.success("Package deactivated successfully", null));
    }
}
