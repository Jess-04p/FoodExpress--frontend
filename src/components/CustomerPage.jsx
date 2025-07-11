import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Spinner, Alert, Navbar, Nav, Offcanvas } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Cart3, List, House, Clock, ClockHistory } from 'react-bootstrap-icons';
 
const CustomerPage = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [userName, setUserName] = useState('Guest');
  const [currentView, setCurrentView] = useState('home');
 
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
 
  // Add useEffect to handle userName
  useEffect(() => {
    const name = localStorage.getItem('firstName');
    if (name && name !== 'null' && name !== 'undefined') {
      setUserName(name);
    }
  }, []);
 
  const fetchCart = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8070/api/v1/cart/customer/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const totalItems = res.data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      setCartItemCount(totalItems);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    }
  };
 
  useEffect(() => {
    const fetchNearbyRestaurants = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching restaurants for userId:', userId);
        const response = await axios.get(
          `http://localhost:8083/api/v1/customer/restaurants/nearby?customerId=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log('Restaurants response:', response.data);
        if (Array.isArray(response.data) && response.data.length > 0) {
          setRestaurants(response.data);
        } else {
          setError('No restaurants found in your area');
        }
      } catch (error) {
        console.error('Error fetching nearby restaurants:', error);
        setError(error.response?.data?.message || 'Failed to load restaurants. Please try again.');
      } finally {
        setLoading(false);
      }
    };
 
    if (userId && token) {
      fetchCart();
      fetchNearbyRestaurants();
    } else {
      setError('Please login to view restaurants');
      setLoading(false);
    }
  }, [userId, token]);
 
  // Handle initial view based on URL path
  useEffect(() => {
    if (window.location.pathname.includes('/restaurants')) {
      setCurrentView('restaurants');
    }
  }, []);
 
  const handleMenuClick = (route) => {
    setShowMenu(false);
    if (route === 'home') {
      setCurrentView('home');
      return;
    }
    if (route === 'available-restaurants') {
      setCurrentView('restaurants');
      return;
    }
    navigate(route);
  };
 
  const renderHomeView = () => (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <Card className="text-center p-4" style={{ backgroundColor: '#fff9ec', borderRadius: '15px' }}>
            <Card.Body>
              <h2 className="mb-3">
                {userName === 'Guest' ? 'Welcome!' : `Welcome back, ${userName}!`} 👋
              </h2>
              <p className="text-muted">What would you like to eat today?</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
     
      <Row className="g-4">
        <Col md={4}>
          <Card className="h-100" style={{ backgroundColor: '#fff3d6', cursor: 'pointer' }}
                onClick={() => setCurrentView('restaurants')}>
            <Card.Body className="text-center">
              <House size={40} className="mb-3 text-primary" />
              <Card.Title>Browse Restaurants</Card.Title>
              <Card.Text>Explore our partner restaurants and their menus</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100" style={{ backgroundColor: '#fff3d6', cursor: 'pointer' }}
                onClick={() => navigate(`/customer/${userId}/current-orders`)}>
            <Card.Body className="text-center">
              <Clock size={40} className="mb-3 text-warning" />
              <Card.Title>Current Orders</Card.Title>
              <Card.Text>Track your ongoing orders</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100" style={{ backgroundColor: '#fff3d6', cursor: 'pointer' }}
                onClick={() => navigate(`/customer/${userId}/past-orders`)}>
            <Card.Body className="text-center">
              <ClockHistory size={40} className="mb-3 text-success" />
              <Card.Title>Order History</Card.Title>
              <Card.Text>View your past orders and experiences</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
 
  const renderRestaurantsList = () => (
    <Container>
      {loading && (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading restaurants...</p>
        </div>
      )}
 
      {error && (
        <Alert variant="danger" className="my-3">
          {error}
        </Alert>
      )}
 
      {!loading && !error && (
        <Row>
          {restaurants.length === 0 ? (
            <Col xs={12}>
              <Alert variant="info" className="text-center">
                No restaurants available in your area at the moment.
              </Alert>
            </Col>
          ) : (
            restaurants.map((restaurant) => (
              <Col key={restaurant.id} xs={12} sm={6} md={4} className="mb-4">
                <Card style={{ backgroundColor: '#fff9ec', borderRadius: '12px' }} className="shadow-sm h-100">
                  <Card.Body style={{ backgroundColor: '#fff3d6' }}>
                    <Card.Title>{restaurant.restaurantName}</Card.Title>
                    <Card.Text className="text-muted">
                      {restaurant.restaurantLocation}
                    </Card.Text>
                    <Card.Text className="text-muted small">
                      Pin: {restaurant.restaurantPin}
                    </Card.Text>
                    <Card.Text className="text-muted small">
                      Contact: {restaurant.contactNumber}
                    </Card.Text>
                    <Button
                      variant="warning"
                      onClick={() => navigate(`/menu/${restaurant.id}`)}
                    >
                      View Menu
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
      )}
    </Container>
  );
 
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
            Customer Dashboard
          </Navbar.Brand>
          <Button
            variant="outline-light"
            onClick={() => navigate('/cart')}
            className="d-flex align-items-center gap-2"
            style={{ borderColor: 'rgba(255, 255, 255, 0.5)' }}
          >
            <Cart3 size={20} />
            {cartItemCount > 0 && (
              <span className="badge" style={{
                backgroundColor: '#fff',
                color: '#E94B3C'
              }}>{cartItemCount}</span>
            )}
          </Button>
        </Container>
      </Navbar>
 
      {currentView === 'home' ? renderHomeView() : renderRestaurantsList()}
 
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
              onClick={() => handleMenuClick('available-restaurants')}
              className="text-start border-0 shadow-sm"
              style={{
                color: '#E94B3C',
                backgroundColor: '#fff',
                transition: 'all 0.3s ease'
              }}
            >
              <i className="bi bi-shop me-2"></i>Available Restaurants
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
    </div>
  );
};
 
export default CustomerPage;
 
 
 