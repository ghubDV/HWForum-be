const Joi = require('joi');

const schema = Joi.object({
  type:
    Joi.string()
       .valid('reset', 'activate')
       .required(),
  email: 
    Joi.string()
       .email({ minDomainSegments: 2, tlds: { allow: true } }),
  
})

module.exports = schema;