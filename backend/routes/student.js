const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all students
router.get('/', (req, res) => {
    db.query('SELECT * FROM students', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

// Add a new student
router.post('/', (req, res) => {
    const { name, studentNumber, course, section, email } = req.body;
    const sql = 'INSERT INTO students (name, studentNumber, course, section, email) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [name, studentNumber, course, section, email], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        const newStudent = { id: result.insertId, name, studentNumber, course, section, email };
        res.status(201).json(newStudent);
    });
});

// Update a student
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name, studentNumber, course, section, email } = req.body;
    const sql = 'UPDATE students SET name = ?, studentNumber = ?, course = ?, section = ?, email = ? WHERE id = ?';
    db.query(sql, [name, studentNumber, course, section, email, id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ id, name, studentNumber, course, section, email });
    });
});

// Delete a student
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM students WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Student deleted successfully', id });
    });
});

module.exports = router;