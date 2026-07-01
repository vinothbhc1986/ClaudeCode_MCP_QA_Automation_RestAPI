package com.example.productapi.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class PriceUpdateRequest {

    @NotNull(message = "Product ID is required")
    private String productId;

    @NotNull(message = "newPrice is required")
    @Positive(message = "Price must be a positive number")
    private Double newPrice;

    public PriceUpdateRequest() {}

    public PriceUpdateRequest(String productId, double newPrice) {
        this.productId = productId;
        this.newPrice = newPrice;
    }

    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }

    public Double getNewPrice() { return newPrice; }
    public void setNewPrice(Double newPrice) { this.newPrice = newPrice; }
}