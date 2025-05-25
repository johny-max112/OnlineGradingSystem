const express = require('express');
const router = express.Router();
const db = require('../db'); // adjust path if needed

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = `SELECT * FROM users WHERE email = ? AND password = ? AND role = 'professor'`;
  db.query(query, [email, password], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Server error' });

    if (results.length > 0) {
      const professor = results[0];
      res.json({ success: true, professor: { id: professor.id, name: professor.name, email: professor.email } });
    } else {
      res.json({ success: false, message: 'Invalid credentials or role' });
    }
  });
});

module.exports = router;