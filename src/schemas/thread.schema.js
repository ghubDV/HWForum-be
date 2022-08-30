const Joi = require('joi');

const topicSchema = 
  Joi
    .number()
    .required()
    .messages({
      'any.required': 'Choosing a topic is required!'
    });

const nameSchema =  
  Joi
    .string()
    .required()
    .min(10)
    .messages({
      'string.min': 'Thread title must have at least 10 characters',
      'string.empty': 'Thread title cannot be empty'
    });

const contentSchema = 
  Joi
    .string()
    .required()
    .min(25)
    .messages({
      'string.min': 'Thread content must be at least 25 characters long',
      'string.empty': 'Thread content cannot be empty!'
    });

const threadSchema = Joi.object({
  topic: topicSchema,
  name: nameSchema,
  content: contentSchema,
})

module.exports = {
  threadSchema,
  topicSchema,
  nameSchema,
  contentSchema
};