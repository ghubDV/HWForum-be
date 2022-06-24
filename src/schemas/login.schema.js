const Joi = require('joi');

const schema = Joi.object({
  username: 
    Joi.string()
       .alphanum()
       .min(3)
       .max(25)
       .required(),
  password: 
    Joi.string()
       .min(8)
       .max(32)
       .pattern(new RegExp('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,32}$')),
  
})

module.exports = schema;