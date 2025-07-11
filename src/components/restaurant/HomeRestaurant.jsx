import React from 'react';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import './HomeRestaurant.css';
 
const HomeRestaurant = ({ restaurantDetails, onStatusChange }) => {
  const handleStatusToggle = (e) => {
    if (onStatusChange) {
      onStatusChange(e.target.checked);
    }
  };
 
  return (
    <Container fluid className="home-restaurant-container">
      <Container className="my-5 position-relative">
        <div className="status-toggle-wrapper">
          <div className="d-flex align-items-center">
            <Form.Check
              type="switch"
              id="status-toggle"
              checked={restaurantDetails?.open}
              onChange={handleStatusToggle}
              className="status-toggle me-2"
            />
            <span className={`status-label ${restaurantDetails?.open ? 'text-success' : 'text-danger'}`}>
              {restaurantDetails?.open ? 'Open' : 'Closed'}
            </span>
          </div>
        </div>
 
        <div className="text-center mb-5">
          <h2 className="welcome-greeting mb-3">
            Welcome, {restaurantDetails?.restaurantName || 'Restaurant Owner'} 👋
          </h2>
        </div>
 
        <Row>
          <Col md={8} className="mx-auto">
            <Card className="shadow">
              <Card.Body>
                <h2 className="text-center mb-4">Restaurant Information</h2>
                <Row className="g-3">
                  <Col md={6}>
                    <div className="detail-item">
                      <h5 className="text-muted">Location</h5>
                      <p className="mb-3">{restaurantDetails?.restaurantLocation}</p>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="detail-item">
                      <h5 className="text-muted">Contact Number</h5>
                      <p className="mb-3">{restaurantDetails?.contactNumber}</p>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="detail-item">
                      <h5 className="text-muted">Email</h5>
                      <p className="mb-3">{restaurantDetails?.email}</p>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="detail-item">
                      <h5 className="text-muted">Pin Code</h5>
                      <p className="mb-3">{restaurantDetails?.restaurantPin}</p>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};
 
export default HomeRestaurant;
 