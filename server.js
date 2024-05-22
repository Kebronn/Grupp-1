const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const bcrypt = require('bcrypt');
const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // replace with your MySQL username
    password: 'M9ro07Sq!gG', // replace with your MySQL password
    database: 'sista_base' // replace with your MySQL database name
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database: ' + err.stack);
        return;
    }
    console.log('Connected as id ' + db.threadId);
});

// Route to handle user registration
app.post('/register', async (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
        return res.status(400).send('Please fill in all fields');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the user into the appropriate table based on role
    const query = role === 'arbetare'
        ? 'INSERT INTO arbetarna (username, password, role) VALUES (?, ?, ?)'
        : 'INSERT INTO arbetsokarna (username, password, role) VALUES (?, ?, ?)';

    db.query(query, [username, hashedPassword, role], (err, result) => {
        if (err) {
            console.error('Error inserting user: ' + err.stack);
            return res.status(500).send('Database error');
        }
        res.status(201).send('User registered');
    });
});

// Route to handle login
app.post('/login', (req, res) => {
    const { username, password, role } = req.body;

    console.log('Received login request with username:', username, 'password:', password, 'role:', role);

    if (!username || !password || !role) {
        return res.status(400).send('Please fill in all fields');
    }

    // Query the appropriate table based on role
    const query = role === 'arbetare'
        ? 'SELECT * FROM arbetarna WHERE username = ? AND role = ?'
        : 'SELECT * FROM arbetsokarna WHERE username = ? AND role = ?';

    db.query(query, [username, role], async (err, results) => {
        if (err) {
            console.error('Error executing query: ' + err.stack);
            return res.status(500).send('Database error');
        }

        if (results.length === 0) {
            return res.status(401).send('Invalid credentials');
        }

        const user = results[0];

        // Compare hashed passwords
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).send('Invalid credentials');
        }

        // If password matches, redirect to dashboard
        res.redirect('/dashboard');
    });
});

// Serve the dashboard page
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Serve the login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve static files
app.use(express.static(__dirname));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
