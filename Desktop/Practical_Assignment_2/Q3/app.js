const express = require('express');
const session = require('express-session');
const Redis = require('redis');
const redisStore = require('connect-redis');

const app = express();

// Configure Redis client
const redisClient = Redis.createClient({
  host: 'localhost', // Replace with your Redis server host
  port: 6379,        // Replace with your Redis server port
});

// Create a RedisStore instance
const RedisSessionStore = redisStore(session);

// Configure the session middleware with Redis store
app.use(session({
  store: new RedisSessionStore({ client: redisClient }),
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Simulated user database (replace with a real database)
const users = [
  { id: 1, username: 'user1', password: 'password1' },
  { id: 2, username: 'user2', password: 'password2' },
];

// API endpoint to check if a user is logged in
app.get('/api/check-login', (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

// API endpoint for user login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // Simulate authentication (replace with your authentication logic)
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    req.session.user = user;
    res.json({ loggedIn: true, user });
  } else {
    res.json({ loggedIn: false, error: 'Invalid credentials' });
  }
});

// API endpoint for user logout
app.post('/api/logout', (req, res) => {
  if (req.session.user) {
    req.session.destroy(err => {
      if (err) {
        console.error(err);
        res.json({ success: false, error: 'Logout failed' });
      } else {
        res.json({ success: true });
      }
    });
  } else {
    res.json({ success: false, error: 'Not logged in' });
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
