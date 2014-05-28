var User = require('../models/User');
var passport = require('../util/passport');
var mongoose = require('mongoose');


/* 
 * GET /user/dashboard
 */

 exports.viewDashboard = function(req, res){
 	if(!req.user){
		return res.redirect('/user/login');
	}
 	res.render('userDashboard', {msg: req.flash('error')});
 }


/* 
 * GET /user/register
 */

exports.viewRegister = function(req, res){
 	res.render('userRegister', { msg: req.flash('error') });
 }

/* 
 * POST /user/register
 */
exports.doRegister = function(req, res){
	User.findOne({username: req.param('username')}, function(err, user) {
		if(user){
			req.flash('error', 'An account with that username already exists!');
			return res.redirect('/user/register');
		}

		user = new User({	username: req.param('username'),
							password: req.param('password')});
		user.save(function (err, docuser){
			if(err){
	    		req.flash('error', err);
	    		return res.redirect('/user/register');
			}

			req.logIn(docuser, function(err){
			    if(err){
			        req.flash('error', 'Your account was created. Please log in.');
			        return res.redirect('/user/login');
			    }

				return res.redirect('/user/dashboard');
			});
		});
	});
}

/* 
 * GET /user/login
 */

exports.viewLogin = function(req, res){
	res.render('userLogin', { msg: req.flash('error') });
}

/* 
 * POST /user/login
 */
 exports.doLogin = passport.authenticate('local', {successRedirect: '/user/dashboard',
        failureRedirect: '/user/login',
        failureFlash: true
    });

 /*
  * GET /user/logout
  */

  exports.doLogout = function(req, res){
  	req.logout();
  	res.redirect('/');
  }