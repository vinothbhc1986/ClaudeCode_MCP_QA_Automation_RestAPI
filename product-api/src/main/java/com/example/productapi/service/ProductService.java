package com.example.productapi.service;

import com.example.productapi.exception.BadRequestException;
import com.example.productapi.exception.InsufficientStockException;
import com.example.productapi.exception.ResourceNotFoundException;
import com.example.productapi.model.*;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class ProductService {

    private final Map<String, Product> productStore = new ConcurrentHashMap<>();
    private final Map<String, OrderResponse> orderStore = new ConcurrentHashMap<>();
    private final AtomicInteger orderCounter = new AtomicInteger(1);

    public void loadProducts(List<Product> products) {
        products.forEach(p -> productStore.put(p.getProductId(), p));
    }

    public List<Product> getAllProducts() {
        return new ArrayList<>(productStore.values());
    }
    
    public void checkProductIdIsValid(String productId) {
        if (productId == null || !productId.matches("PROD-\\d{3}")) {
            throw new BadRequestException("Invalid product ID format: " + productId);
        }
    }  

    public InventoryResponse getInventory(String productId) {
        checkProductIdIsValid(productId);
        Product p = productStore.get(productId);
        if (p == null) {
            throw new ResourceNotFoundException("Product not found: " + productId);
        }
        return new InventoryResponse(p.getProductId(), p.getName(), p.getStockStatus(), p.getQuantity());
    }

    public OrderResponse createOrder(OrderRequest request) {
        if (request.getQuantity() < 1) {
            throw new BadRequestException("Quantity must be at least 1");
        }

        checkProductIdIsValid(request.getProductId());
        Product p = productStore.get(request.getProductId());
        if (p == null) {
            throw new ResourceNotFoundException("Product not found: " + request.getProductId());
        }

        synchronized (p) {
            if (p.getQuantity() < request.getQuantity()) {
                throw new InsufficientStockException(
                        "Insufficient stock for " + p.getName() +
                        ". Available: " + p.getQuantity() +
                        ", Requested: " + request.getQuantity());
            }
            p.setQuantity(p.getQuantity() - request.getQuantity());
            updateStockStatus(p);
        }

        String orderId = "ORD-" + String.format("%05d", orderCounter.getAndIncrement());
        double total = p.getPrice() * request.getQuantity();

        OrderResponse order = new OrderResponse(orderId, p.getProductId(), p.getName(),
                request.getQuantity(), p.getPrice(), total, "CONFIRMED", Instant.now().toString());
        orderStore.put(orderId, order);
        return order;
    }

    public PriceUpdateResponse updatePrice(PriceUpdateRequest request) {
        if (request.getNewPrice() <= 0) {
            throw new BadRequestException("Price must be greater than 0");
        }

        checkProductIdIsValid(request.getProductId());

        Product p = productStore.get(request.getProductId());
        if (p == null) {
            throw new ResourceNotFoundException("Product not found: " + request.getProductId());
        }

        double oldPrice = p.getPrice();
        p.setPrice(request.getNewPrice());

        return new PriceUpdateResponse(p.getProductId(), p.getName(),
                oldPrice, request.getNewPrice(), Instant.now().toString());
    }

    public void cancelOrder(String orderId) {
        if (!orderId.matches("ORD-\\d{5}")) {
            throw new BadRequestException("Invalid order ID format: " + orderId);
        }
        if (!orderStore.containsKey(orderId)) {
            throw new ResourceNotFoundException("Order not found: " + orderId);
        }
        orderStore.remove(orderId);
    }

    private void updateStockStatus(Product p) {
        if (p.getQuantity() == 0) {
            p.setStockStatus("OUT_OF_STOCK");
        } else if (p.getQuantity() <= 10) {
            p.setStockStatus("LOW_STOCK");
        } else {
            p.setStockStatus("IN_STOCK");
        }
    }
}
