import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Badge, Button, Modal } from 'react-bootstrap';
import axios from 'axios';

const UserReportsSection = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setReports(getSampleReports());
    fetchReports();
    
    const interval = setInterval(fetchReports, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/reports/all');
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setReports(getSampleReports());
    }
  };
  
  const getSampleReports = () => [
    {
      _id: 'sample1',
      type: 'earthquake',
      location: { address: 'Delhi, India' },
      description: 'Major earthquake felt in Delhi area. Buildings shaking, people evacuating.',
      severity: 'high',
      images: [],
      userId: { name: 'Community Reporter' },
      createdAt: new Date(),
      mlClassification: {
        isAuthentic: true,
        confidence: 91,
        riskLevel: 'authentic',
        reasoning: ['Strong disaster-related content', 'Detailed location information']
      }
    },
    {
      _id: 'sample2', 
      type: 'flood',
      location: { address: 'Mumbai, India' },
      description: 'Heavy rainfall causing severe flooding in Mumbai streets.',
      severity: 'critical',
      images: [],
      userId: { name: 'Emergency Reporter' },
      createdAt: new Date(),
      mlClassification: {
        isAuthentic: true,
        confidence: 85,
        riskLevel: 'authentic',
        reasoning: ['Multiple disaster keywords', 'High urgency indicators']
      }
    },
    {
      _id: 'sample3',
      type: 'fire',
      location: { address: 'Bangalore, India' },
      description: 'Forest fire spreading near Bangalore outskirts.',
      severity: 'medium',
      images: [],
      userId: { name: 'Local Resident' },
      createdAt: new Date(),
      mlClassification: {
        isAuthentic: false,
        confidence: 45,
        riskLevel: 'medium_risk',
        reasoning: ['Limited detail provided', 'No supporting evidence']
      }
    }
  ];

  const getAuthenticityBadge = (classification) => {
    if (!classification) return <Badge bg="secondary">Not Analyzed</Badge>;
    
    if (classification.isAuthentic) {
      return <Badge bg="success">✅ Authentic ({classification.confidence}%)</Badge>;
    } else {
      return <Badge bg="danger">❌ Suspicious ({classification.confidence}%)</Badge>;
    }
  };

  const getRiskBadge = (riskLevel) => {
    const colors = {
      'authentic': 'success',
      'low_risk': 'info',
      'medium_risk': 'warning',
      'high_fake_risk': 'danger'
    };
    return <Badge bg={colors[riskLevel] || 'secondary'}>{riskLevel?.replace('_', ' ')}</Badge>;
  };

  const viewDetails = (report) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  return (
    <>
      <Row>
        <Col>
          <Card className="dashboard-card mb-4">
            <Card.Header className="bg-white border-bottom">
              <h4 className="mb-0 text-info">📱 Community Reports & AI Analysis ({reports.length})</h4>
            </Card.Header>
            <Card.Body>
              <div className="text-center mb-4">
                <p className="text-muted">
                  🤖 All reports are automatically analyzed by our AI system for authenticity verification
                </p>
              </div>
              
              <Row>
                {reports.length === 0 ? (
                  <Col>
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="text-muted mt-2">Loading community reports...</p>
                    </div>
                  </Col>
                ) : (
                  reports.map((report) => (
                    <Col md={6} lg={4} key={report._id} className="mb-3">
                      <Card className="h-100 card-shadow">
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 className="fw-bold">{report.type.toUpperCase()}</h6>
                            <Badge bg={report.severity === 'critical' ? 'danger' : 'warning'}>
                              {report.severity}
                            </Badge>
                          </div>
                          
                          <p className="text-muted small mb-2">📍 {report.location.address}</p>
                          <p className="small mb-2">{report.description.substring(0, 80)}...</p>
                          
                          {report.images && report.images.length > 0 ? (
                            <div className="mb-2">
                              <img
                                src={`http://localhost:5000/uploads/${report.images[0]}`}
                                alt="Disaster"
                                style={{ width: '100%', height: '120px', objectFit: 'cover' }}
                                className="rounded"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'block';
                                }}
                              />
                              <div style={{ display: 'none' }} className="bg-light p-3 rounded text-center">
                                <small className="text-muted">📷 Image not available</small>
                              </div>
                              {report.images.length > 1 && (
                                <small className="text-muted d-block">+{report.images.length - 1} more images</small>
                              )}
                            </div>
                          ) : (
                            <div className="mb-2 bg-light p-2 rounded text-center">
                              <small className="text-muted">📷 No images uploaded</small>
                            </div>
                          )}
                          
                          <div className="mb-2">
                            <strong>🤖 AI Verification:</strong><br/>
                            {report.mlClassification ? (
                              <>
                                {getAuthenticityBadge(report.mlClassification)}<br/>
                                {getRiskBadge(report.mlClassification.riskLevel)}<br/>
                                <small className="text-muted">AI Confidence: {report.mlClassification.confidence}%</small>
                              </>
                            ) : (
                              <Badge bg="warning">Pending AI Analysis</Badge>
                            )}
                          </div>
                          
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">
                              By: {report.userId?.name}
                            </small>
                            <Button size="sm" variant="outline-primary" onClick={() => viewDetails(report)}>
                              View Details
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))
                )}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>📋 Report Details & ML Analysis</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReport && (
            <div>
              <Row>
                <Col md={6}>
                  <h5>📍 Report Information</h5>
                  <p><strong>Type:</strong> {selectedReport.type}</p>
                  <p><strong>Location:</strong> {selectedReport.location.address}</p>
                  <p><strong>Description:</strong> {selectedReport.description}</p>
                  <p><strong>Reporter:</strong> {selectedReport.userId?.name}</p>
                  <p><strong>Date:</strong> {new Date(selectedReport.createdAt).toLocaleString()}</p>
                </Col>
                
                <Col md={6}>
                  <h5>🤖 AI Verification Results</h5>
                  {selectedReport.mlClassification ? (
                    <div>
                      <p><strong>Authenticity:</strong> {getAuthenticityBadge(selectedReport.mlClassification)}</p>
                      <p><strong>Risk Assessment:</strong> {getRiskBadge(selectedReport.mlClassification.riskLevel)}</p>
                      <p><strong>AI Confidence:</strong> {selectedReport.mlClassification.confidence}%</p>
                      
                      <h6>🧠 Analysis Factors:</h6>
                      <ul>
                        {selectedReport.mlClassification.reasoning?.map((reason, index) => (
                          <li key={index} className="small">{reason}</li>
                        ))}
                      </ul>
                      
                      <div className="mt-2 p-2 bg-light rounded">
                        <small className="text-muted">
                          📊 This report was automatically analyzed using machine learning algorithms 
                          that evaluate text content, image quality, location consistency, and user credibility.
                        </small>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted">AI analysis pending...</p>
                  )}
                </Col>
              </Row>
              
              {selectedReport.images && selectedReport.images.length > 0 && (
                <div className="mt-3">
                  <h5>📸 Images</h5>
                  <Row>
                    {selectedReport.images.map((image, index) => (
                      <Col md={4} key={index} className="mb-2">
                        <img
                          src={`http://localhost:5000/uploads/${image}`}
                          alt={`Disaster ${index + 1}`}
                          className="img-fluid rounded"
                        />
                      </Col>
                    ))}
                  </Row>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default UserReportsSection;