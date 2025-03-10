import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/signup.module.css';
import signupImage from '../assets/signup.jpg';
import { useState } from 'react';

const SignUp = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('mentor');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    branch: '',
    section: '',
    registrationNumber: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/signup', {
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
        navigate('/login');
      } else {
        alert(data.message || 'Signup failed');
      }
    } catch (error) {
      alert('Error during signup. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {/* Left Section with Illustration */}
        <div className={styles.left}>
          <img 
            src={signupImage} 
            alt="Mentor Connect Illustration" 
          />
        </div>

        {/* Right Section with Sign-Up Form */}
        <div className={styles.right}>
          <div className={styles.header}>
            <h2>Welcome to Mentor Connect</h2>
            <p>Join our community of mentors and mentees today</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Role Selector */}
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
                type="text"
                name="fullName"
                placeholder="Full name"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="branch"
                placeholder="Branch (e.g., Computer Science)"
                value={formData.branch}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="section"
                placeholder="Section"
                value={formData.section}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="registrationNumber"
                placeholder="Registration number"
                value={formData.registrationNumber}
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
              <input
                type="password"
                name="confirmPassword"
                placeholder="Re-type Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.checkbox}>
              <input
                type="checkbox"
                id="terms"
                name="terms"
                required
              />
              <label htmlFor="terms">
                I agree to the <a href="#">Terms and Conditions</a> and{' '}
                <a href="#">Privacy Policy</a>
              </label>
            </div>

            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>

          <p className={styles.login}>
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
