const express = require('express');
const router = express.Router();
const axios = require('axios');
const FormData = require('form-data');

const KEYS = require('./config/keys');

// User model
const User = require('../../models/User');

// @route   GET /login
// @desc    Get login page
// @access  Public
// router.get('/', (req, res) => {
//     // Verify token
//     User.findById(req.cookies.id)
//         .then(user => {
//             if (bcrypt(user.token) equals req.cookies.token){
//                 // When you sign up user, add expire date to database
//                 // Here, we will check if date is past. If it is past,
//                 // Use refresh token to update token.
//                 // Then redirect to /
//         });
// });

// @route   GET /login/:code
// @desc    Create a user
// @access  Public
// router.post('/:code', (req, res) => {

//     // This means you were redirected from discord auth page
//     // So now you have the code, you can make request 
//     // using getToken 
//     // getToken('code', req.params.code)
//     //      .then(res => {})

//     const newUser = new User({
//         id: req.body.id,
//         name: req.body.name,
//         discriminator: req.body.discriminator
//     });
//     newUser.save()
//         .then(user => res.json(user));
// });

function getToken(tokenType, tokenKey){
	// Use same function for authorization code and refresh token (tokenType)
	const data = new FormData();
	data.append('client_id', KEYS.discordId);
	data.append('client_secret', KEYS.discordPass);
	data.append('redirect_uri', 'http://localhost:5000/login');
	data.append('scope', 'identify');
	data.append(tokenType, tokenKey);
	data.append('grant_type', ((tokenType == 'code') ? 'authorization_code' : 'refresh_token'));

	// Use data with : code from authorization redirect OR refresh token, in order to obtain token
    return axios.post('https://discordapp.com/api/oauth2/token', data);
}

module.exports = router;