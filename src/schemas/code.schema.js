const Joi = require('joi');

const schema = Joi.object({
  activationCode: 
    Joi.string()
       .pattern(new RegExp(/^[a-f0-9]{32}\.[a-f0-9]{1,}$/))
       .required(),
  
})

module.exports = schema;