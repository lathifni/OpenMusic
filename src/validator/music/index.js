const InvariantError = require("../../exeption/InvariantError")
const { AlbumsPayloadSchema, SongsPayloadSchema } = require("./schema")

const MusicValidator = {
    validateAlbumsPayload: (payload) => {
        const validationResult = AlbumsPayloadSchema.validate(payload)
        if (validationResult.error){
            throw new InvariantError(validationResult.error.message)
        }
    }, validateSongsPayload: (payload) => {
        const validationResult = SongsPayloadSchema.validate(payload)
        if (validationResult.error){
            throw new InvariantError(validationResult.error.message)
        }
    }
}

module.exports = MusicValidator