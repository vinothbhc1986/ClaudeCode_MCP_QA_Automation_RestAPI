package com.example.productapi.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class ProductControllerOpenApiTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    public void openApiDocsContainsProductsPath() {
        ResponseEntity<String> resp = restTemplate.getForEntity("/v3/api-docs", String.class);
        assertEquals(HttpStatus.OK, resp.getStatusCode());
        String body = resp.getBody();
        assertNotNull(body);
        assertTrue(body.contains("/api/products"), "OpenAPI docs should contain /api/products path");
    }
}
