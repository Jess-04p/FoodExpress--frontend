import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Navbar, Container, Offcanvas } from 'react-bootstrap';
import { Cart3, List } from 'react-bootstrap-icons';

const MenuPage = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const customerId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const [showMenu, setShowMenu] = useState(false);

  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(() => 
    localStorage.getItem(`menu_category_${restaurantId}`) || 'All'
  );
  const [searchQuery, setSearchQuery] = useState(() => 
    localStorage.getItem(`menu_search_${restaurantId}`) || ''
  );
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState({});
  const [lastClickedItemId, setLastClickedItemId] = useState(null);

  useEffect(() => {
    if (!token) navigate('/login');
  }, [token, navigate]);

  const fetchCart = async () => {
    try {
      const res = await axios.get(`http://localhost:8070/api/v1/cart/customer/${customerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const quantities = {};
      res.data.items.forEach(item => {
        quantities[item.menuItemId] = item.quantity;
      });
      setCart(quantities);
    } catch (err) {
      console.error('Failed to fetch cart', err);
    }
  };

  const fetchMenu = async (category, query = '') => {
    try {
      setLoading(true);
      let url = `http://localhost:8083/api/v1/customer/menu/${restaurantId}`;
      if (query.trim()) {
        url = `http://localhost:8083/api/v1/customer/menu/search?query=${query}&customerId=${customerId}`;
      } else if (category !== 'All') {
        url = `http://localhost:8083/api/v1/customer/menu/filter?restaurantId=${restaurantId}&category=${category}`;
      }
      const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
      setMenuItems(res.data || []);
    } catch (err) {
      console.error('Error fetching menu:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu(selectedCategory, searchQuery);
  }, [selectedCategory, searchQuery, restaurantId]);

  useEffect(() => {
    fetchCart();
  }, [customerId]);

  const handleAdd = async (item) => {
    try {
      setLastClickedItemId(item.menuItemId);
      await axios.post('http://localhost:8070/api/v1/cart/customer/add', {
        customerId: parseInt(customerId),
        menuItemId: item.menuItemId,
        restaurantId: parseInt(restaurantId),
        quantity: 1,
        price: parseFloat(item.price),
        itemName: item.itemName,
        itemDescription: item.itemDescription || '',
        category: item.category || ''
      }, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      await fetchCart();
    } catch (err) {
      console.error('Add failed:', err);
    }
  };

  const handleRemove = async (menuItemId) => {
    try {
      await axios.delete(
        `http://localhost:8070/api/v1/cart/customer/remove?customerId=${customerId}&menuItemId=${menuItemId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCart();
    } catch (err) {
      console.error('Remove failed:', err);
    }
  };

  const handleViewCart = () => {
    navigate('/cart', { state: { highlightItemId: lastClickedItemId } });
  };

  const totalCartItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  const handleMenuClick = (path) => {
    setShowMenu(false);
    if (path === 'home') {
      navigate(`/customer/${customerId}`);
    } else {
      navigate(path);
    }
  };

  // Save category and search query to localStorage when they change
  useEffect(() => {
    localStorage.setItem(`menu_category_${restaurantId}`, selectedCategory);
  }, [selectedCategory, restaurantId]);

  useEffect(() => {
    localStorage.setItem(`menu_search_${restaurantId}`, searchQuery);
  }, [searchQuery, restaurantId]);

  return (
    <div style={{ background: 'linear-gradient(to right, #fff5ec, #ffe7d4)', minHeight: '100vh' }}>
      <Navbar bg="dark" variant="dark" className="mb-4">
        <Container fluid>
          <Button
            variant="outline-light"
            onClick={() => setShowMenu(true)}
            className="d-flex align-items-center"
          >
            <List size={24} />
          </Button>
          <Navbar.Brand className="mx-auto">Customer Dashboard</Navbar.Brand>
          <Button 
            variant="outline-light" 
            onClick={handleViewCart}
            className="d-flex align-items-center gap-2"
          >
            <Cart3 size={20} />
            {totalCartItems > 0 && (
              <span className="badge bg-danger">{totalCartItems}</span>
            )}
          </Button>
        </Container>
      </Navbar>

      <Offcanvas show={showMenu} onHide={() => setShowMenu(false)} backdrop={true}>
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
              onClick={() => handleMenuClick(`/customer/${customerId}/restaurants`)}
              className="text-start"
            >
              Available Restaurants
            </Button>
            <Button
              variant="outline-primary"
              size="lg"
              onClick={() => handleMenuClick(`/customer/${customerId}/current-orders`)}
              className="text-start"
            >
              Current Orders
            </Button>
            <Button
              variant="outline-primary"
              size="lg"
              onClick={() => handleMenuClick(`/customer/${customerId}/past-orders`)}
              className="text-start"
            >
              Past Orders
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      <div className="container py-5" style={{ background: '#fffdf6', borderRadius: '15px', boxShadow: '0 0 15px rgba(0,0,0,0.1)', marginTop: '2rem' }}>
        <div className="mb-4 text-center">
          <input
            type="text"
            className="form-control w-50 mx-auto"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <ul className="nav nav-tabs justify-content-center mb-4">
          {['All', 'VEG', 'NONVEG'].map(category => (
            <li className="nav-item" key={category}>
              <button
                className={`nav-link ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            </li>
          ))}
        </ul>

        {loading ? (
          <p className="text-center">Loading menu...</p>
        ) : (
          <div className="row">
            {menuItems.map(item => {
              const imageSrc = item.itemImage
                ? `data:image/jpeg;base64,${item.itemImage}`
                : 'https://source.unsplash.com/400x250/?food';
              const quantity = cart[item.menuItemId] || 0;
              return (
                <div className="col-md-4 mb-4" key={item.menuItemId}>
                  <div className="card h-100 shadow-sm">
                    <img src={imageSrc} alt={item.itemName} className="card-img-top" style={{ height: '180px', objectFit: 'cover' }} />
                    <div className="card-body d-flex flex-column">
                      <h5>{item.itemName}</h5>
                      <p className="text-muted mb-2">₹{item.price} | {item.itemDescription || 'No description'}</p>
                      <span className={`badge ${item.category === 'VEG' ? 'bg-success' : item.category === 'NONVEG' ? 'bg-danger' : 'bg-secondary'} mb-3`}>
                        {item.category}
                      </span>
                      <div className="mt-auto text-center">
                        {quantity === 0 ? (
                          <button 
                            className="btn btn-warning w-100" 
                            onClick={() => handleAdd(item)}
                          >
                            Add to Cart
                          </button>
                        ) : (
                          <div className="d-flex justify-content-between align-items-center">
                            <button 
                              className="btn btn-outline-danger" 
                              onClick={() => handleRemove(item.menuItemId)}
                            >
                              −
                            </button>
                            <span className="mx-3">{quantity}</span>
                            <button 
                              className="btn btn-outline-success" 
                              onClick={() => handleAdd(item)}
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;