const express = require('express');
const router = express.Router();
const FormData = require('form-data');
const fetch = require('node-fetch');
const bcrypt = require('bcryptjs');

// User model
const User = require('../models/User');

// @route   POST login
// @desc    Login or create a user
// @access  Public
router.post('/login', (req, res) => {
	const { token } = req.body;
	if(!token){
		res.end({
			success: false,
			message: 'Error: Missing token'
		});
	}
	handleToken(req, res, token)
		.catch(err =>{
			res.send({
				success: false,
				message: err
			});
		});
});

async function handleToken(req, res, token){
	// Use token to get user info
	const fetchinfo = await fetch('https://discordapp.com/api/users/@me', {
		headers: { Authorization: `Bearer ${token}` },
	});
	const result_json = await fetchinfo.json();
	console.log("INFO: ", result_json);
	
	const { id, username, discriminator, avatar } = result_json;
	if (!id || !username || !discriminator || !avatar) throw "Error: Invalid Token";
	const update = {
		id,
		username,
		discriminator,
		avatar,
		token
	};

	// Encrypt token
	bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(update.token, salt, (err, hash) => {
			if(err) throw err;
			// Update existing user info or create new ( -> upsert: true)
			User.findOneAndUpdate({ id: result_json.id }, { ...update, token : hash }, { new: true, upsert: true })
			.then(user => {
				// Add more info to return to client
				res.send({
					success: true,
					message: "Updated or created an account",
					user: update
				});
			});
		});
	});
}

// @route   POST token/:code
// @desc    Obtain token using query code from discord redirect
// @access  Public
router.post('/token', (req, res) => {
	const { method, code } = req.body;
	if (method !== 'code' && method !== 'refresh_token'){
		res.send({
			success: false,
			message: 'Error: Invalid or missing token request method'
		});
	}
	if (!code){
		res.send({
			success: false,
			message: 'Error: Missing code'
		});
	}

	//Make request for token
	queryToken(method, code)
		.then(token => token.json())
		.then(token =>{
			if(token.error) throw token.error_description;
			// Send to client who saves it in local storage
			res.send({
				success: true,
				expires: token.expires,
				token: token.access_token,
				refresh_token : token.refresh_token
			});
		})
		.catch(err =>{
			res.send({
				success: false,
				message: err
			});
		});
});

function queryToken(tokenType, tokenKey){
	// Use same function for authorization code and refresh token (tokenType)
	const data = new FormData();
	data.append('client_id', process.env.DISCORD_ID);
	data.append('client_secret', process.env.DISCORD_PASS);
	data.append('redirect_uri', process.env.CLIENT_URI);
	data.append('scope', 'identify');
	data.append(tokenType, tokenKey);
	data.append('grant_type', (tokenType === 'code') ? 'authorization_code' : 'refresh_token');

	// Use data with : code from authorization redirect OR refresh token, in order to obtain token
	return fetch('https://discordapp.com/api/oauth2/token', { method: 'POST', body: data });
}

module.exports = router;