const Joi = require('joi');

const schema = Joi.object({
  topic:
    Joi.number()
       .required()
       .messages({
        'any.required': 'Choosing a topic is required!'
       }),
  name: 
    Joi.string()
       .required()
       .min(10)
       .messages({
        'string.min': 'Thread title must have at least 10 characters',
        'string.empty': 'Thread title cannot be empty'
       }),
  content: 
    Joi.string()
       .required()
       .min(25)
       .messages({
        'string.min': 'Thread content must be at least 25 characters long',
        'string.empty': 'Thread content cannot be empty!'
        }),
  
})

module.exports = schema;