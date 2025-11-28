import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavigationBar = () => {
  const { user, logout } = useAuth();

  return (
    <Navbar expand="lg" className="navbar-custom" variant="light">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-danger">
          🚨 Disaster Alert System
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="text-dark">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/insights" className="text-dark">Insights</Nav.Link>
            <Nav.Link as={Link} to="/tips" className="text-dark">Tips</Nav.Link>
            <Nav.Link as={Link} to="/contact" className="text-dark">Contact</Nav.Link>
            {user && <Nav.Link as={Link} to="/report" className="text-dark">Report</Nav.Link>}

            {user?.role === 'admin' && <Nav.Link as={Link} to="/admin" className="text-dark">Admin</Nav.Link>}
          </Nav>
          
          <Nav>
            {user ? (
              <>
                <Nav.Item className="text-dark me-3 d-flex align-items-center">
                  Welcome, {user.name}
                </Nav.Item>
                <Button variant="danger" size="sm" className="btn-shadow" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="text-dark">Login</Nav.Link>
                <Nav.Link as={Link} to="/signup" className="text-dark">Signup</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;