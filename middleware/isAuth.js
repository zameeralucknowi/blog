const jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWT_SECRET;


// check for login using JWT tokens
exports.isAuth = (req, res, next) => {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "UnAuthorised User" })
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next()

    } catch (error) {
        res.status(401).json({ message: "UnAuthorised User" })
    }

}