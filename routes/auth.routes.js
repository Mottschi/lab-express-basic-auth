const router = require("express").Router();
const bcrypt = require('bcryptjs');

const User = require('../models/User.model');
const { isLoggedIn, isLoggedOut } = require('../middleware/session-status.js');

router.get('/login', isLoggedOut, (req, res, next)=>{
    res.render('auth/login')
})

router.get('/register', isLoggedOut, (req, res, next)=>{
    res.render('auth/register')
});

router.post('/login', isLoggedOut, async (req, res, next)=>{
    try {
        const {username, password} = req.body;
        const errorMessages = [];

        // Make sure that user filled out all input fields
        if (!username) errorMessages.push('Please enter a username!');
        if (!password) errorMessages.push('Please enter a password!');
        
        // Find user in db
        const user = await User.findOne({username});
        if (user) {
            // check whether password is correct
            const doesPasswordMatch = await bcrypt.compare(password, user.password);
            if (!doesPasswordMatch) errorMessages.push('Password is incorrect!');
        } else {
            errorMessages.push('No user found using this username!');
        };
    
        // if one or more problems were identified with the information that was provided, render the login form again
        // and display a list of all issues that were found with the provided data
        if (errorMessages.length) return res.render('auth/login', {errorMessages});

        // At this point, we have verified that the login can proceed - user with the username was found, and the password was correct
        // to remember user is logged in, we now set the current user for this session to the user matching the login data, then forward user to index
        req.session.currentUser = user;
        res.redirect('/')
    } catch (error) {
        next(error);
    }
})

router.post('/register', isLoggedOut, async (req, res, next)=>{
    try {
        const {username, password, confirmation} = req.body;
        const errorMessages = [];

        // check for empty input fields
        if (!username || !password || !confirmation) errorMessages.push('Please fill out all fields!')

        // check whether username already exists
        const existingUser = await User.findOne({username})
        if (existingUser) errorMessages.push(`The username '${username}' is already in use!`);

        // check whether both password and confirmation are identical
        if (password !== confirmation) errorMessages.push('Password and password confirmation must be identical!')

        if (password.length < 8) errorMessages.push('The password must be at least 8 characters long!')

        // if one or more problems were identified with the information that was provided, render the register form again and
        // display a list of all issues that were found with the provided data
        if (errorMessages.length) return res.render('auth/register', {errorMessages});

        // If we get to this point, everything is in order with the provided data and we can create an account

        // encrypt the password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        const newUser = {
            username,
            password: passwordHash
        }

        await User.create(newUser);
        res.redirect('/login')

    } catch (error) {
        next(error)
    }
});

// Not part of specification, but to make testing more comfortable, implemented a logout as well
router.get('/logout', isLoggedIn, (req, res, next)=>{
    req.session.destroy((error) => {
        if (error) return next(error);
        res.redirect('/login');
    });
});

module.exports = router;