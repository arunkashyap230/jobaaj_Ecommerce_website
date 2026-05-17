import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './Orders.css';

function Orders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    api.get('/orders/myorders')
      .then((res) => setOrders(res.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  if (loading) return <div className="loader"><div className="spinner"></div></div>;

  return (
    <div className="orders-page fade-in">
      <div className="container">
        <h1 className="page-title">My Orders</h1>
        <p className="page-subtitle">{orders.length} {orders.length === 1 ? 'order' : 'orders'}</p>

        {orders.length === 0 ? (
          <div className="empty-card">
            <div className="empty-icon">📦</div>
            <h2>No orders yet</h2>
            <p>When you place an order, it will appear here.</p>
            <Link to="/" className="btn btn-primary btn-lg">Start Shopping</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div>
                    <small>Order ID</small>
                    <strong>#{order._id.slice(-8).toUpperCase()}</strong>
                  </div>
                  <div>
                    <small>Date</small>
                    <strong>{new Date(order.createdAt).toLocaleDateString()}</strong>
                  </div>
                  <div>
                    <small>Total</small>
                    <strong>${order.totalPrice.toFixed(2)}</strong>
                  </div>
                  <div>
                    <span className={`status-badge ${order.isDelivered ? 'delivered' : order.isPaid ? 'paid' : 'pending'}`}>
                      {order.isDelivered ? 'Delivered' : order.isPaid ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                </div>
                <div className="order-items">
                  {order.orderItems.map((item, i) => (
                    <div key={i} className="order-item">
                      <img src={item.image} alt={item.name} />
                      <div>
                        <strong>{item.name}</strong>
                        <small>Qty: {item.qty} · ${item.price.toFixed(2)}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
