import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert, Card } from 'react-bootstrap';
import axios from 'axios';
 
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
 
  const handleLogin = async (e) => {
    e.preventDefault();
 
    try {
      const response = await axios.post('http://localhost:8093/api/v1/auth/login', {
        email,
        password,
      });
 
      const { token, id, role, name} = response.data;
 
      localStorage.setItem('token', token);
      localStorage.setItem('userId', id);
      localStorage.setItem('role', role);
      localStorage.setItem('name', name); // Store the full name
     
      const normalized = role.toLowerCase();
      if (normalized === 'customer') {
        window.location.href = `/customer/${id}`;
      } else if (normalized === 'delivery agent') {
        window.location.href = `/delivery/${id}`;
      } else if (normalized === 'restaurant owner') {
        window.location.href = `/restaurant/${id}`;
      } else {
        window.location.href = '/';
      }
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };
 
  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fff5ec 0%, #ffe7d4 100%)',
      paddingTop: '40px',
      paddingBottom: '40px'
    }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="shadow-lg border-0">
              <Card.Body className="p-5">
                <h2 className="text-center mb-4" style={{ color: '#ff6b6b' }}>Welcome Back!</h2>
                {error && (
                  <Alert variant="danger" className="mb-4">
                    {error}
                  </Alert>
                )}
                
                <Form onSubmit={handleLogin}>
                  <Form.Group className="mb-4">
                    <Form.Label className="text-muted fw-bold">Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="py-2"
                      style={{ backgroundColor: '#f8f9fa', border: '2px solid #eee' }}
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Label className="text-muted fw-bold">Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                    Login
                  </Button>
                </Form>
                
                <div className="text-center mt-4">
                  <p className="text-muted">
                    Don't have an account? <a href="/register/customer" style={{ color: '#ff6b6b', textDecoration: 'none' }}>Sign up</a>
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
 
export default Login;