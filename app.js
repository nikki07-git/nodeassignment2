const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const Joi = require('joi');
const path = require('path');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost/user-registration', {    //mongodb://localhost:27017/register
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define the User model
const User = mongoose.model('User', {
  username: String,
  email: String,
  password: String,
  profilePictures: [String],
});

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB limit
  },
});

// Middleware for parsing JSON data
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Registration form validation using Joi
const registrationSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'registration.html'));
  });
  
// User registration endpoint
app.post('/register', upload.array('profilePictures', 3), async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate user input
    const { error } = registrationSchema.validate({ username, email, password });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Get the file paths for profile pictures
    const profilePictures = req.files.map((file) => file.path);

    // Create a new user
    const newUser = new User({ username, email, password, profilePictures });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


  

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
