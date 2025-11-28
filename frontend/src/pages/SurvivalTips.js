import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, ProgressBar, Alert } from 'react-bootstrap';

const SurvivalTips = () => {
  const [activeTab, setActiveTab] = useState('insights');
  const [quizScore, setQuizScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [completedQuiz, setCompletedQuiz] = useState(false);

  const insights = {
    statistics: {
      earthquakes: { yearly: 1200, fatalities: 15000, affected: '2.5M' },
      floods: { yearly: 3500, fatalities: 25000, affected: '4.2M' },
      fires: { yearly: 850, fatalities: 8000, affected: '1.8M' },
      cyclones: { yearly: 45, fatalities: 12000, affected: '3.1M' }
    },
    trends: [
      { disaster: 'Floods', increase: '+15%', reason: 'Climate change & urbanization' },
      { disaster: 'Wildfires', increase: '+23%', reason: 'Rising temperatures' },
      { disaster: 'Earthquakes', increase: '+5%', reason: 'Better detection systems' }
    ]
  };

  const tips = {
    earthquake: {
      icon: '🏠',
      color: 'warning',
      tips: [
        { action: 'Drop, Cover, and Hold On', detail: 'Drop to hands and knees, take cover under desk, hold on until shaking stops' },
        { action: 'Stay away from glass', detail: 'Windows, mirrors, and glass fixtures can shatter and cause injuries' },
        { action: 'If outdoors, find open space', detail: 'Move away from buildings, trees, and power lines' },
        { action: 'Prepare emergency kit', detail: 'Water (1 gallon/person/day), food, flashlight, radio, first aid' }
      ]
    },
    flood: {
      icon: '🌊',
      color: 'info',
      tips: [
        { action: 'Move to higher ground', detail: 'Even 6 inches of moving water can knock you down' },
        { action: 'Avoid flooded roads', detail: 'Turn around, don\'t drown - most flood deaths occur in vehicles' },
        { action: 'Turn off utilities', detail: 'Gas, electricity, and water to prevent additional hazards' },
        { action: 'Listen to authorities', detail: 'Follow evacuation orders and emergency broadcasts' }
      ]
    },
    fire: {
      icon: '🔥',
      color: 'danger',
      tips: [
        { action: 'Stay low, crawl if needed', detail: 'Smoke and toxic gases rise, cleaner air is near the floor' },
        { action: 'Feel doors before opening', detail: 'Hot door means fire on other side - find alternate route' },
        { action: 'Plan multiple escape routes', detail: 'Primary and secondary exits from every room' },
        { action: 'Never use elevators', detail: 'Power may fail, trapping you inside during emergency' }
      ]
    },
    cyclone: {
      icon: '🌪️',
      color: 'primary',
      tips: [
        { action: 'Monitor weather alerts', detail: 'Track storm path and intensity updates continuously' },
        { action: 'Secure outdoor items', detail: 'Bring in or tie down anything that could become projectiles' },
        { action: 'Stock emergency supplies', detail: '3-7 days of food, water, medications, and batteries' },
        { action: 'Identify safe room', detail: 'Interior room on lowest floor, away from windows' }
      ]
    }
  };

  const quizQuestions = [
    {
      question: 'What should you do immediately during an earthquake?',
      options: ['Run outside quickly', 'Drop, Cover, and Hold On', 'Stand in a doorway', 'Use elevator to escape'],
      correct: 1,
      explanation: 'Drop, Cover, and Hold On is the safest action during earthquake shaking.'
    },
    {
      question: 'How much moving flood water can knock down an adult?',
      options: ['2 inches', '6 inches', '1 foot', '2 feet'],
      correct: 1,
      explanation: 'Just 6 inches of moving water can knock down an adult, and 12 inches can carry away a vehicle.'
    },
    {
      question: 'What is the primary emergency number in India?',
      options: ['100', '101', '112', '108'],
      correct: 2,
      explanation: '112 is the unified emergency number in India for all emergency services.'
    },
    {
      question: 'During a house fire, where is the safest air to breathe?',
      options: ['Near the ceiling', 'At standing height', 'Close to the floor', 'Near windows'],
      correct: 2,
      explanation: 'Toxic smoke and gases rise, so cleaner air is found closer to the floor.'
    },
    {
      question: 'How many days of emergency supplies should you have?',
      options: ['1 day', '3 days', '7 days', '14 days'],
      correct: 1,
      explanation: 'Minimum 3 days of supplies recommended, but 7 days is better for major disasters.'
    }
  ];

  const handleQuizAnswer = (selectedAnswer) => {
    const isCorrect = selectedAnswer === quizQuestions[currentQuestion].correct;
    if (isCorrect) {
      setQuizScore(quizScore + 1);
    }
    
    if (currentQuestion < quizQuestions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 1500);
    } else {
      setTimeout(() => {
        setCompletedQuiz(true);
      }, 1500);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setQuizScore(0);
    setCompletedQuiz(false);
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="text-center">
            <h1 className="display-4 fw-bold mb-2 text-dark">🛡️ Disaster Preparedness Hub</h1>
            <p className="lead text-muted">Essential knowledge, insights, and training for emergency situations</p>
          </div>
        </Col>
      </Row>
      
      {/* Enhanced Tab Navigation */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-center flex-wrap gap-2">
            <Button
              variant={activeTab === 'insights' ? 'primary' : 'outline-primary'}
              onClick={() => setActiveTab('insights')}
              className="px-4 py-2"
            >
              📊 Disaster Insights
            </Button>
            <Button
              variant={activeTab === 'tips' ? 'primary' : 'outline-primary'}
              onClick={() => setActiveTab('tips')}
              className="px-4 py-2"
            >
              💡 Safety Tips
            </Button>
            <Button
              variant={activeTab === 'quiz' ? 'primary' : 'outline-primary'}
              onClick={() => setActiveTab('quiz')}
              className="px-4 py-2"
            >
              🧠 Knowledge Quiz
            </Button>
            <Button
              variant={activeTab === 'resources' ? 'primary' : 'outline-primary'}
              onClick={() => setActiveTab('resources')}
              className="px-4 py-2"
            >
              📚 Resources
            </Button>
          </div>
        </Col>
      </Row>
      
      {/* Disaster Insights */}
      {activeTab === 'insights' && (
        <>
          <Row className="mb-4">
            <Col>
              <Card className="card-shadow">
                <Card.Header className="bg-primary text-white">
                  <h4 className="mb-0">📈 Global Disaster Statistics (Annual)</h4>
                </Card.Header>
                <Card.Body>
                  <Row>
                    {Object.entries(insights.statistics).map(([disaster, data]) => (
                      <Col md={3} key={disaster} className="text-center mb-3">
                        <Card className="h-100 border-0 bg-light">
                          <Card.Body>
                            <h5 className="text-capitalize">{disaster}</h5>
                            <div className="mb-2">
                              <Badge bg="danger" className="mb-1">{data.yearly} events</Badge>
                            </div>
                            <small className="text-muted d-block">Fatalities: {data.fatalities.toLocaleString()}</small>
                            <small className="text-muted">Affected: {data.affected} people</small>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          <Row>
            <Col>
              <Card className="card-shadow">
                <Card.Header className="bg-warning text-dark">
                  <h4 className="mb-0">📊 Recent Trends & Analysis</h4>
                </Card.Header>
                <Card.Body>
                  {insights.trends.map((trend, index) => (
                    <Alert key={index} variant="info" className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{trend.disaster}</strong> incidents have increased by <Badge bg="danger">{trend.increase}</Badge>
                        <br/><small className="text-muted">Primary cause: {trend.reason}</small>
                      </div>
                    </Alert>
                  ))}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
      
      {/* Enhanced Safety Tips */}
      {activeTab === 'tips' && (
        <Row>
          {Object.entries(tips).map(([disaster, data]) => (
            <Col lg={6} key={disaster} className="mb-4">
              <Card className="h-100 card-shadow">
                <Card.Header className={`bg-${data.color} text-white`}>
                  <h4 className="mb-0">{data.icon} {disaster.charAt(0).toUpperCase() + disaster.slice(1)} Safety</h4>
                </Card.Header>
                <Card.Body>
                  {data.tips.map((tip, index) => (
                    <div key={index} className="mb-3 p-3 border-start border-3 border-success bg-light">
                      <h6 className="fw-bold text-success mb-1">✓ {tip.action}</h6>
                      <small className="text-muted">{tip.detail}</small>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      
      {/* Enhanced Quiz */}
      {activeTab === 'quiz' && (
        <Row className="justify-content-center">
          <Col lg={8}>
            <Card className="card-shadow">
              <Card.Header className="bg-success text-white">
                <h4 className="mb-0">🧠 Disaster Preparedness Quiz</h4>
              </Card.Header>
              <Card.Body>
                {!completedQuiz ? (
                  <>
                    <div className="mb-4">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="text-muted">Question {currentQuestion + 1} of {quizQuestions.length}</span>
                        <Badge bg="primary">Score: {quizScore}/{currentQuestion}</Badge>
                      </div>
                      <ProgressBar 
                        now={((currentQuestion + 1) / quizQuestions.length) * 100} 
                        variant="success"
                        className="mb-3"
                      />
                    </div>
                    
                    <Card className="mb-4 border-primary">
                      <Card.Body>
                        <h5 className="mb-4">{quizQuestions[currentQuestion].question}</h5>
                        <div className="d-grid gap-2">
                          {quizQuestions[currentQuestion].options.map((option, index) => (
                            <Button
                              key={index}
                              variant="outline-primary"
                              onClick={() => handleQuizAnswer(index)}
                              className="text-start p-3"
                            >
                              {String.fromCharCode(65 + index)}. {option}
                            </Button>
                          ))}
                        </div>
                      </Card.Body>
                    </Card>
                  </>
                ) : (
                  <div className="text-center">
                    <h3 className="mb-4">🎉 Quiz Completed!</h3>
                    <div className="mb-4">
                      <h2 className="display-4 text-primary">{quizScore}/{quizQuestions.length}</h2>
                      <p className="lead">
                        {quizScore === quizQuestions.length ? 'Perfect Score! 🏆' :
                         quizScore >= quizQuestions.length * 0.8 ? 'Excellent Knowledge! 🌟' :
                         quizScore >= quizQuestions.length * 0.6 ? 'Good Understanding! 👍' :
                         'Keep Learning! 📚'}
                      </p>
                    </div>
                    <Button variant="primary" onClick={resetQuiz} size="lg">
                      Take Quiz Again
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
      
      {/* Resources & Training */}
      {activeTab === 'resources' && (
        <>
          <Row className="mb-4">
            <Col>
              <Card className="card-shadow">
                <Card.Header className="bg-info text-white">
                  <h4 className="mb-0">📚 Essential Resources</h4>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={4} className="mb-3">
                      <Card className="h-100 border-warning">
                        <Card.Body className="text-center">
                          <div className="mb-3" style={{fontSize: '3rem'}}>📋</div>
                          <h5>Emergency Checklist</h5>
                          <p className="small text-muted">Complete preparation checklist for all disaster types</p>
                          <Button variant="warning" size="sm">Download PDF</Button>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={4} className="mb-3">
                      <Card className="h-100 border-success">
                        <Card.Body className="text-center">
                          <div className="mb-3" style={{fontSize: '3rem'}}>🎒</div>
                          <h5>Emergency Kit Guide</h5>
                          <p className="small text-muted">Essential items for your disaster preparedness kit</p>
                          <Button variant="success" size="sm">View Guide</Button>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={4} className="mb-3">
                      <Card className="h-100 border-danger">
                        <Card.Body className="text-center">
                          <div className="mb-3" style={{fontSize: '3rem'}}>📞</div>
                          <h5>Emergency Contacts</h5>
                          <p className="small text-muted">Important phone numbers and contact information</p>
                          <Button variant="danger" size="sm">View Contacts</Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          <Row>
            <Col md={6} className="mb-4">
              <Card className="card-shadow">
                <Card.Header className="bg-primary text-white">
                  <h5 className="mb-0">🎥 Training Videos</h5>
                </Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <div className="bg-light p-4 rounded text-center mb-2" style={{height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <div>
                        <div style={{fontSize: '3rem'}} className="mb-2">🏠</div>
                        <span className="text-muted">Earthquake Safety Training</span>
                      </div>
                    </div>
                    <h6>Drop, Cover, Hold On Technique</h6>
                    <p className="small text-muted">Learn the proper earthquake response in 5 minutes</p>
                  </div>
                  <div className="mb-3">
                    <div className="bg-light p-4 rounded text-center mb-2" style={{height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <div>
                        <div style={{fontSize: '3rem'}} className="mb-2">🌊</div>
                        <span className="text-muted">Flood Safety Procedures</span>
                      </div>
                    </div>
                    <h6>Flood Evacuation & Safety</h6>
                    <p className="small text-muted">Essential flood response and evacuation techniques</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={6} className="mb-4">
              <Card className="card-shadow">
                <Card.Header className="bg-secondary text-white">
                  <h5 className="mb-0">📖 Quick Reference</h5>
                </Card.Header>
                <Card.Body>
                  <Alert variant="danger" className="mb-3">
                    <Alert.Heading className="h6">🚨 Emergency Numbers</Alert.Heading>
                    <hr/>
                    <p className="mb-1"><strong>All Emergencies:</strong> 112</p>
                    <p className="mb-1"><strong>Police:</strong> 100</p>
                    <p className="mb-1"><strong>Fire:</strong> 101</p>
                    <p className="mb-0"><strong>Ambulance:</strong> 108</p>
                  </Alert>
                  
                  <Alert variant="warning" className="mb-3">
                    <Alert.Heading className="h6">⚡ Power Outage</Alert.Heading>
                    <hr/>
                    <ul className="mb-0 small">
                      <li>Use flashlights, not candles</li>
                      <li>Keep refrigerator/freezer closed</li>
                      <li>Unplug electronics</li>
                      <li>Check on neighbors</li>
                    </ul>
                  </Alert>
                  
                  <Alert variant="info" className="mb-0">
                    <Alert.Heading className="h6">💧 Water Emergency</Alert.Heading>
                    <hr/>
                    <ul className="mb-0 small">
                      <li>Store 1 gallon per person per day</li>
                      <li>Boil water if contaminated</li>
                      <li>Use water purification tablets</li>
                      <li>Collect rainwater safely</li>
                    </ul>
                  </Alert>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default SurvivalTips;