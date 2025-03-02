const sendMailHelper = require("../../utils/sendMail")
const { Authentication } = require('../../models/index.model');

module.exports = async (email) =>{
  const resetLink = `http://localhost:3000/api/reset_pass?email=${email}`;

  const findEmail = await Authentication.findOne({identifier_email:email})

  if(findEmail){
    const subject ="Link Rest Password"
    const html=`Link rest password là <b>${resetLink}</b>. `

    sendMailHelper.sendMail(email,subject,html)

    return 1
  }else{
    return "Email not find"
  }

}

