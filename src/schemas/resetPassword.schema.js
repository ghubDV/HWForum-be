const Joi = require('joi');

const schema = Joi.object({
  password: 
    Joi.string()
       .required()
       .pattern(new RegExp('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,32}$'))
       .messages({
          'string.pattern.base': 
            `Password requirements:\n1.Password must be between 8-32 characters\n2.Password must contain uppercase and lowercase letters`,
          'string.empty': 'Password cannot be empty!'
        }),
  
  confirm_password:
    Joi
    .any()
    .valid(Joi.ref('password'))
    .messages({
      'any.only': 'Passwords must match'
    }),
})
.with('password', 'confirm_password');

module.exports = schema;