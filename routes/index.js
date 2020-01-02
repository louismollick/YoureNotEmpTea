const express = require('express');
const router = express.Router();

// User model
const User = require('../models/User');

// @route   GET /
// @desc    Check for token, send to login if not valid
// @access  Public
// router.get('/', (req, res) => {
//     // Verify token
//     User.findById(req.cookies.id)
//         .then(user => {
//             // Verify token
            
//         })
//         .catch(err => res.redirect('/login'));
// });

module.exports = router;