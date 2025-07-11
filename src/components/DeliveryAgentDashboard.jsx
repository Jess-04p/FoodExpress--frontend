import React, { useState } from 'react';
import { Container, Row, Col, Button, Navbar, Offcanvas } from 'react-bootstrap';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { List, House } from 'react-bootstrap-icons';
import CurrentAssignment from './delivery/CurrentAssignment';
import PastDeliveries from './delivery/PastDeliveries';
import DeliveryHome from './delivery/DeliveryHome';
 
const DeliveryAgentDashboard = () => {
  const navigate = useNavigate();
  const agentId = localStorage.getItem('userId');
  const [showMenu, setShowMenu] = useState(false);
 
  const handleMenuClick = (path) => {
    setShowMenu(false);
    navigate(path);
  };
 
  return (
    <div style={{
      background: 'linear-gradient(135deg, #fff5ec 0%, #ffe7d4 100%)',
      minHeight: '100vh',
      padding: '2rem'
    }}>
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
            Delivery Dashboard
          </Navbar.Brand>
        </Container>
      </Navbar>
 
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
              onClick={() => handleMenuClick(`/delivery/${agentId}`)}
              className="text-start border-0 shadow-sm"
              style={{
                color: '#E94B3C',
                backgroundColor: '#fff',
                transition: 'all 0.3s ease'
              }}
            >
              <House className="me-2" />Home
            </Button>
            <Button
              variant="outline-danger"
              size="lg"
              onClick={() => handleMenuClick(`/delivery/${agentId}/current`)}
              className="text-start border-0 shadow-sm"
              style={{
                color: '#E94B3C',
                backgroundColor: '#fff',
                transition: 'all 0.3s ease'
              }}
            >
              My Current Assignment
            </Button>
            <Button
              variant="outline-danger"
              size="lg"
              onClick={() => handleMenuClick(`/delivery/${agentId}/past`)}
              className="text-start border-0 shadow-sm"
              style={{
                color: '#E94B3C',
                backgroundColor: '#fff',
                transition: 'all 0.3s ease'
              }}
            >
              My Past Deliveries
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
 
      <Container fluid>
        <Row>
          <Col className="py-4">
            <Routes>
              <Route path="/" element={<DeliveryHome />} />
              <Route path="current" element={<CurrentAssignment />} />
              <Route path="past" element={<PastDeliveries />} />
            </Routes>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
 
export default DeliveryAgentDashboard;
 