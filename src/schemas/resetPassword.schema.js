const Joi = require('joi');

const schema = Joi.object({
  old_password: 
    Joi.string()
       .min(8)
       .max(32)
       .pattern(new RegExp('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,32}$')),

  new_password: 
    Joi.string()
        .min(8)
        .max(32)
        .pattern(new RegExp('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,32}$'))
        .invalid(Joi.ref('old_password')),
  
  confirm_new_password:
    Joi.ref('new_password'),
})
.with('new_password', 'confirm_new_password');

module.exports = schema;