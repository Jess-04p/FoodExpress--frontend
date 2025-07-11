import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
 
const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <Container>
        <Row>
          <Col className="text-center">
            {/* <h5>FoodExpress</h5> */}
            <p>Delivering happiness, one meal at a time.</p>
          </Col>
        </Row>
        <Row>
          <Col className="text-center">
            <small>© {new Date().getFullYear()} FoodExpress. All rights reserved.</small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};
 
export default Footer;
 