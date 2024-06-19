const validator = require("validator");

const validateRegister = (req, res , next) => {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
        return { message: "Please enter all the fields some are null" };
    }
    if (firstName == "" || lastName == "" || email == "" || password == "") {
        return { message: "Please enter all the fields" };
    } 
    // Check if email is valid
    // only gmail is allowed
    if(!email.endsWith("@gmail.com") ){
        return { message : "Please enter a valid GMAIL" };
    }
    // Check if password is valid
    const mailUsername = email.split("@")[0];
    if(password.includes(mailUsername)){
        return { message: "Password should not contain username" };
    }
    // if(validator.isStrongPassword(password)){
    //     return { message: "Password should contain atleast 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 symbol" };
    // }
    next();    
}

module.exports = validateRegister;