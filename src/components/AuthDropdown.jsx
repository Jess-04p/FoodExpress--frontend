import React, { useState } from 'react';
import { Dropdown, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AuthDropdown = () => {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <Nav>
      {/* Register dropdown */}
      <Dropdown
        onMouseEnter={() => setShowRegister(true)}
        onMouseLeave={() => setShowRegister(false)}
        show={showRegister}
      >
        <Dropdown.Toggle
          variant="link"
          id="register-dropdown"
          style={{ color: 'black', textDecoration: 'none' }}
        >
          Register
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item as={Link} to="/register/customer">Customer</Dropdown.Item>
          <Dropdown.Item as={Link} to="/register/delivery-agent">Delivery Agent</Dropdown.Item>
          <Dropdown.Item as={Link} to="/register/restaurant-owner">Restaurant Owner</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      {/* Single Login link */}
      <Nav.Link as={Link} to="/login" className="ms-3" style={{ color: 'black', textDecoration: 'none' }}>
        Login
      </Nav.Link>
    </Nav>
  );
};

export default AuthDropdown;
