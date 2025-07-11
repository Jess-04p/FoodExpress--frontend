import React, { useState, useEffect } from 'react';
import { Table, Alert } from 'react-bootstrap';
import axios from 'axios';

const PastDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [partner, setPartner] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});
  
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  const fetchOrderDetails = async (orderId) => {
    try {
      const orderResponse = await axios.get(
        `http://localhost:8090/api/v1/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return orderResponse.data;
    } catch (err) {
      console.error(`Error fetching order details for order ${orderId}:`, err);
      return null;
    }
  };

  const fetchExtraOrderDetails = async (orderId) => {
    try {
      const response = await axios.get(
        `http://localhost:8070/api/v1/order/deliveryAgent/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (err) {
      console.error(`Error fetching extra order details for order ${orderId}:`, err);
      return null;
    }
  };

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        setLoading(true);
        // First API call to get partner details
        const partnerResponse = await axios.get(
          `http://localhost:8090/api/v1/deliveryAgent/partnerId/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!partnerResponse.data) {
          throw new Error('No delivery partner found for this user');
        }

        setPartner(partnerResponse.data);
        const partnerId = partnerResponse.data.partnerId;

        // Second API call to get deliveries using partnerId
        const deliveriesResponse = await axios.get(
          `http://localhost:8090/api/v1/deliveryAgent/getDeliveries/${partnerId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const responseData = Array.isArray(deliveriesResponse.data) ? deliveriesResponse.data : [deliveriesResponse.data];
        
        // Fetch extra order details for each delivery
        const orderDetailsMap = {};
        await Promise.all(
          responseData.map(async (delivery) => {
            // Only fetch from the delivery agent API since it has all the data we need
            const extraOrderDetail = await fetchExtraOrderDetails(delivery.orderId);
            if (extraOrderDetail) {
              orderDetailsMap[delivery.orderId] = {
                firstName: extraOrderDetail.firstName,
                restaurantId: extraOrderDetail.restaurantId,
                totalAmount: extraOrderDetail.totalAmount,
                paymentMethod: extraOrderDetail.paymentMethod,
                paymentStatus: extraOrderDetail.paymentStatus,
                status: extraOrderDetail.status
              };
            }
          })
        );

        console.log('Order Details Map:', orderDetailsMap); // Debug log
        setOrderDetails(orderDetailsMap);
        setDeliveries(responseData);
      } catch (err) {
        console.error('Error fetching delivery history:', err);
        setError(err.response?.data?.message || 'Failed to load delivery history');
      } finally {
        setLoading(false);
      }
    };

    if (userId && token) {
      fetchDeliveries();
    } else {
      setError('User not authenticated');
      setLoading(false);
    }
  }, [userId, token]);

  useEffect(() => {
    // Add beforeunload event listener
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      const message = 'Are you sure you want to leave? Your delivery history will be lost.';
      e.returnValue = message;
      return message;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup function
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  if (loading) {
    return <div>Loading delivery history...</div>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div className="container mt-4">
      <h2>Past Deliveries</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer Name</th>
            <th>Restaurant ID</th>
            <th>Total Amount</th>
            <th>Payment Method</th>
            <th>Payment Status</th>
            <th>Order Status</th>
          </tr>
        </thead>
        <tbody>
          {deliveries.map((delivery) => {
            const order = orderDetails[delivery.orderId] || {};
            return (
              <tr key={delivery.orderId}>
                <td>{delivery.orderId}</td>
                <td>{order.firstName || 'N/A'}</td>
                <td>{order.restaurantId || 'N/A'}</td>
                <td>₹{order.totalAmount?.toFixed(2) || 'N/A'}</td>
                <td>{order.paymentMethod || 'N/A'}</td>
                <td>{order.paymentStatus || 'N/A'}</td>
                <td>{order.status || 'N/A'}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default PastDeliveries;