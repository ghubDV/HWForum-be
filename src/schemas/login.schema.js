const Joi = require('joi');

const schema = Joi.object({
  username: 
    Joi.string()
       .required()
       .alphanum()
       .min(3)
       .max(25)
       .messages({
        'string.base': 'Your username should contain only letters and numbers',
        'string.min': 'Your username must have at least 3 characters',
        'string.max': 'Your username must be less than 25 characters',
        'string.empty': 'Username cannot be empty!'
       }),
  password: 
    Joi.string()
       .required()
       .pattern(new RegExp('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,32}$'))
       .messages({
        'string.pattern.base': 
          `Password requirements:\n1.Password must be between 8-32 characters\n2.Password must contain uppercase and lowercase letters`,
        'string.empty': 'Password cannot be empty!'
        }),
  
})

module.exports = schema;