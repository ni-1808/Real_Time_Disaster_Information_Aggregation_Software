import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, ProgressBar } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (name === 'password') {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    setPasswordStrength(strength);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return 'danger';
    if (passwordStrength < 75) return 'warning';
    return 'success';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    if (passwordStrength < 50) {
      return setError('Please choose a stronger password');
    }

    setLoading(true);
    try {
      await signup(formData.name, formData.email, formData.password);
      navigate('/');
    } catch (error) {
      setError('Failed to create account');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', padding: '20px 0' }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={7} lg={6}>
            <Card className="card-shadow" style={{ borderRadius: '20px', overflow: 'hidden' }}>
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
                  <h2 className="fw-bold text-dark mb-2">Create Account</h2>
                  <p className="text-muted">Join our disaster alert community</p>
                </div>

                {error && (
                  <Alert variant="danger" className="card-shadow">
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold text-dark">Full Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                          style={{ 
                            borderRadius: '12px', 
                            padding: '12px 16px',
                            border: '2px solid #e9ecef',
                            transition: 'all 0.3s ease'
                          }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold text-dark">Email Address</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter your email"
                          style={{ 
                            borderRadius: '12px', 
                            padding: '12px 16px',
                            border: '2px solid #e9ecef',
                            transition: 'all 0.3s ease'
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold text-dark">Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a strong password"
                      style={{ 
                        borderRadius: '12px', 
                        padding: '12px 16px',
                        border: '2px solid #e9ecef',
                        transition: 'all 0.3s ease'
                      }}
                    />
                    {formData.password && (
                      <div className="mt-2">
                        <small className="text-muted">Password Strength:</small>
                        <ProgressBar 
                          now={passwordStrength} 
                          variant={getPasswordStrengthColor()}
                          style={{ height: '6px', borderRadius: '3px' }}
                        />
                      </div>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold text-dark">Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      style={{ 
                        borderRadius: '12px', 
                        padding: '12px 16px',
                        border: '2px solid #e9ecef',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-100 btn-shadow"
                    style={{
                      background: 'linear-gradient(45deg, #28a745, #20c997)',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '12px',
                      fontSize: '1.1rem',
                      fontWeight: '600'
                    }}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </Form>

                <div className="text-center mt-4">
                  <p className="text-muted mb-0">
                    Already have an account?{' '}
                    <Link 
                      to="/login" 
                      style={{ 
                        color: '#dc3545', 
                        textDecoration: 'none',
                        fontWeight: '600'
                      }}
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Signup;