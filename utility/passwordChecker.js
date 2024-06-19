
const passwordChecker = (password) => {
    // atleast one digit, one lowercase, one uppercase, 8-20 characters
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
    return passwordRegex.test(password);
}

module.exports = passwordChecker;