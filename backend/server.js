const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const verifyToken = require('./middleware/auth');
const nodemailer = require('nodemailer');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Schemas
const userSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  branch: String,
  section: String,
  registrationNumber: String,
  password: String,
  role: String
});

const Mentor = mongoose.model('Mentor', userSchema, 'mentors');
const Mentee = mongoose.model('Mentee', userSchema);

// Add JWT secret to environment variables or use a default one
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Add detailed email configuration with error handling
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  debug: true, // Enable debug logs
  logger: true // Enable logger
});

// Verify email configuration on server start
transporter.verify(function(error, success) {
  if (error) {
    console.error('Email configuration error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Signup endpoint
app.post('/api/signup', async (req, res) => {
  try {
    const { fullName, email, branch, section, registrationNumber, password, role } = req.body;
    
    // Validate required fields
    if (!fullName || !email || !branch || !section || !registrationNumber || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate role
    if (role !== 'mentor' && role !== 'mentee') {
      return res.status(400).json({ message: 'Invalid role specified' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user object
    const userData = {
      fullName,
      email,
      branch,
      section,
      registrationNumber,
      password: hashedPassword,
      role
    };

    // Save to appropriate collection based on role
    const UserModel = role === 'mentor' ? Mentor : Mentee;
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const newUser = new UserModel(userData);
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    // Send more specific error message
    const errorMessage = error.code === 11000 
      ? 'Email already exists'
      : 'Error creating user: ' + error.message;
    res.status(500).json({ message: errorMessage });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Add detailed debug logging
    console.log('Login attempt details:', {
      email,
      role,
      hasPassword: !!password
    });

    // Validate required fields
    if (!email || !password || !role) {
      console.log('Missing required fields:', { email: !!email, password: !!password, role: !!role });
      return res.status(400).json({ message: 'Email, password, and role are required' });
    }

    // Validate role
    if (role !== 'mentor' && role !== 'mentee') {
      console.log('Invalid role provided:', role);
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    // Select the appropriate model based on role
    const UserModel = role === 'mentor' ? Mentor : Mentee;

    // Find user by email only first to debug
    const user = await UserModel.findOne({ email });
    console.log('User found in database:', !!user);
    
    if (!user) {
      console.log('User not found with email:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Log user details (excluding sensitive info)
    console.log('Found user details:', {
      id: user._id,
      email: user.email,
      role: user.role,
      hasStoredPassword: !!user.password
    });

    // Compare password
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('Password validation result:', isValidPassword);

    if (!isValidPassword) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
        fullName: user.fullName
      }, 
      JWT_SECRET,  // Using the defined JWT_SECRET instead of process.env directly
      { 
        expiresIn: '24h',
        algorithm: 'HS256'
      }
    );

    // Send successful response
    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error details:', {
      message: error.message,
      stack: error.stack
    });
    return res.status(500).json({ 
      message: 'Server error during login',
      error: error.message 
    });
  }
});

// Protected route example
app.get('/api/protected-route', verifyToken, (req, res) => {
  res.json({ 
    message: 'Protected data', 
    user: req.user 
  });
});

// Get all mentors endpoint
app.get('/api/mentors', async (req, res) => {
  try {
    const mentors = await Mentor.find({}, {
      password: 0,
      __v: 0
    });
    
    console.log('Mentors found:', mentors.length); // Debug log
    
    // Ensure proper JSON response
    return res.status(200).json(mentors);
  } catch (error) {
    console.error('Error fetching mentors:', error);
    return res.status(500).json({ 
      message: 'Error fetching mentors',
      error: error.message 
    });
  }
});

// Modify the existing send-query endpoint or add a new one
app.post('/api/send-query', verifyToken, async (req, res) => {
  try {
    const { mentorEmail, query } = req.body;
    
    // Validate inputs
    if (!mentorEmail || !query) {
      return res.status(400).json({ message: 'Mentor email and query are required' });
    }

    console.log('Attempting to send email with config:', {
      from: process.env.EMAIL_USER,
      to: mentorEmail,
      senderName: req.user.fullName,
      senderEmail: req.user.email
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: mentorEmail,
      subject: `New Query from ${req.user.fullName}`,
      html: `
        <h3>New Query from Mentorlink</h3>
        <p><strong>From:</strong> ${req.user.fullName} (${req.user.email})</p>
        <p><strong>Query:</strong></p>
        <p>${query}</p>
        <br>
        <p>You can reply directly to this email to respond to the mentee.</p>
      `
    };

    // Send email with Promise
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info);

    res.status(200).json({ 
      message: 'Query sent successfully',
      messageId: info.messageId 
    });
  } catch (error) {
    console.error('Detailed email error:', {
      error: error.message,
      stack: error.stack,
      code: error.code,
      command: error.command
    });
    res.status(500).json({ 
      message: 'Failed to send query', 
      error: error.message,
      details: error.code 
    });
  }
});

// Add Review Schema with explicit collection name
const reviewSchema = new mongoose.Schema({
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor' },
  reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentee' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Review = mongoose.model('Review', reviewSchema, 'reviews'); // Explicitly specify collection name

// Modified review submission endpoint
app.post('/api/reviews', verifyToken, async (req, res) => {
  try {
    const { mentorId, rating, description } = req.body;
    
    console.log('Review submission attempt:', {
      mentorId,
      rating,
      description,
      reviewerId: req.user?.userId,
      userDetails: req.user // Log full user details
    });

    // Validate all required fields
    if (!mentorId || rating === undefined || !description) {
      console.log('Missing required fields:', { mentorId, rating, description });
      return res.status(400).json({ 
        message: 'All fields are required',
        received: { mentorId, rating, description }
      });
    }

    // Validate rating is a number between 1 and 5
    const numericRating = Number(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      console.log('Invalid rating value:', rating);
      return res.status(400).json({ 
        message: 'Rating must be a number between 1 and 5',
        received: rating
      });
    }

    // Validate mentorId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(mentorId)) {
      console.log('Invalid mentorId:', mentorId);
      return res.status(400).json({ 
        message: 'Invalid mentor ID format',
        received: mentorId
      });
    }

    // Check if mentor exists
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      console.log('Mentor not found:', mentorId);
      return res.status(404).json({ message: 'Mentor not found' });
    }

    // Create and save the review with additional logging
    const reviewData = {
      mentorId,
      reviewerId: req.user.userId,
      rating: numericRating,
      description: description.trim()
    };
    
    console.log('Attempting to save review with data:', reviewData);
    
    const review = new Review(reviewData);
    const savedReview = await review.save();
    
    console.log('Review saved successfully:', {
      id: savedReview._id,
      collection: savedReview.collection.name,
      document: savedReview.toObject()
    });

    res.status(201).json({ 
      message: 'Review submitted successfully', 
      review: savedReview 
    });

  } catch (error) {
    console.error('Review submission error:', {
      error: error.message,
      stack: error.stack
    });
    
    // Send appropriate error response
    res.status(500).json({ 
      message: 'Error submitting review', 
      error: error.message 
    });
  }
});

// Modified review fetching endpoint with additional logging
app.get('/api/reviews/:mentorId', async (req, res) => {
  try {
    console.log('Fetching reviews for mentorId:', req.params.mentorId);
    
    const reviews = await Review.find({ mentorId: req.params.mentorId })
      .populate('reviewerId', 'fullName')
      .sort({ createdAt: -1 });
    
    console.log(`Found ${reviews.length} reviews:`, reviews);
    
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
});

// Add Request Schema
const requestSchema = new mongoose.Schema({
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor' },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentee' },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  doubt: { type: String, required: true },
  studentNumber: { type: String, required: true },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const Request = mongoose.model('Request', requestSchema, 'requests');

// Add mentee requests endpoint
app.get('/api/mentee/requests', verifyToken, async (req, res) => {
  try {
    const requests = await Request.find({ studentId: req.user.userId })
      .populate('mentorId', 'fullName email branch')
      .sort({ createdAt: -1 });
    
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching mentee requests:', error);
    res.status(500).json({ message: 'Error fetching requests', error: error.message });
  }
});

// Add mentor requests endpoint
app.get('/api/mentor/requests', verifyToken, async (req, res) => {
  try {
    const requests = await Request.find({ mentorId: req.user.userId })
      .populate('studentId', 'fullName email registrationNumber')
      .sort({ createdAt: -1 });
    
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching mentor requests:', error);
    res.status(500).json({ message: 'Error fetching requests', error: error.message });
  }
});

// Handle request actions (accept/reject)
app.put('/api/requests/:requestId/:action', verifyToken, async (req, res) => {
  try {
    const { requestId, action } = req.params;
    
    if (!['accept', 'reject'].includes(action)) {
      return res.status(400).json({ message: 'Invalid action' });
    }
    
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    // Verify the mentor owns this request
    if (request.mentorId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    request.status = action === 'accept' ? 'accepted' : 'rejected';
    await request.save();
    
    res.status(200).json({ message: `Request ${action}ed successfully`, request });
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({ message: 'Error updating request', error: error.message });
  }
});

// Add request submission endpoint
app.post('/api/requests', verifyToken, async (req, res) => {
  try {
    const { mentorId, mentorEmail, date, time, doubt, studentNumber } = req.body;
    
    console.log('Request submission attempt:', {
      mentorId,
      mentorEmail,
      date,
      time,
      doubt,
      studentNumber,
      studentId: req.user?.userId
    });

    // Validate required fields
    if (!mentorId || !date || !time || !doubt || !studentNumber) {
      return res.status(400).json({ 
        message: 'All fields are required',
        received: { mentorId, date, time, doubt, studentNumber }
      });
    }

    // Validate mentorId
    if (!mongoose.Types.ObjectId.isValid(mentorId)) {
      return res.status(400).json({ message: 'Invalid mentor ID format' });
    }

    // Check if mentor exists
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    // Create and save the request
    const requestData = {
      mentorId,
      studentId: req.user.userId,
      date,
      time,
      doubt,
      studentNumber
    };
    
    const request = new Request(requestData);
    const savedRequest = await request.save();

    // Format date for email
    const formattedDate = new Date(date).toLocaleDateString();

    // Send email to mentor with improved error handling
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: mentor.email, // Use mentor's email from database
        subject: `New Mentoring Request from ${req.user.fullName}`,
        html: `
          <h3>New Mentoring Request from Mentorlink</h3>
          <p><strong>From:</strong> ${req.user.fullName} (${req.user.email})</p>
          <p><strong>Student Number:</strong> ${studentNumber}</p>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Time:</strong> ${time}</p>
          <p><strong>Doubt/Topic:</strong></p>
          <p>${doubt}</p>
          <br>
          <p>You can reply directly to this email to respond to the mentee.</p>
        `
      };

      console.log('Attempting to send email:', {
        to: mentor.email,
        from: process.env.EMAIL_USER
      });

      const emailResult = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', emailResult);

    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // Continue with the request save even if email fails
    }

    res.status(201).json({ 
      message: 'Request submitted successfully', 
      request: savedRequest 
    });

  } catch (error) {
    console.error('Request submission error:', error);
    res.status(500).json({ 
      message: 'Error submitting request', 
      error: error.message 
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
