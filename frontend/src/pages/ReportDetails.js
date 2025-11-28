import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Modal } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ReportDetails = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    fetchReportDetails();
  }, [id]);

  const fetchReportDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/admin/reports/${id}`);
      setReport(response.data);
    } catch (error) {
      console.error('Error fetching report details:', error);
    }
  };

  const viewImage = (image) => {
    setSelectedImage(`http://localhost:5000/uploads/${image}`);
    setShowImageModal(true);
  };

  if (!report) {
    return <div className="text-center py-5">Loading...</div>;
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="dashboard-card">
            <Card.Header>
              <h3>📋 Disaster Report Details</h3>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <h5>📍 Location Information</h5>
                  <p><strong>Address:</strong> {report.location.address}</p>
                  <p><strong>Coordinates:</strong> {report.location.coordinates.join(', ')}</p>
                  
                  <h5 className="mt-4">🚨 Disaster Details</h5>
                  <p><strong>Type:</strong> {report.type}</p>
                  <p><strong>Severity:</strong> 
                    <Badge bg={report.severity === 'critical' ? 'danger' : 'warning'} className="ms-2">
                      {report.severity}
                    </Badge>
                  </p>
                  <p><strong>Description:</strong> {report.description}</p>
                </Col>
                
                <Col md={6}>
                  <h5>👤 Reporter Information</h5>
                  <p><strong>Name:</strong> {report.userId?.name}</p>
                  <p><strong>Email:</strong> {report.userId?.email}</p>
                  <p><strong>Reported:</strong> {new Date(report.createdAt).toLocaleString()}</p>
                  
                  <h5 className="mt-4">🏷️ Hashtags</h5>
                  {report.hashtags && report.hashtags.length > 0 ? (
                    <div>
                      {report.hashtags.map((tag, index) => (
                        <Badge key={index} bg="secondary" className="me-1 mb-1">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted">No hashtags</p>
                  )}
                </Col>
              </Row>
              
              {report.images && report.images.length > 0 && (
                <div className="mt-4">
                  <h5>📸 Uploaded Images</h5>
                  <Row>
                    {report.images.map((image, index) => (
                      <Col md={3} key={index} className="mb-3">
                        <img
                          src={`http://localhost:5000/uploads/${image}`}
                          alt={`Disaster ${index + 1}`}
                          className="img-fluid rounded cursor-pointer"
                          style={{ cursor: 'pointer', height: '150px', objectFit: 'cover', width: '100%' }}
                          onClick={() => viewImage(image)}
                        />
                      </Col>
                    ))}
                  </Row>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Image Modal */}
      <Modal show={showImageModal} onHide={() => setShowImageModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Disaster Image</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <img src={selectedImage} alt="Disaster" className="img-fluid" />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ReportDetails;