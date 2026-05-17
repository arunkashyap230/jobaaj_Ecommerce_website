import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) { navigate('/login'); return null; }

  return (
    <div className="profile-page fade-in">
      <div className="container">
        <h1 className="page-title">My Profile</h1>
        <div className="profile-card">
          <div className="profile-avatar">{user.name.charAt(0).toUpperCase()}</div>
          <div className="profile-info">
            <div className="profile-row"><label>Name</label><span>{user.name}</span></div>
            <div className="profile-row"><label>Email</label><span>{user.email}</span></div>
            <div className="profile-row"><label>Account</label><span>{user.isAdmin ? 'Administrator' : 'Customer'}</span></div>
          </div>
          <button className="btn btn-outline" onClick={() => { logout(); navigate('/'); }}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
