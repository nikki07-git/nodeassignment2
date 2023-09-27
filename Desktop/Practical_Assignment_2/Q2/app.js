const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();

// Configure the session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

// Configure bodyParser to handle POST data
app.use(bodyParser.urlencoded({ extended: true }));

// Simulated user database (replace this with a real database)
const users = [
  { username: 'user1', password: 'password1' },
  { username: 'user2', password: 'password2' }
];

// Middleware to check if a user is logged in
function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
}

// Serve the login form
app.get('/login', (req, res) => {
  res.send(`
    <form method="post" action="/login">
      <input type="text" name="username" placeholder="Username" required>
      <input type="password" name="password" placeholder="Password" required>
      <button type="submit">Login</button>
    </form>
  `);
});

// Handle login form submission
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check if the provided credentials match a user in the database
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    // Store the user in the session
    req.session.user = user;
    return res.redirect('/dashboard');
  }

  // If credentials are invalid, redirect back to the login page
  res.redirect('/login');
});

// Protected route (requires login)
app.get('/dashboard', requireLogin, (req, res) => {
  res.send(`Welcome, ${req.session.user.username}! <a href="/logout">Logout</a>`);
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error(err);
    }
    res.redirect('/login');
  });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
