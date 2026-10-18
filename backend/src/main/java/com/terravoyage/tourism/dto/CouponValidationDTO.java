package com.terravoyage.tourism.dto;

public class CouponValidationDTO {

    private String code;
    private Double baseAmount;
    private boolean valid;
    private Double discountAmount;
    private Double finalAmount;
    private String message;

    public CouponValidationDTO() {}

    public CouponValidationDTO(String code, Double baseAmount, boolean valid, Double discountAmount, Double finalAmount, String message) {
        this.code = code;
        this.baseAmount = baseAmount;
        this.valid = valid;
        this.discountAmount = discountAmount;
        this.finalAmount = finalAmount;
        this.message = message;
    }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public Double getBaseAmount() { return baseAmount; }
    public void setBaseAmount(Double baseAmount) { this.baseAmount = baseAmount; }

    public boolean isValid() { return valid; }
    public void setValid(boolean valid) { this.valid = valid; }

    public Double getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(Double discountAmount) { this.discountAmount = discountAmount; }

    public Double getFinalAmount() { return finalAmount; }
    public void setFinalAmount(Double finalAmount) { this.finalAmount = finalAmount; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
