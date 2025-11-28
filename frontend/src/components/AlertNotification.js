import React, { useState, useEffect } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import io from 'socket.io-client';

const AlertNotification = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const socket = io('http://localhost:5000');
    
    socket.on('targetedAlert', (data) => {
      const newNotification = {
        id: Date.now(),
        title: '🚨 DISASTER ALERT',
        message: data.message,
        location: data.location,
        timestamp: new Date(),
        show: true
      };
      
      setNotifications(prev => [...prev, newNotification]);
      
      // Auto-hide after 10 seconds
      setTimeout(() => {
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === newNotification.id 
              ? { ...notif, show: false } 
              : notif
          )
        );
      }, 10000);
    });

    return () => socket.disconnect();
  }, []);

  const hideNotification = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, show: false } : notif
      )
    );
  };

  return (
    <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          show={notification.show}
          onClose={() => hideNotification(notification.id)}
          bg="danger"
          className="text-white"
        >
          <Toast.Header>
            <strong className="me-auto">{notification.title}</strong>
            <small>{notification.timestamp.toLocaleTimeString()}</small>
          </Toast.Header>
          <Toast.Body>
            <div>
              <strong>Location:</strong> {notification.location}
            </div>
            <div className="mt-2">
              {notification.message}
            </div>
          </Toast.Body>
        </Toast>
      ))}
    </ToastContainer>
  );
};

export default AlertNotification;