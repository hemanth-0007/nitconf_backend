import User from '../models/User.js';


const isAuthor = (req, res, next) => {
    // if the user is a reviewer then call next()
    // else return 403 status code
    const { email, user_id } = req;
    const user = User.findOne({ email: email });
    if(!user) return res.status(403).send({ message: "You are not authorized to perform this action" });
    if(!user.isVerified) return res.status(403).send({ message: "Verify your account" });
    next();
};

export default isAuthor;