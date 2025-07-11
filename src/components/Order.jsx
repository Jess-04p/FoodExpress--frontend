import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
 
const Order = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
 
  return (
    <Container className="text-center my-5" data-aos="zoom-in">
      <h1 className="text-success mb-4">🎉 Order Placed Successfully!</h1>
      <p className="mb-4">Thank you for ordering with <strong>FoodExpress</strong>. Your delicious food is on the way!</p>
      <Button variant="primary" onClick={() => navigate(`/customer/${userId}`)}>
        Go to Dashboard
      </Button>
    </Container>
  );
};
 
export default Order;