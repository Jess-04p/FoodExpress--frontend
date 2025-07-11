import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
 
const RestaurantDetails = () => {
  const [restaurantDetails, setRestaurantDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
 
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
 
  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8083/api/v1/restaurants/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          }
        );
       
        if (!response.data) {
          throw new Error('No restaurant data received');
        }
       
        setRestaurantDetails(response.data);
      } catch (error) {
        console.error('Error fetching restaurant details:', error);
        setError(error.response?.data?.message || 'Failed to load restaurant details');
      } finally {
        setLoading(false);
      }
    };
 
    if (userId && token) {
      fetchRestaurantDetails();
    } else {
      setError('User ID or token not found. Please login again.');
      setLoading(false);
    }
  }, [userId, token]);
 
  if (loading) {
    return (
      <Container className="mt-5">
        <div className="text-center">Loading restaurant details...</div>
      </Container>
    );
  }
 
  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }
 
  return (
    <Container className="mt-5">
      <Card className="shadow">
        <Card.Header className="bg-info text-white">
          <h2 className="mb-0">Restaurant Details</h2>
        </Card.Header>
        <Card.Body>
          {restaurantDetails && (
            <>
              <Card.Title className="mb-4">{restaurantDetails.restaurantName}</Card.Title>
              <div className="mb-3">
                <strong>Location:</strong> {restaurantDetails.restaurantLocation}
              </div>
              <div className="mb-3">
                <strong>Pin Code:</strong> {restaurantDetails.restaurantPin}
              </div>
              <div className="mb-3">
                <strong>Contact Number:</strong> {restaurantDetails.contactNumber}
              </div>
              <div className="mb-3">
                <strong>Email:</strong> {restaurantDetails.email || 'Not provided'}
              </div>
              <div className="mb-4">
                <strong>Status:</strong>{' '}
                <span className={`badge bg-${restaurantDetails.open ? 'success' : 'danger'}`}>
                  {restaurantDetails.open ? 'Open' : 'Closed'}
                </span>
              </div>
              <Button variant="secondary" onClick={() => navigate(-1)}>
                Back to Dashboard
              </Button>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};
 
export default RestaurantDetails;
 