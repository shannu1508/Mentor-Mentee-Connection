import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/login.module.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState('mentor');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8001';
      const response = await fetch(`${baseUrl}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          role: selectedRole
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Use the auth context login function
        login(data.user, data.token);
        
        // Redirect based on user role
        if (data.user.role === 'mentor') {
          navigate('/mentor/dashboard');
        } else {
          navigate('/mentee/dashboard');
        }
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Error connecting to the server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {/* Left Section with Illustration */}
        <div className={styles.left}>
          <img 
            src="https://img.freepik.com/free-vector/mobile-login-concept-illustration_114360-83.jpg" 
            alt="Login Illustration" 
          />
        </div>

        {/* Right Section with Login Form */}
        <div className={styles.right}>
          <div className={styles.header}>
            <h2>Welcome Back!</h2>
            <p>Log in to continue your journey with Mentor Connect</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className={styles.roleSelector}>
              <button
                type="button"
                className={`${styles.roleButton} ${selectedRole === 'mentor' ? styles.active : ''}`}
                onClick={() => handleRoleSelect('mentor')}
              >
                Mentor
              </button>
              <button
                type="button"
                className={`${styles.roleButton} ${selectedRole === 'mentee' ? styles.active : ''}`}
                onClick={() => handleRoleSelect('mentee')}
              >
                Mentee
              </button>
            </div>

            <div className={styles.inputGroup}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.forgotPassword}>
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <p className={styles.signup}>
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;