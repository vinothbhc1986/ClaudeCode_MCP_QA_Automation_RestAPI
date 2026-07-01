package com.example.productapi.controller;

import com.example.productapi.model.OrderRequest;
import com.example.productapi.model.OrderResponse;
import com.example.productapi.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;

import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private ProductService productService;

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody OrderRequest request) {
        OrderResponse response = productService.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<Map<String, String>> cancelOrder(@PathVariable String orderId) {
        productService.cancelOrder(orderId);
         return ResponseEntity.noContent().build();
    }
}
