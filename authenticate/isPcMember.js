const PcMember = require('../models/PcMember');
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

module.exports = isPcMember;