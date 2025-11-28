import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const ReportDisaster = () => {
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    hashtags: '',
    severity: 'medium',
    location: { address: '', coordinates: [0, 0] }
  });
  const [images, setImages] = useState([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('type', formData.type);
    data.append('description', formData.description);
    data.append('hashtags', formData.hashtags);
    data.append('severity', formData.severity);
    data.append('location', JSON.stringify(formData.location));
    
    for (let i = 0; i < images.length; i++) {
      data.append('images', images[i]);
    }

    try {
      await axios.post('http://localhost:5000/api/reports', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess('Report submitted successfully!');
      setFormData({
        type: '',
        description: '',
        hashtags: '',
        severity: 'medium',
        location: { address: '', coordinates: [0, 0] }
      });
      setImages([]);
    } catch (error) {
      setError('Failed to submit report');
    }
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="dashboard-card">
            <Card.Header>
              <h3>🚨 Report Disaster</h3>
            </Card.Header>
            <Card.Body>
              {success && <Alert variant="success">{success}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Disaster Type</Form.Label>
                  <Form.Select 
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="">Select Type</option>
                    <option value="earthquake">Earthquake</option>
                    <option value="flood">Flood</option>
                    <option value="fire">Fire</option>
                    <option value="cyclone">Cyclone</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <div className="d-flex">
                    <Form.Control 
                      type="text"
                      placeholder="Enter location"
                      value={formData.location.address}
                      onChange={(e) => setFormData({
                        ...formData, 
                        location: {...formData.location, address: e.target.value}
                      })}
                      required
                    />
                    <Button 
                      variant="outline-primary" 
                      className="ms-2"
                      type="button"
                      onClick={() => {
                        if (navigator.geolocation) {
                          navigator.geolocation.getCurrentPosition(async (position) => {
                            const coords = [position.coords.longitude, position.coords.latitude];
                            setFormData({
                              ...formData,
                              location: { ...formData.location, coordinates: coords }
                            });
                            
                            // Save user location for alerts
                            try {
                              await axios.put('http://localhost:5000/api/user/location', {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude,
                                address: formData.location.address
                              });
                            } catch (error) {
                              console.error('Error saving location:', error);
                            }
                          });
                        }
                      }}
                    >
                      📍 GPS
                    </Button>
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control 
                    as="textarea"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Hashtags</Form.Label>
                  <Form.Control 
                    type="text"
                    placeholder="#earthquake #emergency"
                    value={formData.hashtags}
                    onChange={(e) => setFormData({...formData, hashtags: e.target.value})}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Upload Images</Form.Label>
                  <Form.Control 
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setImages(Array.from(e.target.files))}
                  />
                </Form.Group>

                <Button type="submit" variant="danger" className="w-100">
                  Submit Report
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ReportDisaster;