package com.terravoyage.tourism.controller;

import com.terravoyage.tourism.domain.Destination;
import com.terravoyage.tourism.dto.ApiResponse;
import com.terravoyage.tourism.service.DestinationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/destinations")
@Tag(name = "Destinations", description = "Endpoints for exploring world destinations and countries")
public class DestinationController {

    private final DestinationService destinationService;

    public DestinationController(DestinationService destinationService) {
        this.destinationService = destinationService;
    }

    @GetMapping
    @Operation(summary = "Get all tourist destinations")
    public ResponseEntity<ApiResponse<List<Destination>>> getAllDestinations() {
        return ResponseEntity.ok(ApiResponse.success("Destinations retrieved", destinationService.getAllDestinations()));
    }

    @GetMapping("/featured")
    @Operation(summary = "Get featured destinations")
    public ResponseEntity<ApiResponse<List<Destination>>> getFeaturedDestinations() {
        return ResponseEntity.ok(ApiResponse.success("Featured destinations retrieved", destinationService.getFeaturedDestinations()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get destination details by ID")
    public ResponseEntity<ApiResponse<Destination>> getDestinationById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Destination found", destinationService.getDestinationById(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new destination (Admin only)")
    public ResponseEntity<ApiResponse<Destination>> createDestination(@RequestBody Destination destination) {
        return ResponseEntity.ok(ApiResponse.success("Destination created", destinationService.createDestination(destination)));
    }
}
