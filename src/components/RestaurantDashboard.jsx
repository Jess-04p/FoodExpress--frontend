import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Navbar, Offcanvas } from 'react-bootstrap';
import { List, PencilSquare, Trash } from 'react-bootstrap-icons';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import HomeRestaurant from './restaurant/HomeRestaurant';
import 'react-toastify/dist/ReactToastify.css';
 
const RestaurantDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurantDetails, setRestaurantDetails] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [showActiveOrders, setShowActiveOrders] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    image: null,
    imageFile: null,
  });
  const [editIndex, setEditIndex] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [currentView, setCurrentView] = useState(() => {
    return localStorage.getItem(`dashboard_view_${id}`) || 'home';
  });
 
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
 
  // Save current view to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(`dashboard_view_${id}`, currentView);
  }, [currentView, id]);
 
  // Add fetchMenuItems function
  const fetchMenuItems = async (restaurantId) => {
    try {
      console.log('Fetching menu items for restaurant:', restaurantId);
      const response = await axios.get(
        `http://localhost:8083/api/v1/customer/menu/${restaurantId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );
     
      console.log('Menu items response:', response.data);
     
      if (response.data) {
        // Transform the data to match our local state structure
        const transformedItems = response.data.map(item => ({
          id: item.menuItemId,
          name: item.itemName,
          description: item.itemDescription,
          price: item.price,
          category: item.category,
          image: item.itemImage ? `data:image/jpeg;base64,${item.itemImage}` : null
        }));
        setMenuItems(transformedItems);
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
      toast.error('Failed to load menu items');
    }
  };
 
  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        setLoading(true);
        console.log('Fetching restaurant details for userId:', userId);
        console.log('URL:', `http://localhost:8083/api/v1/restaurants/${userId}`);
        console.log('Token:', token ? 'Present' : 'Missing');
       
        const response = await axios.get(
          `http://localhost:8083/api/v1/restaurants/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          }
        );
       
        console.log('Restaurant details response:', response.data);
       
        if (!response.data) {
          throw new Error('No restaurant data received');
        }
       
        setRestaurantDetails({
          ...response.data,
          ownerName: localStorage.getItem('name') // Add owner's name here
        });
        // Fetch menu items after getting restaurant details
        await fetchMenuItems(response.data.id);
      } catch (error) {
        console.error('Error fetching restaurant details:', error);
        console.error('Error response:', error.response);
        setError(error.response?.data?.message || error.message || 'Failed to load restaurant details');
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
 
  const handleChange = (e) => {
    if (e.target.name === 'image') {
      const file = e.target.files[0];
      if (file) {
        setFormData({
          ...formData,
          image: URL.createObjectURL(file),
          imageFile: file,
        });
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };
 
  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      id: item.id,
      name: item.name,
      category: item.category,
      price: item.price.toString(),
      description: item.description,
      image: item.image,
      imageFile: null
    });
    setEditIndex(item.id);
  };
 
  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(
          `http://localhost:8083/api/v1/menu/restaurants/delete/${itemId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
       
        // Refresh menu items after deletion
        await fetchMenuItems(restaurantDetails.id);
        toast.success('Menu item deleted successfully!');
      } catch (error) {
        console.error('Error deleting menu item:', error);
        toast.error('Failed to delete menu item');
      }
    }
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataObj = new FormData();
     
      if (editIndex !== null) {
        // Update existing item
        const updateData = {
          itemName: formData.name,
          itemDescription: formData.description,
          price: parseFloat(formData.price),
          isAvailable: true
        };
 
        // Convert updateData to a Blob and append it with the correct content type
        const blob = new Blob([JSON.stringify(updateData)], {
          type: 'application/json'
        });
        formDataObj.append('request', blob);
       
        // Add the image file if it exists
        if (formData.imageFile) {
          formDataObj.append('itemImage', formData.imageFile);
        }
       
        console.log('Update request data:', {
          itemId: formData.id,
          updateData,
          hasImage: !!formData.imageFile
        });
 
        // Make the update API call
        const response = await axios.put(
          `http://localhost:8083/api/v1/menu/restaurants/update/${formData.id}`,
          formDataObj,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
       
        console.log('Update response:', response.data);
       
        // After successful update, refresh the menu items
        await fetchMenuItems(restaurantDetails.id);
       
        // Reset form and edit state
        setFormData({
          name: '',
          category: '',
          price: '',
          description: '',
          image: null,
          imageFile: null,
        });
        setEditIndex(null);
        setEditingItem(null);
       
        toast.success('Menu item updated successfully!');
      } else {
        // Add new item
        const menuItemData = {
          restaurantId: restaurantDetails.id,
          itemName: formData.name,
          itemDescription: formData.description,
          price: parseFloat(formData.price),
          categoryName: formData.category.toUpperCase(),
          available: true
        };
       
        formDataObj.append('request', new Blob([JSON.stringify(menuItemData)], {
          type: 'application/json'
        }));
       
        if (formData.imageFile) {
          formDataObj.append('itemImage', formData.imageFile);
        }
       
        const response = await axios.post(
          'http://localhost:8083/api/v1/menu/restaurants/add',
          formDataObj,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
       
        // After successfully adding the item, fetch the updated menu items
        await fetchMenuItems(restaurantDetails.id);
       
        // Reset form
        setFormData({
          name: '',
          category: '',
          price: '',
          description: '',
          image: null,
          imageFile: null,
        });
       
        toast.success('Menu item added successfully!');
      }
    } catch (error) {
      console.error('Error managing menu item:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to manage menu item';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
 
  const handleStatusChange = async (isOpen) => {
    try {
      await axios.put(
        `http://localhost:8083/api/v1/restaurants/updateRestaurantStatus/${userId}/${isOpen}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
     
      setRestaurantDetails(prev => ({
        ...prev,
        open: isOpen
      }));
     
      toast.success(`Restaurant is now ${isOpen ? 'open' : 'closed'} for orders`);
    } catch (error) {
      console.error('Error updating restaurant status:', error);
      toast.error('Failed to update restaurant status');
      // Revert the toggle in case of error
      setRestaurantDetails(prev => ({
        ...prev,
        open: !isOpen
      }));
    }
  };
 
  // Handle menu item clicks
  const handleMenuClick = (route) => {
    if (route === 'active-orders') {
      navigate(`/restaurant/${userId}/orders`);
    } else if (route === 'served-meals') {
      navigate(`/restaurant/${userId}/served-orders`);
    } else {
      setCurrentView(route);
    }
    setShowMenu(false);
  };
 
  // Render content based on current view
  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <HomeRestaurant
            restaurantDetails={{
              ...restaurantDetails,
              ownerName: localStorage.getItem('name')
            }}
            onStatusChange={handleStatusChange}
          />
        );
      case 'add-menu':
        return (
          <Container className="mt-5">
            {restaurantDetails && (
              <div className="text-center mb-4">
                <h2>Welcome, {localStorage.getItem('name')}!</h2>
              </div>
            )}
            <h3 className="text-center mb-4">Add Menu Items</h3>
 
            <Form onSubmit={handleSubmit} className="p-4 border rounded bg-light shadow-sm">
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="name">
                    <Form.Label>Item Name</Form.Label>
                    <Form.Control
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter item name"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="category">
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select category</option>
                      <option value="VEG">VEG</option>
                      <option value="NONVEG">NONVEG</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
 
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="price">
                    <Form.Label>Price (₹)</Form.Label>
                    <Form.Control
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="Enter price"
                      min="0"
                      step="0.01"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Enter description"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
 
              <Form.Group controlId="image" className="mb-3">
                <Form.Label>Upload Image</Form.Label>
                <Form.Control type="file" name="image" onChange={handleChange} accept="image/*" />
              </Form.Group>
 
              {formData.image && (
                <div className="mb-3 text-center">
                  <img
                    src={formData.image}
                    alt="Preview"
                    style={{
                      width: '200px',
                      height: '150px',
                      objectFit: 'cover',
                      borderRadius: '5px',
                      border: '1px solid #ddd',
                    }}
                  />
                </div>
              )}
 
              <Button
                type="submit"
                variant="warning"
                className="w-100 fw-bold"
                disabled={loading}
              >
                {loading ? 'Adding...' : (editIndex !== null ? 'Update Item' : 'Add Item')}
              </Button>
            </Form>
 
            {/* Display Current Menu Items */}
            <div className="mt-5">
              <h3>Current Menu Items</h3>
              <div className="row">
                {menuItems.map((item) => (
                  <div key={item.id} className="col-md-4 mb-4">
                    <div className="card h-100">
                      {item.image ? (
                        <img
                          src={item.image}
                          className="card-img-top"
                          alt={item.name}
                          style={{ height: '200px', objectFit: 'cover' }}
                        />
                      ) : (
                        <div className="d-flex align-items-center justify-content-center bg-light" style={{ height: '200px' }}>
                          <p className="text-muted mb-0">No image available</p>
                        </div>
                      )}
                      <div className="card-body">
                        <h5 className="card-title">{item.name}</h5>
                        <p className="card-text">{item.description}</p>
                        <p className="card-text">
                          <strong>Price: </strong>₹{item.price}
                        </p>
                        <p className="card-text">
                          <strong>Category: </strong>{item.category}
                        </p>
                        <div className="d-flex justify-content-between">
                          <Button
                            variant="warning"
                            onClick={() => handleEdit(item)}
                            className="d-flex align-items-center"
                          >
                            <PencilSquare size={20} />
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => handleDelete(item.id)}
                            className="d-flex align-items-center"
                          >
                            <Trash size={20} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {menuItems.length === 0 && (
                  <div className="col-12">
                    <p className="text-center text-muted">No menu items added yet.</p>
                  </div>
                )}
              </div>
            </div>
          </Container>
        );
      case 'my-menu':
        return (
          <Container className="mt-5">
            <h3 className="text-center mb-4">Menu Gallery</h3>
            <Row className="g-4">
              {menuItems.length === 0 && (
                <Col xs={12}>
                  <p className="text-center text-muted">No menu items added yet.</p>
                </Col>
              )}
              {menuItems.map((item) => (
                <Col xs={6} md={4} lg={3} key={item.id} className="mb-4">
                  <Card className="h-100 shadow-sm">
                    {item.image ? (
                      <Card.Img
                        src={item.image}
                        alt={item.name}
                        style={{
                          height: '200px',
                          objectFit: 'cover',
                          cursor: 'pointer'
                        }}
                        onClick={() => handleEdit(item)}
                      />
                    ) : (
                      <div
                        className="d-flex align-items-center justify-content-center bg-light"
                        style={{ height: '200px' }}
                        onClick={() => handleEdit(item)}
                      >
                        <p className="text-muted mb-0">No image available</p>
                      </div>
                    )}
                    <Card.Footer className="text-center py-2">
                      <small className="text-muted">{item.name}</small>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        );
      default:
        return null;
    }
  };
 
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
    <div style={{
      background: 'linear-gradient(135deg, #fff5ec 0%, #ffe7d4 100%)',
      minHeight: '100vh',
      padding: '2rem'
    }}>
      {/* Navbar */}
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
 
      {/* Sidebar Menu */}
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
              <i className="bi bi-house me-2"></i>Home
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
              onClick={() => handleMenuClick('active-orders')}
              className="text-start border-0 shadow-sm"
              style={{
                color: '#E94B3C',
                backgroundColor: '#fff',
                transition: 'all 0.3s ease'
              }}
            >
              <i className="bi bi-clock-history me-2"></i>Active Orders
            </Button>
            <Button
              variant="outline-danger"
              size="lg"
              onClick={() => handleMenuClick('served-meals')}
              className="text-start border-0 shadow-sm"
              style={{
                color: '#E94B3C',
                backgroundColor: '#fff',
                transition: 'all 0.3s ease'
              }}
            >
              <i className="bi bi-check2-circle me-2"></i>Served Meals
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
 
      {renderContent()}
      <ToastContainer position="top-right" />
    </div>
  );
};
 
export default RestaurantDashboard;
 
 