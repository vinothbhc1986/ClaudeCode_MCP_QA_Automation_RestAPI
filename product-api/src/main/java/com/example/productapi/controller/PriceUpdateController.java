package com.example.productapi.controller;

import com.example.productapi.model.PriceUpdateRequest;
import com.example.productapi.model.PriceUpdateResponse;
import com.example.productapi.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/products")
public class PriceUpdateController {

    @Autowired
    private ProductService productService;

   @PutMapping("/price-update")
    public ResponseEntity<PriceUpdateResponse> updatePrice(@Valid @RequestBody PriceUpdateRequest request) {
    return ResponseEntity.ok(productService.updatePrice(request));
}
}
