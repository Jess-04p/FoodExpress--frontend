import React from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Clock, ClockHistory } from 'react-bootstrap-icons';
 
const DeliveryHome = () => {
  const navigate = useNavigate();
  const agentId = localStorage.getItem('userId');
  const agentName = localStorage.getItem('userName') || 'Delivery Agent';
 
  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <Card className="text-center p-4" style={{ backgroundColor: '#fff9ec', borderRadius: '15px' }}>
            <Card.Body>
              <h2 className="mb-3">Welcome back, {agentName}! 👋</h2>
              <p className="text-muted">Your delivery dashboard awaits.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
     
      <Row className="g-4">
        <Col md={6}>
          <Card
            className="h-100"
            style={{ backgroundColor: '#fff3d6', cursor: 'pointer' }}
            onClick={() => navigate(`/delivery/${agentId}/current`)}
          >
            <Card.Body className="text-center">
              <Clock size={40} className="mb-3 text-warning" />
              <Card.Title>Current Assignment</Card.Title>
              <Card.Text className="text-muted">
                View and manage your current delivery assignment.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card
            className="h-100"
            style={{ backgroundColor: '#fff3d6', cursor: 'pointer' }}
            onClick={() => navigate(`/delivery/${agentId}/past`)}
          >
            <Card.Body className="text-center">
              <ClockHistory size={40} className="mb-3 text-success" />
              <Card.Title>Past Deliveries</Card.Title>
              <Card.Text className="text-muted">
                Check your delivery history and completed orders.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
 
export default DeliveryHome;