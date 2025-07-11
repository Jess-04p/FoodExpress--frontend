import React, { useEffect, useState } from 'react';
import {
  Container,
  Table,
  Button,
  Alert,
  Navbar,
  Offcanvas,
} from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { List } from 'react-bootstrap-icons';
import axios from 'axios';

const CartPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const highlightItemId = location.state?.highlightItemId;
  const [showMenu, setShowMenu] = useState(false);

  const customerId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem(`cart_items_${customerId}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:8070/api/v1/cart/customer/${customerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const items = res.data.items || [];
      setCartItems(items);
      localStorage.setItem(`cart_items_${customerId}`, JSON.stringify(items));
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      // If API fails, we still have the cached items from localStorage
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customerId && token) fetchCart();
  }, [customerId, token]);

  const handleAdd = async (item) => {
    try {
      await axios.post(
        'http://localhost:8070/api/v1/cart/customer/add',
        {
          customerId,
          menuItemId: item.menuItemId,
          restaurantId: item.restaurantId,
          quantity: 1,
          price: item.price,
          itemName: item.itemName, // ✅ Send itemName as it now exists in the backend Cart entity
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchCart();
    } catch (error) {
      console.error('Add failed:', error);
    }
  };

  const handleRemove = async (item) => {
    try {
      await axios.delete(
        `http://localhost:8070/api/v1/cart/customer/remove?customerId=${customerId}&menuItemId=${item.menuItemId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchCart();
    } catch (error) {
      console.error('Remove failed:', error);
    }
  };

  const handleMenuClick = (path) => {
    setShowMenu(false);
    if (path === 'home') {
      navigate(`/customer/${customerId}`);
    } else {
      navigate(path);
    }
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar bg="dark" variant="dark" className="mb-4">
        <Container fluid>
          <Button
            variant="outline-light"
            onClick={() => setShowMenu(true)}
            className="d-flex align-items-center"
          >
            <List size={24} />
          </Button>
          <Navbar.Brand className="mx-auto">Your Cart</Navbar.Brand>
        </Container>
      </Navbar>

      <Offcanvas
        show={showMenu}
        onHide={() => setShowMenu(false)}
        backdrop={true}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="d-grid gap-2">
            <Button
              variant="outline-primary"
              size="lg"
              onClick={() => handleMenuClick('home')}
              className="text-start"
            >
              Home
            </Button>
            <Button
              variant="outline-primary"
              size="lg"
              onClick={() =>
                handleMenuClick(
                  `/customer/${customerId}/restaurants`
                )
              }
              className="text-start"
            >
              Available Restaurants
            </Button>
            <Button
              variant="outline-primary"
              size="lg"
              onClick={() =>
                handleMenuClick(
                  `/customer/${customerId}/current-orders`
                )
              }
              className="text-start"
            >
              Current Orders
            </Button>
            <Button
              variant="outline-primary"
              size="lg"
              onClick={() =>
                handleMenuClick(
                  `/customer/${customerId}/past-orders`
                )
              }
              className="text-start"
            >
              Past Orders
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      <Container className="my-5">
        {loading ? (
          <Alert variant="info" className="text-center">
            Loading cart...
          </Alert>
        ) : cartItems.length === 0 ? (
          <Alert variant="info" className="text-center">
            Your cart is empty
          </Alert>
        ) : (
          <>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr
                    key={item.menuItemId}
                    className={
                      item.menuItemId === highlightItemId ? 'table-success' : ''
                    }
                  >
                    <td>
                      <strong>{item.itemName}</strong>
                    </td>
                    <td>
                      <Button
                        variant="outline-secondary"
                        onClick={() => handleRemove(item)}
                      >
                        −
                      </Button>
                      <span className="mx-2">{item.quantity}</span>
                      <Button
                        variant="outline-secondary"
                        onClick={() => handleAdd(item)}
                      >
                        +
                      </Button>
                    </td>
                    <td>₹{item.price}</td>
                    <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                    <td>
                      <Button
                        variant="danger"
                        onClick={() => handleRemove({ ...item, quantity: 1 })}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className="text-end mb-3">
              <h4>Total: ₹{totalAmount.toFixed(2)}</h4>
              <Button variant="success" onClick={() => navigate('/payment')}>
                Proceed to Payment
              </Button>
            </div>
          </>
        )}
      </Container>
    </div>
  );
};

export default CartPage;
