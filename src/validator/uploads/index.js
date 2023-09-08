const InvariantError = require('../../exeption/InvariantError');
const { CoverAlbumSchema } = require('./schema');

const UploadsValidator = {
  validateImageHeaders: (headers) => {
    const validationResult = CoverAlbumSchema.validate(headers);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = UploadsValidator;
