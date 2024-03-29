const jwt = require('jsonwebtoken');

function authVerify(req, res, next) {
    const token = req.header('auth-token');
    if(!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
        req.user = verified;
        next();
    } catch {
        res.status(400).send('Invalid Token');
    }
}

module.exports = authVerify;