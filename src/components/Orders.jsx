import React, { useState } from 'react';
import { Container, Table, Button } from 'react-bootstrap';

const Orders = () => {
  // Example order data
  const [orders, setOrders] = useState([
    { id: 1, customerName: 'John', status: 'Pending' },
    { id: 2, customerName: 'Alice', status: 'Accepted' },
    { id: 3, customerName: 'Bob', status: 'Delivered' },
  ]);

  // Function to update order status
  const updateStatus = (orderId) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        let newStatus = order.status;
        if (order.status === 'Pending') newStatus = 'Accepted';
        else if (order.status === 'Accepted') newStatus = 'Delivered';
        return { ...order, status: newStatus };
      }
      return order;
    });
    setOrders(updatedOrders);

    // TODO: Call your backend API here to update order status in DB
  };

  return (
    <Container className="mt-5">
      <h2>Orders</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Change Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customerName}</td>
              <td>{order.status}</td>
              <td>
                {order.status !== 'Delivered' ? (
                  <Button
                    variant={order.status === 'Pending' ? 'warning' : 'success'}
                    onClick={() => updateStatus(order.id)}
                  >
                    Mark as {order.status === 'Pending' ? 'Accepted' : 'Delivered'}
                  </Button>
                ) : (
                  <span>Completed</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Orders;
