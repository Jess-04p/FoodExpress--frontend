import React, { useState, useEffect } from 'react';
import { Container, Card, Alert, Button, Badge, Row, Col, ProgressBar, Navbar } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CurrentAssignment = () => {
  const [currentDelivery, setCurrentDelivery] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [partnerId, setPartnerId] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  // First fetch the partnerId using userId
  useEffect(() => {
    const fetchPartnerId = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8090/api/v1/deliveryAgent/partnerId/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setPartnerId(response.data.partnerId);
      } catch (err) {
        console.error('Error fetching partner ID:', err);
        setError('Failed to load delivery partner details');
      }
    };

    if (userId && token) {
      fetchPartnerId();
    }
  }, [userId, token]);

  // Fetch current order using partnerId
  useEffect(() => {
    const fetchCurrentOrder = async () => {
      if (!partnerId) return;

      try {
        const response = await axios.get(
          `http://localhost:8090/api/v1/deliveryAgent/currentOrder/${partnerId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        // If no data or order is already delivered, clear states and show info
        if (!response.data || response.data.status === 'DELIVERED') {
          setCurrentDelivery(null);
          setOrderDetails(null);
          toast.info('No active deliveries available', {
            position: "top-right",
            autoClose: 3000,
          });
          return;
        }

        setCurrentDelivery(response.data);
        
        if (response.data.orderId) {
          try {
            const orderResponse = await axios.get(
              `http://localhost:8070/api/v1/order/deliveryAgent/${response.data.orderId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            );
            setOrderDetails(orderResponse.data);
          } catch (orderErr) {
            console.error('Error fetching order details:', orderErr);
            if (orderErr.response?.status !== 404) {
              toast.error('Failed to load order details');
            }
          }
        }
      } catch (err) {
        console.error('Error fetching current delivery:', err);
        if (err.response?.status === 404) {
          setCurrentDelivery(null);
          setOrderDetails(null);
          toast.info('No active deliveries found', {
            position: "top-right",
            autoClose: 3000,
          });
        } else {
          toast.error('Failed to load delivery assignment');
        }
      } finally {
        setLoading(false);
      }
    };

    let interval = null;
    if (partnerId) {
      fetchCurrentOrder();
      // Only set interval if there's an active delivery and it's not delivered
      if (currentDelivery && currentDelivery.status !== 'DELIVERED') {
        interval = setInterval(fetchCurrentOrder, 30000);
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [partnerId, token, currentDelivery?.status]);

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'PLACED': return 'secondary';
      case 'ACCEPTED': return 'info';
      case 'PREPARING': return 'primary';
      case 'READY': return 'warning';
      case 'PICKED_UP': return 'warning';
      case 'ON_THE_WAY': return 'info';
      case 'DELIVERED': return 'success';
      case 'CANCELLED': return 'danger';
      default: return 'secondary';
    }
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'READY': return 'PICKED_UP';
      case 'PICKED_UP': return 'ON_THE_WAY';
      case 'ON_THE_WAY': return 'DELIVERED';
      default: return null;
    }
  };

  const getProgressPercentage = (status) => {
    switch (status) {
      case 'PLACED': return 0;
      case 'ACCEPTED': return 16.66;
      case 'PREPARING': return 33.33;
      case 'READY': return 50;
      case 'PICKED_UP': return 66.66;
      case 'ON_THE_WAY': return 83.31;
      case 'DELIVERED': return 100;
      default: return 0;
    }
  };

  const updateOrderStatus = async () => {
    if (!currentDelivery?.orderId || !orderDetails?.status) return;

    const nextStatus = getNextStatus(orderDetails.status);
    if (!nextStatus) return;

    try {
      setUpdatingStatus(true);
      
      if (nextStatus === 'DELIVERED') {
        // Update both order and delivery status
        await Promise.all([
          axios.put(
            `http://localhost:8070/api/v1/order/communication/update/${currentDelivery.orderId}/${nextStatus}`,
            null,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          ),
          axios.put(
            'http://localhost:8090/api/v1/deliveryAgent/update-delivery-status',
            {
              orderId: currentDelivery.orderId,
              deliveryStatus: nextStatus
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          )
        ]);

        // Show success message
        toast.success('Order delivered successfully!', {
          position: "top-right",
          autoClose: 3000,
        });

        // Clear states immediately after delivery
        setCurrentDelivery(null);
        setOrderDetails(null);
        return;
      }

      // For other statuses (PICKED_UP, ON_THE_WAY)
      await axios.put(
        `http://localhost:8070/api/v1/order/communication/update/${currentDelivery.orderId}/${nextStatus}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success(`Order status updated to ${nextStatus}`);
      
      // Only refresh data if not delivered
      const [deliveryResponse, orderResponse] = await Promise.all([
        axios.get(
          `http://localhost:8090/api/v1/deliveryAgent/currentOrder/${partnerId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        ),
        axios.get(
          `http://localhost:8070/api/v1/order/deliveryAgent/${currentDelivery.orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
      ]);

      setCurrentDelivery(deliveryResponse.data);
      setOrderDetails(orderResponse.data);

    } catch (err) {
      toast.error('Failed to update status');
      console.error('Error updating status:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return <Alert variant="info" className="text-center">Loading current assignment...</Alert>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!currentDelivery) {
    return <Alert variant="info" className="text-center">No current delivery assignments</Alert>;
  }

  return (
    <div>
      <Navbar bg="light" expand="lg" className="mb-3">
        <Container>
          <h4 className="mb-0 mx-auto">Current Delivery Assignment</h4>
        </Container>
      </Navbar>

      <Container className="py-4">
        <Row>
          <Col xs={12} className="mb-4">
            <Card className="shadow-sm h-100">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Order #{currentDelivery.orderId}</h5>
                <div className="d-flex gap-2">
                  <Badge bg={getStatusBadgeVariant(orderDetails?.status)}>
                    Order: {orderDetails?.status}
                  </Badge>
                  <Badge bg={getStatusBadgeVariant(currentDelivery.status)}>
                    Delivery: {currentDelivery.status}
                  </Badge>
                </div>
              </Card.Header>
              <Card.Body>
                <Row className="mb-3">
                  <Col md={6}>
                    {orderDetails && (
                      <>
                        <h6>{orderDetails.restaurantName}</h6>
                        <p className="text-muted mb-2">{orderDetails.items}</p>
                        <p className="mb-2">
                          <strong>Total Amount:</strong> ₹{orderDetails.totalAmount}
                        </p>
                        <p className="mb-2">
                          <strong>Customer Name:</strong> {orderDetails.firstName}
                        </p>
                        <p className="mb-2">
                          <strong>Customer Pincode:</strong> {currentDelivery.customerPincode}
                        </p>
                      </>
                    )}
                  </Col>
                  <Col md={6} className="text-md-end">
                    {orderDetails && (
                      <>
                        <p className="mb-2">
                          <strong>Payment Method:</strong> {orderDetails.paymentMethod}
                        </p>
                        <p className="mb-2">
                          <Badge bg={orderDetails.paymentStatus === 'SUCCESS' ? 'success' : 'warning'}>
                            Payment {orderDetails.paymentStatus}
                          </Badge>
                        </p>
                        <p className="mb-2">
                          <strong>Restaurant ID:</strong> {orderDetails.restaurantId}
                        </p>
                      </>
                    )}
                  </Col>
                </Row>

                <ProgressBar 
                  now={getProgressPercentage(orderDetails?.status)} 
                  variant="success" 
                  className="mb-3"
                />
                <div className="d-flex justify-content-between text-muted small">
                  <span>Placed</span>
                  <span>Accepted</span>
                  <span>Preparing</span>
                  <span>Ready</span>
                  <span>Picked Up</span>
                  <span>On The Way</span>
                  <span>Delivered</span>
                </div>

                <div className="mt-4">
                  {orderDetails?.status && getNextStatus(orderDetails.status) && (
                    <Button 
                      variant="primary"
                      onClick={updateOrderStatus}
                      className="w-100"
                      disabled={updatingStatus}
                    >
                      {updatingStatus ? 'Updating...' : `Mark as ${getNextStatus(orderDetails.status)}`}
                    </Button>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <ToastContainer position="top-right" />
    </div>
  );
};

export default CurrentAssignment;