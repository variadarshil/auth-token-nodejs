const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const { registerValidation, loginValidation } = require('../validation')

//Register
router.post('/register', async(req, res) => {
    //validate data before saving it to db
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    //Checking if user is already in db
    const emailExist = await User.findOne({email: req.body.email})
    
    if(emailExist) return res.status(400).send('Email already exists');

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });

    try {
        const savedUser = await user.save();
        res.send({ user: user._id });
    } catch (err) {
        res.status(400).send(err);
    }
});

//Login
router.post('/login', async(req, res) => {
    //validate data before saving it to db
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Checking if user is already in db
    const user = await User.findOne({ email: req.body.email }) 
    if(!user) return res.status(400).send('Email does not exists');
    //Password check
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Invalid password');
    
    //Create jwt token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET_KEY)
    res.header('auth-token', token).send(token);
})
module.exports = router;