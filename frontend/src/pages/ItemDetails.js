import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ItemDetails.css';

const ItemDetails = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ✅ 1. DEFINE fetchItem FIRST
  const fetchItem = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/items/${id}`);
      setItem(res.data);
      setError('');
    } catch (err) {
      setError('Item not found');
    } finally {
      setLoading(false);
    }
  }, [id]);

  // ✅ 2. THEN use it
  useEffect(() => {
    fetchItem();
  }, [fetchItem]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/items/${id}`, {
          headers: { 'x-auth-token': token }
        });
        navigate('/');
      } catch (err) {
        alert('Failed to delete item');
      }
    }
  };

  const handleMarkResolved = async () => {
    try {
      const token = localStorage.getItem('token');
      const updatedItem = { ...item, resolved: true };

      await axios.put(`/api/items/${id}`, updatedItem, {
        headers: { 'x-auth-token': token }
      });

      setItem(updatedItem);
    } catch (err) {
      alert('Failed to update item');
    }
  };

  if (loading) {
    return <div className="loading">Loading item...</div>;
  }

  if (error || !item) {
    return (
      <div className="container">
        <div className="error-page">
          <h2>Item Not Found</h2>
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  const isOwner = user && user.id === item.userId;

  return (
    <div className="item-details-page">
      <div className="container">
        <div className="item-details-container">

          <div className="item-header">
            <div>
              <span className={`badge badge-${item.status}`}>
                {item.status === 'lost' ? '❌ Lost' : '✅ Found'}
              </span>
              {item.resolved && (
                <span className="badge badge-resolved">Resolved</span>
              )}
            </div>
            <span className="item-category-badge">{item.category}</span>
          </div>

          <h1>{item.title}</h1>

          <div className="item-meta">
            <span>👤 Posted by: {item.userName}</span>
            <span>📅 Date: {new Date(item.date).toLocaleDateString()}</span>
            <span>📍 Location: {item.location}</span>
          </div>

          {item.imageUrl && (
            <div className="item-image">
              <img src={item.imageUrl} alt={item.title} />
            </div>
          )}

          <div className="item-content">
            <h3>Description</h3>
            <p>{item.description}</p>
          </div>

          <div className="item-contact">
            <h3>Contact Information</h3>
            <p>📞 {item.contactInfo}</p>
          </div>

          <div className="item-actions">
            <button onClick={() => navigate('/')} className="btn btn-secondary">
              Back to Home
            </button>

            {isOwner && !item.resolved && (
              <button onClick={handleMarkResolved} className="btn btn-success">
                Mark as Resolved
              </button>
            )}

            {isOwner && (
              <button onClick={handleDelete} className="btn btn-danger">
                Delete Item
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
