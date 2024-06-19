const User = require("../models/User"); 

const isAuthor = (req, res, next) => {
    // if the user is a reviewer then call next()
    // else return 403 status code
    const { email, user_id } = req;
    const user = User.findOne({ email: email });
    if (user) {
        next();
    } else {
        res.status(403).send("Forbidden access");
    }
};

module.exports = isReviewer;