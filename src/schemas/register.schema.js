const Joi = require('joi');

const schema = Joi.object({
  username: 
    Joi.string()
       .alphanum()
       .min(3)
       .max(25)
       .required(),

  email:
    Joi.string()
       .email({ minDomainSegments: 2, tlds: { allow: true } }),

  password: 
    Joi.string()
       .min(8)
       .max(32)
       .pattern(new RegExp('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,32}$')),
  
  confirm_password:
    Joi.ref('password'),
})
.with('password', 'confirm_password');

module.exports = schema;