import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
 
const Features = () => {
  return (
    <Container id="why-foodexpress" className="my-5">
      <h2 className="text-center mb-4" data-aos="fade-up">Why Choose FoodExpress?</h2>
      <Row className="g-4">
        <Col md={4} data-aos="fade-up">
          <Card className="h-100 shadow">
            <Card.Body>
              <Card.Title>⚡ Fast Delivery</Card.Title>
              <Card.Text>We deliver your food in record time. Always hot and fresh.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} data-aos="fade-up" data-aos-delay="200">
          <Card className="h-100 shadow">
            <Card.Body>
              <Card.Title>🍔 Top Restaurants</Card.Title>
              <Card.Text>We partner with the most loved restaurants around you.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} data-aos="fade-up" data-aos-delay="400">
          <Card className="h-100 shadow">
            <Card.Body>
              <Card.Title>📦 Live Order Tracking</Card.Title>
              <Card.Text>Track your food in real-time from kitchen to your door.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
 
export default Features;