import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Spinner, Alert, Card, Row, Col, Image } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
 
const ProfilePage = () => {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    phoneNo: '',
    address: '',
    customerPincode: '',
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
 
  const customerId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
 
  console.log('Initial customerId:', customerId);
  console.log('Initial token:', token);
 
  useEffect(() => {
    const fetchProfile = async () => {
      console.log('Fetching profile for customerId:', customerId);
      console.log('Using token:', token);
 
      try {
        const res = await axios.get(
          `http://localhost:8093/api/v1/auth/customer/viewProfile/${customerId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log('Profile data:', res.data);
 
        // Map snake_case fields to camelCase
        const mapped = {
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          phoneNo: res.data.phoneNo,
          address: res.data.address,
          customerPincode: res.data.customerPincode,
        };
 
        setProfile(mapped);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
 
    if (customerId && token) fetchProfile();
    else setLoading(false);
  }, [customerId, token]);
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };
 
  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
 
    console.log('Updating profile with data:', profile);
 
    try {
      await axios.put(
        `http://localhost:8093/api/v1/auth/customer/updateProfile/${customerId}`,
        profile,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Profile updated successfully');
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error('Profile update failed');
    } finally {
      setUpdating(false);
    }
  };
 
  const orangeStyle = {
    backgroundColor: '#ff6b6b',
    borderColor: '#ff6b6b'
  };
 
  const profileImageStyle = {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    border: '4px solid #fff',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    marginTop: '-60px',
    backgroundColor: '#fff',
    objectFit: 'cover'
  };
 
  if (loading) return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Spinner animation="border" style={orangeStyle} />
    </Container>
  );
 
  if (error) return (
    <Container className="mt-5">
      <Alert variant="danger" className="text-center shadow-sm">{error}</Alert>
    </Container>
  );
 
  return (
    <Container fluid className="py-5" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <Row className="justify-content-center">
        <Col xs={12} sm={11} md={8} lg={6}>
          <Card className="border-0 shadow-lg">
            <div className="text-center" style={{
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)',
              height: '150px',
              borderTopLeftRadius: '.25rem',
              borderTopRightRadius: '.25rem'
            }}></div>
           
            <div className="text-center">
              <Image
                src="/profile-icon.png"
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  border: '4px solid #fff',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  marginTop: '-60px',
                  backgroundColor: '#fff',
                  padding: '15px'
                }}
                alt="Profile"
              />
              <h3 className="mt-3 mb-0">{profile.firstName} {profile.lastName}</h3>
              <p className="text-muted mb-4">Customer Profile</p>
            </div>
 
            <Card.Body className="px-4 py-4">
              <Form onSubmit={handleUpdate}>
                <Row>
                  <Col xs={12} md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold text-muted">First Name</Form.Label>
                      <Form.Control
                        name="firstName"
                        value={profile.firstName}
                        onChange={handleChange}
                        required
                        className="border-0 shadow-sm bg-light"
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold text-muted">Last Name</Form.Label>
                      <Form.Control
                        name="lastName"
                        value={profile.lastName}
                        onChange={handleChange}
                        required
                        className="border-0 shadow-sm bg-light"
                      />
                    </Form.Group>
                  </Col>
                </Row>
 
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold text-muted">Phone Number</Form.Label>
                  <Form.Control
                    name="phoneNo"
                    value={profile.phoneNo}
                    onChange={handleChange}
                    required
                    className="border-0 shadow-sm bg-light"
                  />
                </Form.Group>
 
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold text-muted">Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="address"
                    value={profile.address}
                    onChange={handleChange}
                    required
                    className="border-0 shadow-sm bg-light"
                  />
                </Form.Group>
 
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold text-muted">Pincode</Form.Label>
                  <Form.Control
                    name="customerPincode"
                    value={profile.customerPincode}
                    onChange={handleChange}
                    required
                    className="border-0 shadow-sm bg-light"
                  />
                </Form.Group>
 
                <div className="d-grid">
                  <Button
                    type="submit"
                    style={orangeStyle}
                    disabled={updating}
                    className="py-2 border-0"
                  >
                    {updating ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Saving...
                      </>
                    ) : 'Update Profile'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
 
export default ProfilePage;
 