package com.menu.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;

import com.menu.dto.CartDTO;
import com.menu.dto.MenuItemDTO;
import com.menu.dto.RestaurantDTO;
import com.menu.enums.Category;
import com.menu.service.CustomerMenuService;

class CustomerMenuControllerTest {

    @Mock
    private CustomerMenuService customerMenuService;

    @InjectMocks
    private CustomerMenuController customerMenuController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getNearbyRestaurants_Success() {
        // Arrange
        Long customerId = 1L;
        List<RestaurantDTO> mockRestaurants = Arrays.asList(
            new RestaurantDTO(1L, "Restaurant 1", "Location 1", true),
            new RestaurantDTO(2L, "Restaurant 2", "Location 2", false)
        );
        when(customerMenuService.getNearbyRestaurants(customerId)).thenReturn(mockRestaurants);

        // Act
        ResponseEntity<List<RestaurantDTO>> response = customerMenuController.getNearbyRestaurants(customerId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody().size());
        verify(customerMenuService).getNearbyRestaurants(customerId);
    }

    @Test
    void getNearbyRestaurants_EmptyList() {
        // Arrange
        Long customerId = 1L;
        when(customerMenuService.getNearbyRestaurants(customerId)).thenReturn(Collections.emptyList());

        // Act
        ResponseEntity<List<RestaurantDTO>> response = customerMenuController.getNearbyRestaurants(customerId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().isEmpty());
    }

    @Test
    void getNearbyRestaurants_NullCustomerId() {
        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> 
            customerMenuController.getNearbyRestaurants(null));
    }

    @Test
    void getRestaurantById_Success() {
        // Arrange
        Long restaurantId = 1L;
        RestaurantDTO mockRestaurant = new RestaurantDTO(restaurantId, "Test Restaurant", "Test Location", true);
        when(customerMenuService.getRestaurantById(restaurantId)).thenReturn(mockRestaurant);

        // Act
        ResponseEntity<RestaurantDTO> response = customerMenuController.getRestaurantById(restaurantId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Test Restaurant", response.getBody().getRestaurantName());
    }

    @Test
    void getRestaurantById_NotFound() {
        // Arrange
        Long restaurantId = 999L;
        when(customerMenuService.getRestaurantById(restaurantId))
            .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "Restaurant not found"));

        // Act & Assert
        assertThrows(ResponseStatusException.class, () -> 
            customerMenuController.getRestaurantById(restaurantId));
    }

    @Test
    void getRestaurantMenu_Success() {
        // Arrange
        Long restaurantId = 1L;
        List<MenuItemDTO> mockMenu = Arrays.asList(
            new MenuItemDTO(1L, "Item 1", 10.0, Category.VEG),
            new MenuItemDTO(2L, "Item 2", 15.0, Category.NONVEG)
        );
        when(customerMenuService.getRestaurantMenu(restaurantId)).thenReturn(mockMenu);

        // Act
        ResponseEntity<List<MenuItemDTO>> response = customerMenuController.getRestaurantMenu(restaurantId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody().size());
    }

    @Test
    void getRestaurantMenu_EmptyMenu() {
        // Arrange
        Long restaurantId = 1L;
        when(customerMenuService.getRestaurantMenu(restaurantId)).thenReturn(Collections.emptyList());

        // Act
        ResponseEntity<List<MenuItemDTO>> response = customerMenuController.getRestaurantMenu(restaurantId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().isEmpty());
    }

    @Test
    void searchMenuItems_Success() {
        // Arrange
        String query = "Biryani";
        Long customerId = 1L;
        List<MenuItemDTO> mockItems = Arrays.asList(
            new MenuItemDTO(1L, "Chicken Biryani", 200.0, Category.NONVEG),
            new MenuItemDTO(2L, "Veg Biryani", 150.0, Category.VEG)
        );
        when(customerMenuService.searchMenuItems(query, customerId)).thenReturn(mockItems);

        // Act
        ResponseEntity<List<MenuItemDTO>> response = customerMenuController.searchMenuItems(query, customerId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody().size());
    }

    @Test
    void searchMenuItems_NoResults() {
        // Arrange
        String query = "InvalidDish";
        Long customerId = 1L;
        when(customerMenuService.searchMenuItems(query, customerId)).thenReturn(Collections.emptyList());

        // Act
        ResponseEntity<List<MenuItemDTO>> response = customerMenuController.searchMenuItems(query, customerId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().isEmpty());
    }

    @Test
    void searchMenuItems_EmptyQuery() {
        // Arrange
        String query = "";
        Long customerId = 1L;

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () ->
            customerMenuController.searchMenuItems(query, customerId));
    }

    @Test
    void getMenuItemsByCategory_Success() {
        // Arrange
        Long restaurantId = 1L;
        Category category = Category.VEG;
        List<MenuItemDTO> mockItems = Arrays.asList(
            new MenuItemDTO(1L, "Paneer Tikka", 180.0, Category.VEG),
            new MenuItemDTO(2L, "Dal Makhani", 120.0, Category.VEG)
        );
        when(customerMenuService.getMenuItemsByCategory(restaurantId, category)).thenReturn(mockItems);

        // Act
        ResponseEntity<List<MenuItemDTO>> response = customerMenuController.getMenuItemsByCategory(restaurantId, category);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody().size());
        assertTrue(response.getBody().stream().allMatch(item -> item.getCategory() == Category.VEG));
    }

    @Test
    void getMenuItemsByCategory_NoItems() {
        // Arrange
        Long restaurantId = 1L;
        Category category = Category.NONVEG;
        when(customerMenuService.getMenuItemsByCategory(restaurantId, category))
            .thenReturn(Collections.emptyList());

        // Act
        ResponseEntity<List<MenuItemDTO>> response = customerMenuController.getMenuItemsByCategory(restaurantId, category);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().isEmpty());
    }

    @Test
    void addItems_Success() {
        // Arrange
        CartDTO cartDTO = new CartDTO();
        cartDTO.setCustomerId(1L);
        cartDTO.setMenuItemId(1L);
        String expectedResponse = "Items added to cart successfully";
        when(customerMenuService.addItems(cartDTO)).thenReturn(expectedResponse);

        // Act
        String response = customerMenuController.addItems(cartDTO);

        // Assert
        assertEquals(expectedResponse, response);
        verify(customerMenuService).addItems(cartDTO);
    }

    @Test
    void addItems_NullCart() {
        // Act & Assert
        assertThrows(IllegalArgumentException.class, () ->
            customerMenuController.addItems(null));
    }

    @Test
    void addItems_InvalidMenuItem() {
        // Arrange
        CartDTO cartDTO = new CartDTO();
        cartDTO.setCustomerId(1L);
        when(customerMenuService.addItems(cartDTO))
            .thenThrow(new IllegalArgumentException("Invalid menu item"));

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () ->
            customerMenuController.addItems(cartDTO));
    }

    @Test
    void deleteItems_Success() {
        // Arrange
        Long customerId = 1L;
        Long menuItemId = 1L;

        // Act
        customerMenuController.deleteItems(customerId, menuItemId);

        // Assert
        verify(customerMenuService).deleteItems(customerId, menuItemId);
    }

    @Test
    void deleteItems_InvalidIds() {
        // Act & Assert
        assertThrows(IllegalArgumentException.class, () ->
            customerMenuController.deleteItems(null, 1L));
        assertThrows(IllegalArgumentException.class, () ->
            customerMenuController.deleteItems(1L, null));
    }

    @Test
    void deleteItems_ItemNotInCart() {
        // Arrange
        Long customerId = 1L;
        Long menuItemId = 999L;
        doThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "Item not found in cart"))
            .when(customerMenuService).deleteItems(customerId, menuItemId);

        // Act & Assert
        assertThrows(ResponseStatusException.class, () ->
            customerMenuController.deleteItems(customerId, menuItemId));
    }
}