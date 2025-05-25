const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Change if needed
  database: 'onlinegradingsystem'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database ✅');
});

// Login Route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    if (results.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ error: 'Server error' });
      if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.json({
        message: 'Login successful',
        token,
        role: user.role
      });
    });
  });
});

// Student Routes
app.get('/api/students', (req, res) => {
  db.query('SELECT * FROM students', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.post('/api/students', (req, res) => {
  const { name, studentNumber, course, section, email } = req.body;
  console.log('Add student request body:', req.body);
  const sql = 'INSERT INTO students (name, studentNumber, course, section, email) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name, studentNumber, course, section, email], (err, result) => {
    if (err) {
      console.error('Error adding student:', err);
      return res.status(500).json({ error: err });
    }
    const newStudent = { id: result.insertId, name, studentNumber, course, section, email };
    console.log('New student inserted:', newStudent);
    res.status(201).json(newStudent);
  });
});

app.put('/api/students/:id', (req, res) => {
  const { id } = req.params;
  const { name, studentNumber, course, section, email } = req.body;
  const sql = 'UPDATE students SET name = ?, studentNumber = ?, course = ?, section = ?, email = ? WHERE id = ?';
  db.query(sql, [name, studentNumber, course, section, email, id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ id, name, studentNumber, course, section, email });
  });
});

app.delete('/api/students/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM students WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Student deleted successfully', id });
  });
});

// Professor Routes
app.get('/api/professors', (req, res) => {
  db.query('SELECT * FROM professors', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.post('/api/professors', (req, res) => {
  const { name, idNumber, course, noOfClass, email } = req.body;
  const sql = 'INSERT INTO professors (name, idNumber, course, noOfClass, email) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name, idNumber, course, noOfClass, email], (err, result) => {
    if (err) {
      console.error('Error inserting professor:', err);
      return res.status(500).json({ error: 'Failed to add professor' });
    }
    res.status(201).json({ message: 'Professor added successfully', id: result.insertId });
  });
});

app.put('/api/professors/:id', (req, res) => {
  const { id } = req.params;
  const { name, idNumber, course, noOfClass, email } = req.body;
  const sql = 'UPDATE professors SET name = ?, idNumber = ?, course = ?, noOfClass = ?, email = ? WHERE id = ?';
  db.query(sql, [name, idNumber, course, noOfClass, email, id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Professor updated successfully', id });
  });
});

app.delete('/api/professors/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM professors WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Professor deleted successfully', id });
  });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});