// server.js****************************************************************************

// Require the mysql package
const mysql = require('mysql');

// Create a connection to the MySQL database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root123',
    database: 'mysqlnode'
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
    }
    console.log('Connected to database as id ' + connection.threadId);
});

// Perform database operations
connection.query('SELECT * FROM your_table', (err, results) => {
    if (err) {
        console.error('Error executing query: ' + err.stack);
        return;
    }
    console.log('Query results:', results);
});

// Close the database connection (optional)
// connection.end();



// Server-side JavaScript code using Node.js and Express.js ***************************************************'


const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON body
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Route to handle login requests
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Check username and password (example)
    if (username === 'kebu' && password === '111') {
        res.status(200).send('Login successful!');
    } else {
        res.status(401).send('Invalid username or password');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


