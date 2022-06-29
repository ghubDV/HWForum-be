const emails = {
  activationEmailTemplate: function(email, username, code) {
    return {
      from: '"HWForum" <info@hwforum.com>',
      to: email,
      subject: `Your activation code, ${username}`,
      text: 
        `Hey ${username},
         Your activation code is ${code}`,
      html:
        `Hey <b>${username}</b>, <br>
         Your activation code is <b>${code}</b>`
    }
  }
}

module.exports = emails;