const emails = {
  activationEmailTemplate: function(email, username, code) {
    return {
      from: '"HWForum" <info@hwforum.com>',
      to: email,
      subject: `Your activation code, ${username}`,
      text: 
        `Hey ${username},
         Your activation code is ${code}
         To activate your account go here ${process.env.HOST}:${process.env.PORT_CLIENT}/activate?code=${code}`,
      html:
        `Hey <b>${username}</b>, <br>
         Your activation code is <b>${code}</b>. <br>
         To activate your account follow this <a href="${process.env.MODE === "production" ? "https://" : "http://"}${process.env.HOST}:${process.env.PORT_CLIENT}/activate?code=${code}"><b>LINK</b></a>`
    }
  },

  resetEmailTemplate: function(email, username, code) {
    return {
      from: '"HWForum" <info@hwforum.com>',
      to: email,
      subject: `Your password reset code, ${username}`,
      text: 
        `Hey ${username},
         Your password reset code is ${code}`,
      html:
        `Hey <b>${username}</b>, <br>
         Your password reset code is <b>${code}</b>`
    }
  }
}

module.exports = emails;