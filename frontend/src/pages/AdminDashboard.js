import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, Modal } from 'react-bootstrap';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [alertForm, setAlertForm] = useState({
    type: '',
    severity: 'medium',
    location: { coordinates: [0, 0], address: '' },
    description: ''
  });

  useEffect(() => {
    fetchStats();
    fetchReports();
    fetchUsers();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchReports = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/reports');
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const verifyReport = async (reportId) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/reports/${reportId}/verify`);
      fetchReports();
      alert('Report verified and alert created!');
    } catch (error) {
      console.error('Error verifying report:', error);
    }
  };

  const sendLocationAlert = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/admin/alerts/send', alertForm);
      setShowAlertModal(false);
      alert(`Alert sent successfully to ${response.data.notifiedUsers} users!`);
      
      // Reset form
      setAlertForm({
        type: '',
        severity: 'medium',
        location: { coordinates: [0, 0], address: '' },
        description: ''
      });
    } catch (error) {
      console.error('Error sending alert:', error);
      alert('Failed to send alert');
    }
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="text-center">
            <h1 className="display-5 fw-bold mb-2 text-dark">🛡️ Admin Control Panel</h1>
            <p className="lead text-muted">Manage users, reports, and emergency alerts</p>
          </div>
        </Col>
      </Row>
      
      {/* Tab Navigation */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-center flex-wrap gap-2">
            <Button
              variant={activeTab === 'overview' ? 'primary' : 'outline-primary'}
              onClick={() => setActiveTab('overview')}
            >
              📊 Overview
            </Button>
            <Button
              variant={activeTab === 'users' ? 'primary' : 'outline-primary'}
              onClick={() => setActiveTab('users')}
            >
              👥 User Management
            </Button>
            <Button
              variant={activeTab === 'reports' ? 'primary' : 'outline-primary'}
              onClick={() => setActiveTab('reports')}
            >
              📋 Reports
            </Button>
            <Button
              variant={activeTab === 'alerts' ? 'primary' : 'outline-primary'}
              onClick={() => setActiveTab('alerts')}
            >
              🚨 Send Alerts
            </Button>
          </div>
        </Col>
      </Row>
      
      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* Stats Cards */}
          <Row className="mb-4">
            <Col md={3}>
              <Card className="stats-card text-center card-shadow">
                <Card.Body>
                  <div style={{fontSize: '2rem'}} className="mb-2">🚨</div>
                  <h3 className="text-primary">{stats.totalAlerts || 0}</h3>
                  <p className="mb-0 text-muted">Total Alerts</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="stats-card text-center card-shadow">
                <Card.Body>
                  <div style={{fontSize: '2rem'}} className="mb-2">⏳</div>
                  <h3 className="text-warning">{stats.unverifiedReports || 0}</h3>
                  <p className="mb-0 text-muted">Pending Reports</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="stats-card text-center card-shadow">
                <Card.Body>
                  <div style={{fontSize: '2rem'}} className="mb-2">📋</div>
                  <h3 className="text-success">{stats.totalReports || 0}</h3>
                  <p className="mb-0 text-muted">Total Reports</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="stats-card text-center card-shadow">
                <Card.Body>
                  <div style={{fontSize: '2rem'}} className="mb-2">👥</div>
                  <h3 className="text-info">{stats.totalUsers || 0}</h3>
                  <p className="mb-0 text-muted">Total Users</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          <Row>
            <Col>
              <Card className="card-shadow">
                <Card.Header className="bg-primary text-white">
                  <h5 className="mb-0">📈 System Overview</h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <h6 className="text-muted mb-3">Recent Activity</h6>
                      <div className="mb-2">
                        <Badge bg="success" className="me-2">Active Users</Badge>
                        <span>{users.filter(u => u.role === 'user').length}</span>
                      </div>
                      <div className="mb-2">
                        <Badge bg="warning" className="me-2">Admins</Badge>
                        <span>{users.filter(u => u.role === 'admin').length}</span>
                      </div>
                      <div className="mb-2">
                        <Badge bg="info" className="me-2">Verified Reports</Badge>
                        <span>{reports.filter(r => r.verified).length}</span>
                      </div>
                    </Col>
                    <Col md={6}>
                      <h6 className="text-muted mb-3">ML Classification Stats</h6>
                      <div className="mb-2">
                        <Badge bg="success" className="me-2">Authentic Reports</Badge>
                        <span>{reports.filter(r => r.mlClassification?.isAuthentic).length}</span>
                      </div>
                      <div className="mb-2">
                        <Badge bg="danger" className="me-2">Suspicious Reports</Badge>
                        <span>{reports.filter(r => r.mlClassification && !r.mlClassification.isAuthentic).length}</span>
                      </div>
                      <div className="mb-2">
                        <Badge bg="primary" className="me-2">Avg Confidence</Badge>
                        <span>{reports.length > 0 ? Math.round(reports.reduce((acc, r) => acc + (r.mlClassification?.confidence || 0), 0) / reports.length) : 0}%</span>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
      
      {/* User Management Tab */}
      {activeTab === 'users' && (
        <Card className="card-shadow">
          <Card.Header className="bg-info text-white">
            <h4 className="mb-0">👥 User & Admin Management ({users.length})</h4>
          </Card.Header>
          <Card.Body>
            <Row>
              {users.map((user) => (
                <Col md={6} lg={4} key={user._id} className="mb-4">
                  <Card className={`h-100 border-${user.role === 'admin' ? 'danger' : 'primary'}`}>
                    <Card.Header className={`bg-${user.role === 'admin' ? 'danger' : 'primary'} text-white`}>
                      <div className="d-flex justify-content-between align-items-center">
                        <h6 className="mb-0">
                          {user.role === 'admin' ? '🛡️' : '👤'} {user.name}
                        </h6>
                        <Badge bg={user.role === 'admin' ? 'warning' : 'light'} text="dark">
                          {user.role.toUpperCase()}
                        </Badge>
                      </div>
                    </Card.Header>
                    
                    <Card.Body>
                      <div className="mb-2">
                        <strong>📧 Email:</strong>
                        <p className="text-muted small mb-1">{user.email}</p>
                      </div>
                      
                      <div className="mb-2">
                        <strong>📅 Joined:</strong>
                        <p className="text-muted small mb-1">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      
                      {user.location && (
                        <div className="mb-2">
                          <strong>📍 Location:</strong>
                          <p className="text-muted small mb-1">
                            {user.location.lat?.toFixed(4)}, {user.location.lng?.toFixed(4)}
                          </p>
                        </div>
                      )}
                      
                      {user.role === 'user' && (
                        <>
                          <div className="mb-2">
                            <strong>📊 Reports Submitted:</strong>
                            <Badge bg="info" className="ms-2">
                              {reports.filter(r => r.userId?._id === user._id).length}
                            </Badge>
                          </div>
                          
                          <div className="mb-2">
                            <strong>✅ Verified Reports:</strong>
                            <Badge bg="success" className="ms-2">
                              {reports.filter(r => r.userId?._id === user._id && r.verified).length}
                            </Badge>
                          </div>
                          
                          <div className="mb-2">
                            <strong>🎯 Credibility Score:</strong>
                            <Badge bg="primary" className="ms-2">
                              {user.credibilityScore || 50}/100
                            </Badge>
                          </div>
                        </>
                      )}
                      
                      {user.role === 'admin' && (
                        <div className="mb-2">
                          <strong>🔑 Admin Privileges:</strong>
                          <div className="mt-1">
                            <Badge bg="success" className="me-1 mb-1">Verify Reports</Badge>
                            <Badge bg="warning" className="me-1 mb-1">Send Alerts</Badge>
                            <Badge bg="danger" className="me-1 mb-1">User Management</Badge>
                          </div>
                        </div>
                      )}
                    </Card.Body>
                    
                    <Card.Footer className="bg-light">
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          Last active: {new Date(user.updatedAt || user.createdAt).toLocaleDateString()}
                        </small>
                        {user.role === 'user' && (
                          <Button size="sm" variant="outline-primary">
                            View Details
                          </Button>
                        )}
                      </div>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
            
            {users.length === 0 && (
              <div className="text-center py-4">
                <p className="text-muted">No users found</p>
              </div>
            )}
          </Card.Body>
        </Card>
      )}
      
      {/* Send Alerts Tab */}
      {activeTab === 'alerts' && (
        <Card className="card-shadow">
          <Card.Header className="bg-warning text-dark">
            <h4 className="mb-0">🚨 Emergency Alert System</h4>
          </Card.Header>
          <Card.Body>
            <Row className="mb-4">
              <Col md={6}>
                <Card className="border-danger">
                  <Card.Body className="text-center">
                    <div style={{fontSize: '3rem'}} className="mb-3">📍</div>
                    <h5>Location-Based Alert</h5>
                    <p className="text-muted">Send alerts to users within 3km radius</p>
                    <Button 
                      variant="danger" 
                      size="lg"
                      onClick={() => setShowAlertModal(true)}
                    >
                      Send Location Alert
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="border-warning">
                  <Card.Body className="text-center">
                    <div style={{fontSize: '3rem'}} className="mb-3">📢</div>
                    <h5>Broadcast Alert</h5>
                    <p className="text-muted">Send emergency message to all users</p>
                    <Button 
                      variant="warning" 
                      size="lg"
                      onClick={() => setShowBroadcastModal(true)}
                    >
                      Broadcast to All
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            
            <Card className="bg-light">
              <Card.Body>
                <h6 className="text-muted mb-3">📊 Alert Statistics</h6>
                <Row>
                  <Col md={4} className="text-center">
                    <h4 className="text-primary">{stats.totalUsers || 0}</h4>
                    <small className="text-muted">Total Recipients</small>
                  </Col>
                  <Col md={4} className="text-center">
                    <h4 className="text-success">3km</h4>
                    <small className="text-muted">Location Radius</small>
                  </Col>
                  <Col md={4} className="text-center">
                    <h4 className="text-info">5-10</h4>
                    <small className="text-muted">Max Users/Alert</small>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Card.Body>
        </Card>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <Card className="card-shadow">
          <Card.Header className="bg-success text-white">
            <h4 className="mb-0">📋 User Reports Management ({reports.length})</h4>
          </Card.Header>
        <Card.Body>
          <Row>
            {reports.map((report) => (
              <Col md={6} lg={4} key={report._id} className="mb-4">
                <Card className="h-100 card-shadow">
                  <Card.Header className={`bg-${report.verified ? 'success' : 'warning'} text-white`}>
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="mb-0">{report.type.toUpperCase()}</h6>
                      <Badge bg={report.severity === 'critical' ? 'danger' : 'info'}>
                        {report.severity}
                      </Badge>
                    </div>
                  </Card.Header>
                  
                  <Card.Body>
                    <div className="mb-2">
                      <strong>📍 Location:</strong>
                      <p className="text-muted small mb-1">{report.location.address}</p>
                    </div>
                    
                    <div className="mb-2">
                      <strong>👤 Reported by:</strong>
                      <p className="text-muted small mb-1">{report.userId?.name} ({report.userId?.email})</p>
                    </div>
                    
                    <div className="mb-2">
                      <strong>📝 Description:</strong>
                      <p className="text-muted small">{report.description}</p>
                    </div>
                    
                    {report.hashtags && report.hashtags.length > 0 && (
                      <div className="mb-2">
                        <strong>🏷️ Hashtags:</strong>
                        <div>
                          {report.hashtags.map((tag, index) => (
                            <Badge key={index} bg="secondary" className="me-1 mb-1">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {report.images && report.images.length > 0 && (
                      <div className="mb-2">
                        <strong>📸 Images ({report.images.length}):</strong>
                        <div className="d-flex flex-wrap mt-1">
                          {report.images.slice(0, 3).map((image, index) => (
                            <img
                              key={index}
                              src={`http://localhost:5000/uploads/${image}`}
                              alt="Disaster"
                              style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                              className="me-1 mb-1 rounded"
                            />
                          ))}
                          {report.images.length > 3 && (
                            <div className="d-flex align-items-center justify-content-center bg-light rounded" 
                                 style={{ width: '60px', height: '60px' }}>
                              <small>+{report.images.length - 3}</small>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="mb-2">
                      <small className="text-muted">
                        📅 {new Date(report.createdAt).toLocaleString()}
                      </small>
                    </div>
                  </Card.Body>
                  
                  <Card.Footer className="bg-light">
                    <div className="d-flex justify-content-between align-items-center">
                      <Badge bg={report.verified ? 'success' : 'secondary'}>
                        {report.verified ? '✅ Verified' : '⏳ Pending'}
                      </Badge>
                      {!report.verified && (
                        <Button 
                          size="sm" 
                          variant="success"
                          onClick={() => verifyReport(report._id)}
                        >
                          Verify Report
                        </Button>
                      )}
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
          
            {reports.length === 0 && (
              <div className="text-center py-4">
                <p className="text-muted">No user reports found</p>
              </div>
            )}
          </Card.Body>
        </Card>
      )}

      {/* Send Alert Modal */}
      <Modal show={showAlertModal} onHide={() => setShowAlertModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Send Location Alert</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Disaster Type</Form.Label>
              <Form.Select 
                value={alertForm.type}
                onChange={(e) => setAlertForm({...alertForm, type: e.target.value})}
              >
                <option value="">Select Type</option>
                <option value="earthquake">Earthquake</option>
                <option value="flood">Flood</option>
                <option value="fire">Fire</option>
                <option value="cyclone">Cyclone</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Severity</Form.Label>
              <Form.Select 
                value={alertForm.severity}
                onChange={(e) => setAlertForm({...alertForm, severity: e.target.value})}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Target Location</Form.Label>
              <Form.Control 
                type="text"
                placeholder="Enter location address"
                value={alertForm.location.address}
                onChange={(e) => setAlertForm({
                  ...alertForm, 
                  location: {
                    ...alertForm.location, 
                    address: e.target.value
                  }
                })}
              />
            </Form.Group>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Latitude</Form.Label>
                  <Form.Control 
                    type="number"
                    step="any"
                    placeholder="14.84123"
                    value={alertForm.location.coordinates[1] || ''}
                    onChange={(e) => setAlertForm({
                      ...alertForm, 
                      location: {
                        ...alertForm.location,
                        coordinates: [alertForm.location.coordinates[0] || 0, parseFloat(e.target.value) || 0]
                      }
                    })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Longitude</Form.Label>
                  <Form.Control 
                    type="number"
                    step="any"
                    placeholder="123.12345"
                    value={alertForm.location.coordinates[0] || ''}
                    onChange={(e) => setAlertForm({
                      ...alertForm, 
                      location: {
                        ...alertForm.location,
                        coordinates: [parseFloat(e.target.value) || 0, alertForm.location.coordinates[1] || 0]
                      }
                    })}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Text className="text-muted">
              📍 Alert will be sent to 5-10 users within 3km of these coordinates
            </Form.Text>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control 
                as="textarea"
                rows={3}
                value={alertForm.description}
                onChange={(e) => setAlertForm({...alertForm, description: e.target.value})}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAlertModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={sendLocationAlert}>
            Send Alert
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Broadcast Modal */}
      <Modal show={showBroadcastModal} onHide={() => setShowBroadcastModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Broadcast Alert to All Users</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Alert Message</Form.Label>
              <Form.Control 
                as="textarea"
                rows={4}
                placeholder="Enter emergency message for all users"
                value={alertForm.description}
                onChange={(e) => setAlertForm({...alertForm, description: e.target.value})}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBroadcastModal(false)}>
            Cancel
          </Button>
          <Button variant="warning" onClick={async () => {
            try {
              await axios.post('http://localhost:5000/api/admin/broadcast', {
                message: alertForm.description
              });
              setShowBroadcastModal(false);
              alert('Broadcast sent to all users!');
            } catch (error) {
              alert('Failed to send broadcast');
            }
          }}>
            Send to All Users
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;