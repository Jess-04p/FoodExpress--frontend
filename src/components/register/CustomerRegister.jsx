import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert, Card } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
 
const CustomerRegister = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
 
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    customerPincode: '',
    password: '',
    phoneNo: '',
    address: '',
  });
 
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8093/api/v1/auth/register/customer', formData);
      toast.success('Registration successful! Redirecting to login...', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.', {
        position: "top-right",
        autoClose: 3000
      });
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
      console.error(error);
    }
  };
 
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fff5ec 0%, #ffe7d4 100%)',
      paddingTop: '40px',
      paddingBottom: '40px'
    }}>
      <ToastContainer />
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="shadow-lg border-0">
              <Card.Body className="p-5">
                <h2 className="text-center mb-4" style={{ color: '#ff6b6b' }}>Customer Registration</h2>
               
                {error && (
                  <Alert variant="danger" className="mb-4">
                    {error}
                  </Alert>
                )}
 
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="text-muted fw-bold">First Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          className="py-2"
                          style={{ backgroundColor: '#f8f9fa', border: '2px solid #eee' }}
                        />
                      </Form.Group>
                    </Col>
                   
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="text-muted fw-bold">Last Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          className="py-2"
                          style={{ backgroundColor: '#f8f9fa', border: '2px solid #eee' }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
 
                  <Form.Group className="mb-3">
                    <Form.Label className="text-muted fw-bold">Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="py-2"
                      style={{ backgroundColor: '#f8f9fa', border: '2px solid #eee' }}
                    />
                  </Form.Group>
 
                  <Form.Group className="mb-3">
                    <Form.Label className="text-muted fw-bold">Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="py-2"
                      style={{ backgroundColor: '#f8f9fa', border: '2px solid #eee' }}
                    />
                  </Form.Group>
 
                  <Form.Group className="mb-3">
                    <Form.Label className="text-muted fw-bold">Phone Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="phoneNo"
                      value={formData.phoneNo}
                      onChange={handleChange}
                      required
                      className="py-2"
                      style={{ backgroundColor: '#f8f9fa', border: '2px solid #eee' }}
                    />
                  </Form.Group>
 
                  <Form.Group className="mb-3">
                    <Form.Label className="text-muted fw-bold">Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      style={{ backgroundColor: '#f8f9fa', border: '2px solid #eee' }}
                    />
                  </Form.Group>
 
                  <Form.Group className="mb-4">
                    <Form.Label className="text-muted fw-bold">Pincode</Form.Label>
                    <Form.Control
                      type="text"
                      name="customerPincode"
                      value={formData.customerPincode}
                      onChange={handleChange}
                      required
                      className="py-2"
                      style={{ backgroundColor: '#f8f9fa', border: '2px solid #eee' }}
                    />
                  </Form.Group>
 
                  <Button
                    variant="warning"
                    type="submit"
                    className="w-100 py-2 text-white fw-bold"
                    style={{
                      backgroundColor: '#ff6b6b',
                      border: 'none',
                      fontSize: '1.1rem'
                    }}
                  >
                    Register
                  </Button>
                </Form>
 
                <div className="text-center mt-4">
                  <p className="text-muted">
                    Already have an account? {' '}
                    <span
                      onClick={() => navigate('/login')}
                      style={{ color: '#ff6b6b', textDecoration: 'none', cursor: 'pointer' }}
                    >
                      Sign in
                    </span>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
 
export default CustomerRegister;
 