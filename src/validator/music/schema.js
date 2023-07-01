const Joi = require('joi')

const AlbumsPayloadSchema = Joi.object({
    name: Joi.string().required(),
    year: Joi.number().required(),
})

const SongsPayloadSchema = Joi.object({
    title: Joi.string().required(),
    genre: Joi.string().required(),
    performance: Joi.string().required(),
    duration: Joi.number(),
})

module.exports = { AlbumsPayloadSchema, SongsPayloadSchema }
