import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/findmentor.module.css';

const FindMentor = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [query, setQuery] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewMode, setReviewMode] = useState(''); // 'show' or 'give'
  const [rating, setRating] = useState(5);
  const [reviewDescription, setReviewDescription] = useState('');
  const [mentorReviews, setMentorReviews] = useState([]);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestDate, setRequestDate] = useState('');
  const [requestTime, setRequestTime] = useState('');
  const [requestDoubt, setRequestDoubt] = useState('');
  const [requestStudentNumber, setRequestStudentNumber] = useState('');

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8001'; // Make sure this matches your backend port
      console.log('Fetching mentors from:', `${baseUrl}/api/mentors`);
      
      const response = await fetch(`${baseUrl}/api/mentors`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      // Log the response status and URL for debugging
      console.log('Response status:', response.status);
      console.log('Response URL:', response.url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched mentors:', data);

      setMentors(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching mentors:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleAskQuery = (mentor) => {
    setSelectedMentor(mentor);
    setShowModal(true);
  };

  const handleSubmitQuery = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login first to send a query');
        return;
      }

      // Add console logs to verify mentor data
      console.log('Selected Mentor:', selectedMentor);
      console.log('Mentor Email:', selectedMentor.email);
      console.log('Query:', query);

      const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8001'; // Make sure this matches your backend port
      console.log('Sending request to:', `${baseUrl}/api/send-query`);

      const response = await fetch(`${baseUrl}/api/send-query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          mentorEmail: selectedMentor.email,
          query: query
        })
      });

      const data = await response.json();
      console.log('Response from server:', data);

      if (response.ok) {
        alert('Query sent successfully to ' + selectedMentor.fullName);
        setShowModal(false);
        setQuery('');
      } else {
        throw new Error(data.message || 'Failed to send query');
      }
    } catch (err) {
      console.error('Error sending query:', err);
      alert(err.message || 'Failed to send query. Please try again.');
    }
  };

  const handleReviewClick = (mentor) => {
    setSelectedMentor(mentor);
    setShowReviewModal(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login first to submit a review');
        return;
      }

      const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8001';
      const response = await fetch(`${baseUrl}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          mentorId: selectedMentor._id,
          rating,
          description: reviewDescription
        })
      });

      const data = await response.json();
      if (response.ok) {
        alert('Review submitted successfully');
        setReviewMode('');
        setRating(5);
        setReviewDescription('');
      } else {
        throw new Error(data.message || 'Failed to submit review');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      alert(err.message || 'Failed to submit review');
    }
  };

  const fetchReviews = async (mentorId) => {
    try {
      const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8001';
      const response = await fetch(`${baseUrl}/api/reviews/${mentorId}`);
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error fetching reviews:', err);
      return [];
    }
  };

  const handleReviewOption = async (mode) => {
    setReviewMode(mode);
    if (mode === 'show' && selectedMentor) {
      const reviews = await fetchReviews(selectedMentor._id);
      setMentorReviews(reviews);
    }
  };

  const handleMakeRequest = (mentor) => {
    setSelectedMentor(mentor);
    setShowRequestModal(true);
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login first to make a request');
        return;
      }

      // Format the date to ISO string for consistency
      const formattedDate = new Date(requestDate).toISOString();

      // Add console logs for debugging
      console.log('Selected Mentor:', selectedMentor);
      console.log('Request Data:', {
        mentorId: selectedMentor._id,
        mentorEmail: selectedMentor.email,
        date: formattedDate,
        time: requestTime,
        doubt: requestDoubt,
        studentNumber: requestStudentNumber
      });

      const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8001';
      const response = await fetch(`${baseUrl}/api/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          mentorId: selectedMentor._id,
          mentorEmail: selectedMentor.email, // Add mentor's email to the request
          date: formattedDate,
          time: requestTime,
          doubt: requestDoubt,
          studentNumber: requestStudentNumber
        })
      });

      // Log the response for debugging
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        alert('Request sent successfully to ' + selectedMentor.fullName);
        setShowRequestModal(false);
        setRequestDate('');
        setRequestTime('');
        setRequestDoubt('');
        setRequestStudentNumber('');
      } else {
        throw new Error(data.message || 'Failed to send request');
      }
    } catch (err) {
      console.error('Error sending request:', err);
      alert('Failed to send request. Please check if you are logged in and try again.');
    }
  };

  // Add this new function to filter mentors
  const filteredMentors = mentors.filter((mentor) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      mentor.fullName.toLowerCase().includes(searchLower) ||
      mentor.email.toLowerCase().includes(searchLower) ||
      mentor.branch.toLowerCase().includes(searchLower) ||
      mentor.section.toLowerCase().includes(searchLower) ||
      mentor.registrationNumber.toString().toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className={styles.container}>
      <header>
        <div className={styles.navbar}>
          <div className={styles.logo}>
            <img src="https://cdn-icons-png.flaticon.com/512/9228/9228765.png" alt="Logo" />
            Mentorlink
          </div>
          <nav>
            <ul className={styles.navList}>
              <li><Link to="/" className={styles.navLink}>Home</Link></li>
              <li><Link to="/aichat" className={styles.navLink}>AI Assistant</Link></li>
              <li><Link to="/find-mentor" className={styles.navLink}>Find Mentors</Link></li>
              <li><Link to="#" className={styles.navLink}>Contact Us</Link></li>
              <li><Link to="/about" className={styles.navLink}>About Us</Link></li>
            </ul>
          </nav>
          <div className={styles.navButtons}>
            <Link to="/signup" className={styles.btn}>Sign Up</Link>
            <Link to="/login" className={`${styles.btn} ${styles.loginBtn}`}>Login</Link>
          </div>
        </div>
      </header>

      <div className={styles.searchSection}>
        <h1>Find Your Perfect Mentor</h1>
        <p>Connect with experienced mentors in your field</p>
        
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search mentors by skills, industry, or expertise..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          <button className={styles.searchButton}>
            <i className="fas fa-search"></i>
            Search
          </button>
        </div>
      </div>

      <div className={styles.mentorsGrid}>
        {loading ? (
          <p>Loading mentors...</p>
        ) : error ? (
          <p className={styles.errorMessage}>Error: {error}</p>
        ) : filteredMentors.length === 0 ? (
          <p className={styles.noMentors}>No mentors found matching your search criteria.</p>
        ) : (
          filteredMentors.map((mentor) => (
            <div key={mentor._id} className={styles.card}>
              <h2>{mentor.fullName}</h2>
              <p>Email: {mentor.email}</p>
              <p>Branch: {mentor.branch}</p>
              <p>Section: {mentor.section}</p>
              <p>Registration Number: {mentor.registrationNumber}</p>
              <div className={styles.cardButtons}>
                <button 
                  className={styles.actionButton}
                  onClick={() => handleMakeRequest(mentor)}
                >
                  Make Request
                </button>
                <button 
                  className={styles.actionButton}
                  onClick={() => handleAskQuery(mentor)}
                >
                  Ask Query
                </button>
                <button 
                  className={styles.actionButton}
                  onClick={() => handleReviewClick(mentor)}
                >
                  Reviews
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Ask Query to {selectedMentor?.fullName}</h2>
            <form onSubmit={handleSubmitQuery}>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type your query here..."
                className={styles.queryTextarea}
                rows="4"
              />
              <div className={styles.modalButtons}>
                <button type="submit" className={styles.submitButton}>
                  Send Query
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showReviewModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Reviews for {selectedMentor?.fullName}</h2>
            {!reviewMode ? (
              <div className={styles.modalButtons}>
                <button
                  onClick={() => handleReviewOption('show')}
                  className={styles.actionButton}
                >
                  Show Reviews
                </button>
                <button
                  onClick={() => handleReviewOption('give')}
                  className={styles.actionButton}
                >
                  Give Review
                </button>
                <button
                  onClick={() => {
                    setShowReviewModal(false);
                    setReviewMode('');
                  }}
                  className={styles.cancelButton}
                >
                  Close
                </button>
              </div>
            ) : (
              <div>
                {reviewMode === 'show' ? (
                  <div className={styles.reviewsList}>
                    {mentorReviews?.length > 0 ? (
                      mentorReviews.map((review, index) => (
                        <div key={index} className={styles.reviewItem}>
                          <div className={styles.stars}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={star <= review.rating ? styles.starFilled : styles.starEmpty}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <p>{review.description}</p>
                          <small>By: {review.reviewerId?.fullName || 'Anonymous'}</small>
                        </div>
                      ))
                    ) : (
                      <form onSubmit={handleSubmitReview} className={styles.reviewForm}>
                        <div className={styles.ratingContainer}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              onClick={() => setRating(star)}
                              onMouseEnter={() => setRating(star)}
                              className={star <= rating ? styles.starFilled : styles.starEmpty}
                              style={{ cursor: 'pointer', fontSize: '24px' }}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <textarea
                          value={reviewDescription}
                          onChange={(e) => setReviewDescription(e.target.value)}
                          placeholder="Write your review here..."
                          className={styles.reviewTextarea}
                          rows="4"
                          required
                        />
                        <div className={styles.modalButtons}>
                          <button type="submit" className={styles.submitButton}>
                            Submit Review
                          </button>
                          <button
                            type="button"
                            onClick={() => setReviewMode('')}
                            className={styles.cancelButton}
                          >
                            Back
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleSubmitReview} className={styles.reviewForm}>
                    <div className={styles.ratingContainer}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setRating(star)}
                          className={star <= rating ? styles.starFilled : styles.starEmpty}
                          style={{ cursor: 'pointer', fontSize: '24px' }}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <textarea
                      value={reviewDescription}
                      onChange={(e) => setReviewDescription(e.target.value)}
                      placeholder="Write your review here..."
                      className={styles.reviewTextarea}
                      rows="4"
                      required
                    />
                    <div className={styles.modalButtons}>
                      <button type="submit" className={styles.submitButton}>
                        Submit Review
                      </button>
                      <button
                        type="button"
                        onClick={() => setReviewMode('')}
                        className={styles.cancelButton}
                      >
                        Back
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {showRequestModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Make Request to {selectedMentor?.fullName}</h2>
            <form onSubmit={handleSubmitRequest}>
              <div className={styles.formGroup}>
                <label>Date:</label>
                <input
                  type="date"
                  value={requestDate}
                  onChange={(e) => setRequestDate(e.target.value)}
                  required
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Time:</label>
                <input
                  type="time"
                  value={requestTime}
                  onChange={(e) => setRequestTime(e.target.value)}
                  required
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Student Number:</label>
                <input
                  type="text"
                  value={requestStudentNumber}
                  onChange={(e) => setRequestStudentNumber(e.target.value)}
                  placeholder="Enter your student number"
                  required
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Doubt/Topic:</label>
                <textarea
                  value={requestDoubt}
                  onChange={(e) => setRequestDoubt(e.target.value)}
                  placeholder="Describe your doubt or topic..."
                  required
                  className={styles.formTextarea}
                  rows="4"
                />
              </div>
              <div className={styles.modalButtons}>
                <button type="submit" className={styles.submitButton}>
                  Send Request
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowRequestModal(false);
                    setRequestDate('');
                    setRequestTime('');
                    setRequestDoubt('');
                    setRequestStudentNumber('');
                  }}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindMentor;
