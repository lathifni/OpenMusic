const InvariantError = require("../../exeption/InvariantError")
const { CollaborationPayloadSchema } = require('./schema')

const CollaborationsValidator = {
    validateCollaboration: (payload) => {
        const validationResult = CollaborationPayloadSchema.validate(payload)
        if (validationResult.error){
            throw new InvariantError(validationResult.error.message)
        }
    }
}

module.exports = CollaborationsValidator