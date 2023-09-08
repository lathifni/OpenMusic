const Joi = require('joi');

const ExportMusicPayloadSchema = Joi.object({
  targetEmail: Joi.string().email({ tlds: true }).required(),
});

module.exports = ExportMusicPayloadSchema;