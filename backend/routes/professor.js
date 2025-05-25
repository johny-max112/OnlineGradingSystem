const express = require('express');
const router = express.Router();
const db = require('../db'); // Adjust this path to your DB connection file

// Get all professors
router.get('/', (req, res) => {
  db.query('SELECT * FROM professors', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Add a new professor
router.post('/', (req, res) => {
  const { name, idNumber, course, noOfClass, email } = req.body;
  const sql = 'INSERT INTO professors (name, idNumber, course, noOfClass, email) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name, idNumber, course, noOfClass, email], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ id: result.insertId, name, idNumber, course, noOfClass, email });
  });
});

// Update professor
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, idNumber, course, noOfClass, email } = req.body;
  const sql = 'UPDATE professors SET name = ?, idNumber = ?, course = ?, noOfClass = ?, email = ? WHERE id = ?';
  db.query(sql, [name, idNumber, course, noOfClass, email, id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ id, name, idNumber, course, noOfClass, email });
  });
});

// Delete professor
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM professors WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Professor deleted successfully', id });
  });
});

module.exports = router;