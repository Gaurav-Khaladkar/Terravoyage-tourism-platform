package com.terravoyage.tourism.controller;

import com.terravoyage.tourism.dto.ApiResponse;
import com.terravoyage.tourism.dto.CouponValidationDTO;
import com.terravoyage.tourism.service.CouponService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/coupons")
@Tag(name = "Coupons & Promotional Offers", description = "Discount coupons validation engine")
public class CouponController {

    private final CouponService couponService;

    public CouponController(CouponService couponService) {
        this.couponService = couponService;
    }

    @GetMapping("/validate")
    @Operation(summary = "Validate promo code and calculate discount")
    public ResponseEntity<ApiResponse<CouponValidationDTO>> validateCoupon(
            @RequestParam String code,
            @RequestParam(required = false, defaultValue = "0.0") Double baseAmount
    ) {
        CouponValidationDTO result = couponService.validateCoupon(code, baseAmount);
        return ResponseEntity.ok(ApiResponse.success("Coupon evaluation complete", result));
    }
}
