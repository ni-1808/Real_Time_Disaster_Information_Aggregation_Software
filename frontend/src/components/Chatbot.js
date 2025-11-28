import React, { useState } from 'react';
import { Card, Button, Form, InputGroup } from 'react-bootstrap';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: 'Hello! I can help you with disaster preparedness questions.', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');

  const faqs = {
    'earthquake': 'During an earthquake: Drop, Cover, and Hold On. Stay away from windows and heavy objects.',
    'flood': 'During floods: Move to higher ground immediately. Avoid walking or driving through flood waters.',
    'fire': 'During fires: Stay low to avoid smoke. Have an evacuation plan ready.',
    'emergency': 'Emergency contacts: 112 (National Emergency), 101 (Fire), 102 (Ambulance), 100 (Police)'
  };

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { text: input, sender: 'user' }]);
    
    const response = Object.keys(faqs).find(key => 
      input.toLowerCase().includes(key)
    );
    
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: response ? faqs[response] : 'I can help with earthquake, flood, fire safety, and emergency contacts.',
        sender: 'bot' 
      }]);
    }, 500);
    
    setInput('');
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1050 }}>
      {isOpen && (
        <Card style={{ width: '350px', height: '400px', marginBottom: '10px' }} className="card-shadow">
          <Card.Header className="bg-white border-bottom">
            <h6 className="mb-0 text-danger">🤖 Disaster Help Bot</h6>
          </Card.Header>
          
          <Card.Body style={{ padding: '10px', overflowY: 'auto', height: '280px' }}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`mb-2 ${msg.sender === 'user' ? 'text-end' : 'text-start'}`}>
                <div className={`d-inline-block p-2 rounded ${
                  msg.sender === 'user' 
                    ? 'bg-primary text-white' 
                    : 'bg-light border'
                }`} style={{ maxWidth: '80%' }}>
                  <small>{msg.text}</small>
                </div>
              </div>
            ))}
          </Card.Body>
          
          <Card.Footer className="p-2">
            <InputGroup size="sm">
              <Form.Control
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about safety..."
              />
              <Button variant="danger" className="btn-shadow" onClick={handleSend}>
                Send
              </Button>
            </InputGroup>
          </Card.Footer>
        </Card>
      )}
      
      <Button
        variant="danger"
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-circle p-3 btn-shadow"
        style={{ width: '60px', height: '60px' }}
      >
        💬
      </Button>
    </div>
  );
};

export default Chatbot;