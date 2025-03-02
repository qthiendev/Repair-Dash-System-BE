const nodeMailer = require("nodemailer")
require('dotenv').config();

module.exports.sendMail = (email,subject,html) =>{
    const transporter = nodeMailer.createTransport({
        service:'gmail',
        auth:{
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    })

    const mailOption = {
        from:process.env.MAIL_USER,
        to:email,
        subject:subject,
        html:html
    }

    transporter.sendMail(mailOption,function(error,info){
        if(error){
            console.log(error)
        }else{
            console.log('Email sent: ' + info.response)
        }
    })
}
