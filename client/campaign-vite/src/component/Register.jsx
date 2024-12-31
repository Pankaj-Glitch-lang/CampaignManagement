import React, { useState } from 'react';
import api from '../../services/api';
import '../App.css';  // Make sure to create the corresponding CSS file
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const naviagate=useNavigate()


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      const response = await api.post('admin/register', { email, password });
      setSuccessMessage('Registration successful! You can now log in.');
      
      naviagate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Admin Register</h2>
        
        {/* Error and Success Message Display */}
        {error && <div className="error-message">{error}</div>}
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        {/* Form */}
        <form className="register-form" onSubmit={handleSubmit}>
          
          {/* Email Input */}
          <div className="input-group">
            <label htmlFor="email" className="label">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
            />
          </div>

          {/* Password Input */}
          <div className="input-group">
            <label htmlFor="password" className="label">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="submit-button"
          >
            Register
          </button>
        </form>

        {/* Login Link */}
        <div className="login-link">
          <p>Have an account? <a href="/login">Login here</a></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
