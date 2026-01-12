import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './MyItems.css';
const MyItems = ({ user }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyItems();
  }, []);

  const fetchMyItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };

      const res = await axios.get('/api/items/user/my-items', config);
      setItems(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading your items...</div>;
  }

  return (
    <div className="my-items-page">
      <div className="container">
        <div className="page-header">
          <h1>My Items</h1>
          <Link to="/add-item" className="btn btn-primary">
            + Add New Item
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="no-items-message">
            <h3>You haven't posted any items yet</h3>
            <p>Start helping the community by posting lost or found items!</p>
            <Link to="/add-item" className="btn btn-primary">
              Add Your First Item
            </Link>
          </div>
        ) : (
          <div className="my-items-grid">
            {items.map(item => (
              <div key={item._id} className="my-item-card">
                <div className="item-status-bar">
                  <span className={`badge badge-${item.status}`}>
                    {item.status === 'lost' ? '❌ Lost' : '✅ Found'}
                  </span>
                  {item.resolved && <span className="badge badge-resolved">Resolved</span>}
                </div>
                
                <h3>{item.title}</h3>
                <p className="item-category">📦 {item.category}</p>
                <p className="item-description">{item.description.substring(0, 120)}...</p>
                
                <div className="item-info">
                  <span>📍 {item.location}</span>
                  <span>📅 {new Date(item.date).toLocaleDateString()}</span>
                </div>

                <div className="item-footer">
                  <span className="posted-date">
                    Posted: {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                  <Link to={`/item/${item._id}`} className="btn btn-sm btn-primary">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="items-summary">
          <h3>Summary</h3>
          <div className="summary-stats">
            <div className="stat-card">
              <span className="stat-number">{items.length}</span>
              <span className="stat-label">Total Items</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{items.filter(i => i.status === 'lost').length}</span>
              <span className="stat-label">Lost Items</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{items.filter(i => i.status === 'found').length}</span>
              <span className="stat-label">Found Items</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{items.filter(i => i.resolved).length}</span>
              <span className="stat-label">Resolved</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyItems;