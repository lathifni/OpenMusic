const Joi = require('joi')

const MusicPayloadSchema = Joi.object({
    name: Joi.string().required(),
    year: Joi.number().required(),
    
    // title: Joi.string().required(),
    // genre: Joi.string().required(),
    // performance: Joi.string().required(),
    // duration: Joi.number(),
})

module.exports = { MusicPayloadSchema }
