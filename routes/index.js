var express = require('express');
var router = express.Router();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Models
const User = require('../models/User');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register', (req, res, next) => {
	const {username, password} = req.body;
	bcrypt.hash(password, 10).then(function(hash) {
		// Store hash in your password DB.
		const user = new User({
			username,
			password: hash
		});
		user.save().then((data) => {
			res.json(data);
		}).catch((err) => {
			res.json(err);
		})
	});
});

router.post('/authenticate', (req, res) => {
	const {username, password} = req.body;
	User.findOne({
		username
	}, (err, user) => {
		//console.log(user);
		if(err)
			throw err;
		if(!user) {
			res.json({
				status: false,
				message: 'Authentication is failed, user not found'
			})
		} else {
			//res.json('Giriş başarılı')
			bcrypt.compare(password, user.password).then(function(result) {
				//console.log(password, user.password, result)
				if(!result) {
					res.json({
						status: false,
						message: 'Your password is wrong'
					})
				} else {
					// Creating Token
					const payload = {
						username
					}
					const token = jwt.sign(payload, req.app.get('api_secret_key'), {
						expiresIn: 720 // 12 Saat
					})
					res.json({
						status: true,
						token
					})
				}
			});
		}
	});
})

module.exports = router;
