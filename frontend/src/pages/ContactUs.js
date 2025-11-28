import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContactUs = () => {
  const [helpdesks, setHelpdesks] = useState([]);
  const [selectedState, setSelectedState] = useState('');

  useEffect(() => {
    fetchHelpdesks();
  }, [selectedState]);

  const fetchHelpdesks = async () => {
    try {
      const params = selectedState ? `?state=${selectedState}` : '';
      const response = await axios.get(`http://localhost:5000/api/helpdesk${params}`);
      setHelpdesks(response.data);
    } catch (error) {
      console.error('Error fetching helpdesks:', error);
    }
  };

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Emergency Contacts</h1>
      
      {/* National Emergency Numbers */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-red-800 mb-4">National Emergency Numbers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">112</div>
            <div className="text-sm">National Emergency</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">101</div>
            <div className="text-sm">Fire Department</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">102</div>
            <div className="text-sm">Ambulance</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">100</div>
            <div className="text-sm">Police</div>
          </div>
        </div>
      </div>
      
      {/* State Filter */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">State-wise Emergency Contacts</h2>
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="w-full md:w-auto border rounded px-3 py-2"
        >
          <option value="">All States</option>
          {indianStates.map((state) => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </div>
      
      {/* Helpdesk Contacts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {helpdesks.map((helpdesk) => (
          <div key={helpdesk._id} className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-lg mb-2">{helpdesk.state}</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">📞</span>
                <a href={`tel:${helpdesk.contactNumber}`} className="text-blue-600 hover:underline">
                  {helpdesk.contactNumber}
                </a>
              </div>
              <div className="flex items-start">
                <span className="text-gray-600 mr-2">📍</span>
                <span className="text-sm">{helpdesk.address}</span>
              </div>
              {helpdesk.email && (
                <div className="flex items-center">
                  <span className="text-gray-600 mr-2">✉️</span>
                  <a href={`mailto:${helpdesk.email}`} className="text-blue-600 hover:underline text-sm">
                    {helpdesk.email}
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {helpdesks.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No emergency contacts found for the selected state.</p>
        </div>
      )}
      
      {/* Additional Resources */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Additional Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium mb-2">Disaster Management</h3>
            <ul className="text-sm space-y-1">
              <li>• National Disaster Management Authority (NDMA)</li>
              <li>• State Disaster Management Authority</li>
              <li>• District Collector Office</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">Medical Emergency</h3>
            <ul className="text-sm space-y-1">
              <li>• Nearest Hospital</li>
              <li>• Blood Bank</li>
              <li>• Poison Control Center</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;