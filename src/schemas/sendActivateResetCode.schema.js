const Joi = require('joi');

const schema = Joi.object({
  type:
    Joi.string()
       .valid('reset', 'activate')
       .required(),
  email: 
    Joi.string()
       .required()
       .email({ minDomainSegments: 2, tlds: { allow: true } })
       .messages({
        'string.email': 'You must provide a valid email address',
        'string.empty': 'Email cannot be empty!'
       }),
  
})

module.exports = schema;