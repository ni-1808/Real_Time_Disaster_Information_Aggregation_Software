import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DisasterInsights = () => {
  const [news, setNews] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    region: '',
    severity: ''
  });

  useEffect(() => {
    fetchNews();
  }, [filters]);

  const fetchNews = async () => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });
      
      const response = await axios.get(`http://localhost:5000/api/news?${params}`);
      setNews(response.data);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Disaster Insights</h1>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="">All Categories</option>
            <option value="earthquake">Earthquake</option>
            <option value="flood">Flood</option>
            <option value="hurricane">Hurricane</option>
            <option value="wildfire">Wildfire</option>
          </select>
          
          <select
            value={filters.region}
            onChange={(e) => handleFilterChange('region', e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="">All Regions</option>
            <option value="north">North India</option>
            <option value="south">South India</option>
            <option value="east">East India</option>
            <option value="west">West India</option>
          </select>
          
          <select
            value={filters.severity}
            onChange={(e) => handleFilterChange('severity', e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="">All Severities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>
      
      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item) => (
          <div key={item._id} className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold mb-2">{item.headline}</h3>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">{item.category}</span>
              <span className={`px-2 py-1 rounded text-xs ${
                item.severity === 'critical' ? 'bg-red-100 text-red-800' :
                item.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                item.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {item.severity}
              </span>
            </div>
            <p className="text-sm text-gray-700 mb-3">{item.content}</p>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>{item.region}</span>
              <span>{new Date(item.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
      
      {news.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No news articles found for the selected filters.</p>
        </div>
      )}
    </div>
  );
};

export default DisasterInsights;