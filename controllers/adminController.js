const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const adminLayout = '../views/layouts/admin' // directory to be used for admin layout
const jwtSecret = process.env.JWT_SECRET;
const signLayout = '../views/layouts/signup'



exports.getSignup = (req, res, next) => {
    res.render('signup', { layout: signLayout })
}

exports.postRegister = async(req, res, next) => {

    try {

        const email = req.body.email;
        const password = req.body.password;

        const hashPassword = await bcrypt.hash(password, 10);

        try {

            const user = await User.create({ email: email, password: hashPassword })
            res.redirect('/login');

        } catch (error) {

            if (error.code === 11000) {
                res.status(409).json({ message: "User already in use" })
            }

            res.status(500).json({ message: "Internal server errror" })

        }




    } catch (error) {
        console.log(error)
    }


}



exports.getLogin = (req, res, next) => {

    try {

        let locals = {
            title: "Login",
            description: " blog website built using node.js express and mongoDb"
        }

        res.render('login', { locals, layout: signLayout })

    } catch (error) {
        console.log(error)
    }
}

exports.postLogin = async(req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ email: email });

    if (!user) {
        return res.status(401).json({ message: "Invalid Email or Password" })
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid Email or Password" })
    }

    req.session.user = user;

    // provide seesion for loginned user using jwt
    const token = jwt.sign({ userId: user._id }, jwtSecret)

    res.cookie('token', token, { httpOnly: true })

    res.redirect('/dashboard');



}

exports.getLogOut = (req, res, next) => {
    req.session.destroy();
    res.clearCookie('token');
    res.redirect('/');
}