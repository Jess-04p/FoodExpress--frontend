import React, { useState, useEffect } from 'react';
import { Container, Table, Alert, Badge, Button, Navbar, Offcanvas } from 'react-bootstrap';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { List, House, ClockHistory, CheckCircle } from 'react-bootstrap-icons';
import 'react-toastify/dist/ReactToastify.css';
 
const RestaurantOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const [restaurantId, setRestaurantId] = useState(null);
  const navigate = useNavigate();
 
  useEffect(() => {
    const fetchRestaurantId = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8083/api/v1/restaurants/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRestaurantId(response.data.id);
      } catch (error) {
        console.error('Error fetching restaurant details:', error);
        setError('Failed to load restaurant details');
        toast.error('Failed to load restaurant details');
      }
    };
 
    if (userId && token) {
      fetchRestaurantId();
    }
  }, [userId, token]);
 
  useEffect(() => {
    const fetchOrders = async () => {
      if (!restaurantId) return;
 
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8070/api/v1/order/restaurants/getAllOrders/${restaurantId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to load orders. Please try again later.');
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
 
    if (restaurantId && token) {
      fetchOrders();
    }
  }, [restaurantId, token]);
 
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'ACCEPTED':
        return 'warning';
      case 'PREPARING':
        return 'primary';
      case 'READY':
        return 'success';
      case 'DELIVERED':
        return 'success';
      case 'PENDING':
        return 'info';
      default:
        return 'secondary';
    }
  };
 
  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'ACCEPTED':
        return 'PREPARING';
      case 'PREPARING':
        return 'READY';
      default:
        return null;
    }
  };
 
  const updateOrderStatus = async (orderId, currentStatus) => {
    const nextStatus = getNextStatus(currentStatus);
    if (!nextStatus) return;
 
    try {
      setUpdatingOrderId(orderId);
      console.log(`Updating order ${orderId} status to ${nextStatus}`);
      await axios.put(
        `http://localhost:8070/api/v1/order/communication/update/${orderId}/${nextStatus}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
 
      // Update the local state to reflect the change
      setOrders(orders.map(order =>
        order.orderId === orderId
          ? { ...order, status: nextStatus }
          : order
      ));
 
      toast.success(`Order status updated to ${nextStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };
 
  const handleMenuClick = (route) => {
    setShowMenu(false);
    if (route === 'home') {
      navigate(`/restaurant/${userId}`);
    } else if (route === 'add-menu' || route === 'my-menu') {
      navigate(`/restaurant/${userId}`, { state: { view: route } });
    } else {
      navigate(route);
    }
  };
 
  if (loading) {
    return (
      <Container className="mt-5">
        <div className="text-center">Loading orders...</div>
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
            Restaurant Dashboard
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
              onClick={() => handleMenuClick('add-menu')}
              className="text-start border-0 shadow-sm"
              style={{
                color: '#E94B3C',
                backgroundColor: '#fff',
                transition: 'all 0.3s ease'
              }}
            >
              <i className="bi bi-plus-circle me-2"></i>Add Menu Items
            </Button>
            <Button
              variant="outline-danger"
              size="lg"
              onClick={() => handleMenuClick('my-menu')}
              className="text-start border-0 shadow-sm"
              style={{
                color: '#E94B3C',
                backgroundColor: '#fff',
                transition: 'all 0.3s ease'
              }}
            >
              <i className="bi bi-grid me-2"></i>My Menu
            </Button>
            <Button
              variant="outline-danger"
              size="lg"
              onClick={() => handleMenuClick(`/restaurant/${userId}/orders`)}
              className="text-start border-0 shadow-sm"
              style={{
                color: '#E94B3C',
                backgroundColor: '#fff',
                transition: 'all 0.3s ease'
              }}
            >
              <ClockHistory className="me-2" />Active Orders
            </Button>
            <Button
              variant="outline-danger"
              size="lg"
              onClick={() => handleMenuClick(`/restaurant/${userId}/served-orders`)}
              className="text-start border-0 shadow-sm"
              style={{
                color: '#E94B3C',
                backgroundColor: '#fff',
                transition: 'all 0.3s ease'
              }}
            >
              <CheckCircle className="me-2" />Served Meals
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
 
      <Container className="py-4">
        <h2 className="text-center mb-4">Active Orders</h2>
        {orders.length === 0 ? (
          <Alert variant="info">No orders found</Alert>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer Name</th>
                <th>Order Date</th>
                <th>Status</th>
                <th>Payment Method</th>
                <th>Payment Status</th>
                <th>Total Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderId}>
                  <td>{order.orderId}</td>
                  <td>{order.firstName}</td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                  <td>
                    <Badge bg={getStatusBadgeVariant(order.status)}>
                      {order.status}
                    </Badge>
                  </td>
                  <td>{order.paymentMethod}</td>
                  <td>
                    <Badge bg={order.paymentStatus === 'SUCCESS' ? 'success' : 'danger'}>
                      {order.paymentStatus}
                    </Badge>
                  </td>
                  <td>₹{order.totalAmount}</td>
                  <td>
                    {getNextStatus(order.status) && (
                      <Button
                        variant="primary"
                        size="sm"
                        disabled={updatingOrderId === order.orderId}
                        onClick={() => updateOrderStatus(order.orderId, order.status)}
                      >
                        {updatingOrderId === order.orderId ? (
                          'Updating...'
                        ) : (
                          `Mark as ${getNextStatus(order.status)}`
                        )}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
      <ToastContainer position="top-right" />
    </div>
  );
};
 
export default RestaurantOrders;
 