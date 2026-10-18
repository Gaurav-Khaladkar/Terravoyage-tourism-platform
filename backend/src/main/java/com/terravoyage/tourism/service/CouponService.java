package com.terravoyage.tourism.service;

import com.terravoyage.tourism.domain.Coupon;
import com.terravoyage.tourism.dto.CouponValidationDTO;
import com.terravoyage.tourism.repository.CouponRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Service
public class CouponService {

    private final CouponRepository couponRepository;

    public CouponService(CouponRepository couponRepository) {
        this.couponRepository = couponRepository;
    }

    public CouponValidationDTO validateCoupon(String code, Double baseAmount) {
        if (code == null || code.trim().isEmpty()) {
            return new CouponValidationDTO(code, baseAmount, false, 0.0, baseAmount, "No promo code provided");
        }

        Optional<Coupon> couponOpt = couponRepository.findByCodeIgnoreCaseAndActiveTrue(code.trim());
        if (couponOpt.isEmpty()) {
            return new CouponValidationDTO(code, baseAmount, false, 0.0, baseAmount, "Promo code is invalid or expired");
        }

        Coupon coupon = couponOpt.get();

        if (coupon.getValidUntil() != null && coupon.getValidUntil().isBefore(LocalDate.now())) {
            return new CouponValidationDTO(code, baseAmount, false, 0.0, baseAmount, "Promo code has expired");
        }

        if (baseAmount != null && baseAmount < coupon.getMinSpend()) {
            return new CouponValidationDTO(code, baseAmount, false, 0.0, baseAmount,
                    String.format("Minimum spend of $%.2f required for this coupon", coupon.getMinSpend()));
        }

        double calculatedDiscount = (baseAmount != null ? baseAmount : 0.0) * (coupon.getDiscountPercent() / 100.0);
        if (calculatedDiscount > coupon.getMaxDiscount()) {
            calculatedDiscount = coupon.getMaxDiscount();
        }

        double finalAmount = Math.max(0.0, (baseAmount != null ? baseAmount : 0.0) - calculatedDiscount);

        return new CouponValidationDTO(
                coupon.getCode(),
                baseAmount,
                true,
                calculatedDiscount,
                finalAmount,
                String.format("Success! %.0f%% discount applied (saved $%.2f)", coupon.getDiscountPercent(), calculatedDiscount)
        );
    }
}
