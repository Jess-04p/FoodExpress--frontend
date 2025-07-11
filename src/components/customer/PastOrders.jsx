import React, { useState, useEffect } from 'react';
import { Container, Card, Alert, Button, Badge, Row, Col, Navbar, Offcanvas } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { List, House, Clock, ClockHistory } from 'react-bootstrap-icons';
 
const PastOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
 
  const handleMenuClick = (path) => {
    setShowMenu(false);
    if (path === 'home') {
      navigate(`/customer/${userId}`);
    } else {
      navigate(path);
    }
  };
 
  // Get status badge variant
  const getStatusBadgeVariant = (status) => {
    return status === 'DELIVERED' ? 'success' :
           status === 'CANCELLED' ? 'danger' : 'secondary';
  };
 
  // Get payment badge variant
  const getPaymentBadgeVariant = (paymentStatus) => {
    return paymentStatus === 'SUCCESS' ? 'success' : 'warning';
  };
 
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8070/api/v1/order/customer/getPastOrders/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        const allOrders = Array.isArray(response.data) ? response.data : [response.data].filter(Boolean);
        const pastOrders = allOrders.filter(order =>
          ['DELIVERED', 'COMPLETED'].includes(order.status)
        );
        setOrders(pastOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
        toast.error('Failed to fetch past orders');
      } finally {
        setLoading(false);
      }
    };
 
    if (userId && token) {
      fetchOrders();
    } else {
      setOrders([]);
      setLoading(false);
    }
  }, [userId, token]);
 
  if (loading) {
    return <Alert variant="info" className="text-center">Loading orders...</Alert>;
  }
 
  return (
    <div style={{
      background: 'linear-gradient(135deg, #fff5ec 0%, #ffe7d4 100%)',
      minHeight: '100vh',
      padding: '2rem'
    }}>
      <Navbar expand="lg" className="mb-4" style={{
        background: 'linear-gradient(135deg, #E94B3C 0%, #FF6347 100%)',
        boxShadow: '0 2px 10px rgba(233, 75, 60, 0.2)'
      }}>
        <Container fluid>
          <Button
            variant="outline-light"
            onClick={() => setShowMenu(true)}
            className="d-flex align-items-center"
            style={{ borderColor: 'rgba(255, 255, 255, 0.5)' }}
          >
            <List size={24} />
          </Button>
          <Navbar.Brand className="mx-auto fw-bold" style={{
            color: '#fff',
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
          }}>
            Past Orders
          </Navbar.Brand>
        </Container>
      </Navbar>
 
      <Offcanvas
        show={showMenu}
        onHide={() => setShowMenu(false)}
        backdrop={true}
        style={{ background: 'linear-gradient(135deg, #fff5ec 0%, #ffe7d4 100%)' }}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title style={{ color: '#E94B3C', fontWeight: 600 }}>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="d-grid gap-3">
            <Button
              variant="outline-danger"
              size="lg"
              onClick={() => handleMenuClick('home')}
              className="text-start border-0 shadow-sm"
              style={{
                color: '#E94B3C',
                backgroundColor: '#fff',
                transition: 'all 0.3s ease'
              }}
            >
              <House className="me-2" />Home
            </Button>
            <Button
              variant="outline-danger"
              size="lg"
              onClick={() => handleMenuClick(`/customer/${userId}/restaurants`)}
              className="text-start border-0 shadow-sm"
              style={{
                color: '#E94B3C',
                backgroundColor: '#fff',
                transition: 'all 0.3s ease'
              }}
            >
              Available Restaurants
            </Button>
            <Button
              variant="outline-danger"
              size="lg"
              onClick={() => handleMenuClick(`/customer/${userId}/current-orders`)}
              className="text-start border-0 shadow-sm"
              style={{
                color: '#E94B3C',
                backgroundColor: '#fff',
                transition: 'all 0.3s ease'
              }}
            >
              <Clock className="me-2" />Current Orders
            </Button>
            <Button
              variant="outline-danger"
              size="lg"
              onClick={() => handleMenuClick(`/customer/${userId}/past-orders`)}
              className="text-start border-0 shadow-sm"
              style={{
                color: '#E94B3C',
                backgroundColor: '#fff',
                transition: 'all 0.3s ease'
              }}
            >
              <ClockHistory className="me-2" />Past Orders
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
 
      <Container className="py-4">
        {orders.length === 0 ? (
          <Alert variant="info" className="text-center">No past orders found</Alert>
        ) : (
          <Row>
            {orders.map(order => (
              <Col xs={12} key={order.orderId} className="mb-4">
                <Card className="shadow h-100" style={{ backgroundColor: '#fff9ec', borderRadius: '15px' }}>
                  <Card.Header className="d-flex justify-content-between align-items-center"
                    style={{ backgroundColor: '#fff3d6', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <h5 className="mb-0">Order #{order.orderId}</h5>
                    <Badge bg={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                  </Card.Header>
                  <Card.Body>
                    <Row className="mb-3">
                      <Col md={6}>
                        <h6>{order.restaurantName}</h6>
                        <p className="text-muted mb-2">{order.items}</p>
                        <p className="mb-2">
                          <strong>Total Amount:</strong> ₹{order.totalAmount}
                        </p>
                        <p className="mb-2">
                          {/* <strong>Delivery Agent:</strong> {order.deliveryAgent} */}
                        </p>
                      </Col>
                      <Col md={6} className="text-md-end">
                        <p className="mb-2">
                          <strong>Ordered on:</strong>{' '}
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <p className="mb-2">
                          <strong>Payment Method:</strong> {order.paymentMethod}
                        </p>
                        <p className="mb-2">
                          <Badge bg={getPaymentBadgeVariant(order.paymentStatus)}>
                            Payment {order.paymentStatus}
                          </Badge>
                        </p>
                        {order.rating && (
                          <p className="mb-0">
                            <strong>Rating:</strong>{' '}
                            {'⭐'.repeat(order.rating)}
                          </p>
                        )}
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
};
 
export default PastOrders;
 