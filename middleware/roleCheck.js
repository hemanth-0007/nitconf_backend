import PcMember from '../models/PcMember.js';
import User from '../models/User.js';
import Reviewer from "../models/Reviewer.js";
import Admin from "../models/Admin.js";


const isAuthor = (req, res, next) => {
    // if the user is a reviewer then call next()
    // else return 403 status code
    const { email, user_id } = req;
    const user = User.findOne({ email: email });
    if(!user) return res.status(403).send({ message: "You are not authorized to perform this action" });
    if(!user.isVerified) return res.status(403).send({ message: "Verify your account" });
    next();
};


// its a middleware to check if the user is a pc member or not
// will receive the request {}
const isPcMember = (req, res, next) => {
    // if the user is a pc member then call next()
    // else return 403 status code
    const {email, user_id} = req;
    const pc_member  = PcMember.findOne({email: email});
    if(pc_member){
        next();
    }
    else{
        res.status(403).send("Forbidden access");
    }
};

const isReviewer = (req, res, next) => {
    // if the user is a reviewer then call next()
    // else return 403 status code
    const { email, user_id } = req;
    const reviewer = Reviewer.findOne({ email: email });
    if (reviewer) {
        next();
    } 
    else {
        res.status(403).send({message : "Forbidden access"});
    }
};

const isVerified = (req, res, next) => {
    const { email } = req;
    try {
        const user = User.findOne({ email: email });
        if(!user) return res.status(403).send({ message: "You are not authorized to perform this action" });
        if(user.isVerified === false) return res.status(403).send({ message: "Verify your account" });    
        next();
    } catch (error) {
        return res.status(500).json({ message: error.message});
    }
}


const isAdmin = (req, res, next) => {
    // if the user is a admin then call next()
    // else return 403 status code
    const { email, user_id } = req;
    const admin = Admin.findOne({ email: email });
    if(admin){
        next();
    }
    else
        res.status(403).send("Forbidden access");
    
}
export { isAuthor, isPcMember, isReviewer, isVerified, isAdmin };