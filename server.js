const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing

const app = express();
const port = 3000;

const pool = mysql.createPool({
    host: 'localhost',
    user: 'My_userr',
    password: 'us3r7w0',
    database: 'mywebapp'
});

// Attempt to connect to the database
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to database successfully!');
        // Release the connection back to the pool
        connection.release();
    }
});

// Listen for errors on the pool
pool.on('error', (err) => {
    console.error('Database pool error:', err);
});

app.use(express.json());
app.use(express.static('public'));

// Logging for server startup
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// Registration logic
app.post('/register', async (req, res) => {
    // Logging request received
    console.log('Received registration request:', req.body);

    const { username, password, role } = req.body;

    let query;
    if (role === 'arbetsgivare' || role === 'arbetsokande') {
        try {
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);
            // Insert the hashed password into the appropriate table based on the role
            query = `INSERT INTO ${role} (username, password) VALUES (?, ?)`;
            // Logging database query
            console.log('Executing query:', query);
            pool.query(query, [username, hashedPassword], (insertErr, results) => {
                if (insertErr) {
                    console.error('Error inserting user:', insertErr);
                    return res.status(500).send('Internal server error');
                }
                res.status(201).send('User registered successfully!');
            });
        } catch (hashError) {
            console.error('Error hashing password:', hashError);
            res.status(500).send('Internal server error');
        }
    } else {
        return res.status(400).send('Invalid role');
    }
});

// Login logic
app.post('/login', async (req, res) => {
    // Logging request received
    console.log('Received login request:', req.body);

    const { username, password, role } = req.body;

    let query;
    if (role === 'arbetsgivare' || role === 'arbetsokande') {
        query = `SELECT * FROM ${role} WHERE username = ?`;
        // Logging database query
        console.log('Executing query:', query);
        pool.query(query, [username], async (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                return res.status(500).send('Internal server error');
            }

            if (results.length > 0) {
                try {
                    const passwordMatch = await bcrypt.compare(password, results[0].password);
                    if (passwordMatch) {
                        res.status(200).send('Login successful!');
                    } else {
                        res.status(401).send('Invalid username or password');
                    }
                } catch (compareError) {
                    console.error('Error comparing passwords:', compareError);
                    res.status(500).send('Internal server error');
                }
            } else {
                res.status(401).send('Invalid username or password');
            }
        });
    } else {
        return res.status(400).send('Invalid role');
    }
});
