const InvariantError = require("../../exeption/InvariantError")
const { PostAuthenticationPayloadSchema, PutAuthenticationPayloadSchema, DeleteAuthenticationPayloadSchema } = require("./schema")

const AuthenticationsValidator = {
    validatePostAuthenticationPayload: (payload) => {
        const validationResult = PostAuthenticationPayloadSchema.validate(payload)
        if (validationResult.error){
            throw new InvariantError(validationResult.error.message)
        }
    }, 
    validatePutAuthenticationPayload: (payload) => {
        const validationResult = PutAuthenticationPayloadSchema.validate(payload)
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
          }
    },
    validateDeleteAuthenticationPayload: (payload) => {
        const validateResult = DeleteAuthenticationPayloadSchema.validate(payload)
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
          }
    }
}

module.exports = AuthenticationsValidator