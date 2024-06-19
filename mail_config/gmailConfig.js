const nodemailer = require('nodemailer');
require('dotenv').config();
 


// Create a transporter
let transporter = nodemailer.createTransport({
    service: 'Gmail', // You can use any email service provider
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Mail options
//  takes parameters for the email sender, recipient, subject, and text
//  The text parameter is the content of the email
const sendMail = async (to, subject, text) => {
    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        text: text,
        html: `<h1>Login OTP Verification</h1>
                <p>${text}</p>
                `, // html body
    };
    
    // Send email
    try {
        let info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.response}`);
    } catch (error) {
        console.log(`Error: ${error}`);
    }
}
// sendMail("hs075185@gmail.com", "Hello", "Hello world");


module.exports = sendMail;
 