const InvariantError = require("../../exeption/InvariantError")
const { playlistPayloadSchema, songToPlaylistPayloadSchema } = require("./schema")

const PlaylistValidator = {
    validatePlaylistPayload: (payload) => {
        const validationResult = playlistPayloadSchema.validate(payload)
        if (validationResult.error){
            throw new InvariantError(validationResult.error.message)
        }
    },
    validateSongPlaylistPayload: (payload) => {
        const validateResult = songToPlaylistPayloadSchema.validate(payload)
        if (validateResult.error){
            throw new InvariantError(validateResult.error.message)
        }
    }
}

module.exports = PlaylistValidator