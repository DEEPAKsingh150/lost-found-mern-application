import React, { useState, useEffect,useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

const Home = ({ user }) => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    search: ''
  });

  // ✅ 1. Fetch items on mount
  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/items');
      setItems(res.data);
      setFilteredItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ 2. Filter logic (defined BEFORE useEffect)
  const filterItems = useCallback(() => {
    let filtered = [...items];

    if (filters.status) {
      filtered = filtered.filter(item => item.status === filters.status);
    }

    if (filters.category) {
      filtered = filtered.filter(item => item.category === filters.category);
    }

    if (filters.search) {
      const searchText = filters.search.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchText) ||
        item.description.toLowerCase().includes(searchText)
      );
    }

    setFilteredItems(filtered);
  }, [items, filters]);

  // ✅ 3. Load data once
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // ✅ 4. Re-filter when data or filters change
  useEffect(() => {
    filterItems();
  }, [filterItems]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return <div className="loading">Loading items...</div>;
  }

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="container">
          <h1>Lost & Found</h1>
          <p>Lost something? Let’s bring it back where it belongs.</p>
        </div>
      </div>

      <div className="container">
        <div className="filters-section card">
          <h2>Search & Filter</h2>

          <div className="filters-grid">
            <div className="form-group">
              <input
                type="text"
                name="search"
                placeholder="Search items..."
                value={filters.search}
                onChange={handleFilterChange}
              />
            </div>

            <div className="form-group">
              <select name="status" value={filters.status} onChange={handleFilterChange}>
                <option value="">All Status</option>
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </select>
            </div>

            <div className="form-group">
              <select name="category" value={filters.category} onChange={handleFilterChange}>
                <option value="">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Documents">Documents</option>
                <option value="Accessories">Accessories</option>
                <option value="Clothing">Clothing</option>
                <option value="Keys">Keys</option>
                <option value="Bags">Bags</option>
                <option value="Others">Others</option>
              </select>
            </div>
          </div>
        </div>

        <div className="items-header">
          <h2>Recent Items ({filteredItems.length})</h2>
          {user && (
            <Link to="/add-item" className="btn btn-primary">
              + Add Item
            </Link>
          )}
        </div>

        {filteredItems.length === 0 ? (
          <div className="no-items">
            <p>No items found. {user ? 'Be the first to add one!' : 'Please login to add items.'}</p>
          </div>
        ) : (
          <div className="items-grid">
            {filteredItems.map(item => (
              <Link to={`/item/${item._id}`} key={item._id} className="item-card">
                <div className="item-status">
                  <span className={`badge badge-${item.status}`}>
                    {item.status === 'lost' ? '❌ Lost' : '✅ Found'}
                  </span>
                  <span className="item-category">{item.category}</span>
                </div>

                <h3>{item.title}</h3>
                <p className="item-description">
                  {item.description.substring(0, 100)}...
                </p>

                <div className="item-info">
                  <span>📍 {item.location}</span>
                  <span>📅 {new Date(item.date).toLocaleDateString()}</span>
                </div>

                <div className="item-footer">
                  <span className="posted-by">Posted by: {item.userName}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
