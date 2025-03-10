import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/login.module.css';
import { useState } from 'react';

const Login = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('mentor');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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
      const response = await fetch(`${API_URL}/api/login`, {
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
        // Store token and user data in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect to dashboard or home page
        navigate('/');
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
