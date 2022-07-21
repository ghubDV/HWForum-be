const Joi = require('joi');

const schema = Joi.object({
  code: 
    Joi.string()
       .required()
       .pattern(new RegExp(/^[a-f0-9]{32,}$/))
       .messages({
        'string.pattern.base': 
          `This code is invalid!`,
        'string.empty': 'Code cannot be empty!'
        }),
  
})

module.exports = schema;