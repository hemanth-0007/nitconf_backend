
const Reviewer = require('../models/Reviewer');

const isReviewer = (req, res, next) => {
    // if the user is a reviewer then call next()
    // else return 403 status code
    const { email, user_id } = req;
    const reviewer = Reviewer.findOne({ email: email });
    if (reviewer) {
        next();
    } else {
        res.status(403).send("Forbidden access");
    }
};

module.exports = isReviewer;