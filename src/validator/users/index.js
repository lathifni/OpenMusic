const { UsersPayloadSchema } = require("./schema")
const InvariantError = require("../../exeption/InvariantError")

const UsersValidation = {
    validateUsersPayload: (payload) => {
        const validationResult = UsersPayloadSchema.validate(payload)
        if (validationResult.error){
            throw new InvariantError(validationResult.error.message)
        }
    }
}

module.exports = UsersValidation