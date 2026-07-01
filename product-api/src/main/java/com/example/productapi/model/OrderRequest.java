package com.example.productapi.model;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class OrderRequest {

    @NotNull(message = "productId is required")
    private String productId;

    @NotNull(message = "quantity is required")
    @Min(value = 1, message = "quantity must be greater than 0")
    private Integer quantity;

    public OrderRequest() {}

    public OrderRequest(String productId, Integer quantity) {
        this.productId = productId;
        this.quantity = quantity;
    }

    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}