const { MusicPayloadSchema } = require("./schema")

const MusicValidator = {
    validateMusicPayload: (payload) => {
        const validateResult = MusicPayloadSchema.validateMusicPayload(payload)
        if (validateResult.error){
            console.log('error nih di /validator/music/index')
        }
    }
}

module.exports = MusicValidator