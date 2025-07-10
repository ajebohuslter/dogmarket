const express = require('express');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'frontend')));

// Serve main HTML page if user visits /
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Load dog data
const dogs = require('./data/dogs.json');

// API route to get all dogs
app.get('/api/dogs', (req, res) => {
  res.json(dogs);
});

// API route to handle purchase form submission with backend validation
app.post('/api/purchase',
  [
    body('name').trim().notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').isMobilePhone().withMessage('Valid phone number is required'),
    body('address').trim().notEmpty().withMessage('Delivery address is required'),
    body('haveKids').isIn(['Yes', 'No']).withMessage('Please select Yes or No for kids'),
    body('dogId').notEmpty().withMessage('Dog ID is required'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // All validation passed
    res.json({
      message: 'Purchase form submitted successfully!',
      data: req.body
    });
  }
);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
