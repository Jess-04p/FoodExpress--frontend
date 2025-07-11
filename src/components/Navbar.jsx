import React, { useEffect, useState, useRef } from 'react';
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Cart3 } from 'react-bootstrap-icons';
import './Navbar.css';
 
const MyNavbar = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userFirstName, setUserFirstName] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();
 
  useEffect(() => {
    const role = localStorage.getItem('role');
    const firstName = localStorage.getItem('name');
    setUserRole(role);
    setUserFirstName(firstName);
 
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
 
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowRegister(true);
  };
 
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowRegister(false);
    }, 300); // 300ms delay before hiding
  };
 
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    window.location.reload();
  };
 
  const navbarStyle = {
    background: isScrolled
      ? 'linear-gradient(135deg, #E94B3C 0%, #FF6347 100%)'
      : 'linear-gradient(135deg, #E94B3C 0%, #FF6347 100%)', // Always show gradient on authenticated pages
    transition: 'all 0.3s ease-in-out',
    boxShadow: '0 2px 10px rgba(233, 75, 60, 0.2)',
    zIndex: 1030
  };
 
  const buttonStyle = {
    backgroundColor: 'transparent',
    borderColor: '#FFF',
    color: '#FFF',
    transition: 'all 0.3s ease'
  };
 
  return (
    <Navbar
      variant="dark"
      expand="lg"
      fixed="top"
      style={navbarStyle}
      className="py-2"
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className="fw-bold fs-4 brand-text"
          style={{
            color: '#FFF',
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
          }}
        >
          FoodExpress
        </Navbar.Brand>
 
        <Navbar.Toggle
          aria-controls="navbar-nav"
          className="border-0 shadow-none"
          style={{ color: '#FFF' }}
        />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto align-items-center gap-3">
            {userRole ? (
              <Dropdown>
                <Dropdown.Toggle
                  variant="light"
                  id="user-dropdown"
                  className="border-0 shadow-sm fw-semibold"
                  style={{
                    backgroundColor: '#FFF',
                    color: '#E94B3C'
                  }}
                >
                  {userFirstName || userRole}
                </Dropdown.Toggle>
                <Dropdown.Menu
                  align="end"
                  className="shadow-lg border-0 mt-2 rounded-3"
                  style={{ backgroundColor: '#FFF8E7' }}
                >
                  <Dropdown.Item
                    as={Link}
                    to="/profile"
                    className="py-2 text-danger"
                  >
                    <i className="bi bi-person me-2"></i>Profile
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={handleLogout}
                    className="py-2 text-danger"
                  >
                    <i className="bi bi-box-arrow-right me-2"></i>Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <>
                <Button
                  as={Link}
                  to="/login"
                  variant="light"
                  className="px-4 py-2 rounded-pill shadow-sm fw-semibold"
                  style={{
                    borderColor: '#FFF',
                    color: '#FFF',
                    backgroundColor: 'transparent'
                  }}
                >
                  Login
                </Button>
                <div
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <Dropdown show={showRegister}>
                    <Dropdown.Toggle
                      variant="danger"
                      id="register-dropdown"
                      className="px-4 py-2 rounded-pill shadow-sm fw-semibold"
                      style={{
                        backgroundColor: '#E94B3C',
                        borderColor: '#E94B3C',
                        color: '#FFF'
                      }}
                    >
                      Register
                    </Dropdown.Toggle>
                    <Dropdown.Menu
                      className="shadow-lg border-0 mt-2 rounded-3 p-2"
                      style={{ backgroundColor: '#FFF8E7' }}
                    >
                      <Dropdown.Item
                        as={Link}
                        to="/register/customer"
                        className="rounded-2 py-2 px-3 mb-1 text-danger"
                      >
                        Customer
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={Link}
                        to="/register/delivery-agent"
                        className="rounded-2 py-2 px-3 mb-1 text-danger"
                      >
                        Delivery Agent
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={Link}
                        to="/register/restaurant-owner"
                        className="rounded-2 py-2 px-3 text-danger"
                      >
                        Restaurant Owner
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
 
export default MyNavbar;
 
 