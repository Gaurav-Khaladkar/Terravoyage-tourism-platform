package com.terravoyage.tourism.controller;

import com.terravoyage.tourism.domain.PaymentTransaction;
import com.terravoyage.tourism.dto.ApiResponse;
import com.terravoyage.tourism.dto.PaymentIntentDTO;
import com.terravoyage.tourism.security.UserPrincipal;
import com.terravoyage.tourism.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/payments")
@Tag(name = "Payment Gateway Simulator", description = "Simulated zero-friction multi-method payment processing")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/checkout")
    @Operation(summary = "Process transaction and confirm payment for a booking")
    public ResponseEntity<ApiResponse<PaymentTransaction>> processPayment(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody PaymentIntentDTO dto
    ) {
        PaymentTransaction txn = paymentService.processPayment(currentUser, dto);
        return ResponseEntity.ok(ApiResponse.success("Payment processed successfully", txn));
    }
}
