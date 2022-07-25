const Joi = require('joi');

const schema = Joi.object({
  profileName: 
    Joi.string()
       .alphanum()
       .min(3)
       .max(25)
       .messages({
        'string.base': 'Your profile name should contain only letters and numbers',
        'string.min': 'Your profile name must have at least 3 characters',
        'string.max': 'Your profile name must be less than 25 characters',
       }),
  firstName: 
    Joi.string()
       .allow(null, '')
       .pattern(new RegExp('^[a-zA-Z]{0,50}$'))
       .messages({
        'string.pattern.base': 
          `First name must contain only letters or is too long`,
        }),
  lastName: 
    Joi.string()
       .allow(null, '')
       .pattern(new RegExp('^[a-zA-Z]{0,50}$'))
       .messages({
        'string.pattern.base': 
          `Last name must contain only letters or is too long`,
        }),
  
})

module.exports = schema;