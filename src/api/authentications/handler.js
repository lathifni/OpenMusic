class AuthenticationsHander {
    constructor(authenticationsService, usersService, tokenManager, validator) {
        this._authenticationsService = authenticationsService
        this._usersService = usersService
        this._tokenManager = tokenManager
        this._validator = validator
    }

    async postAuthenticationHandler(req, h) {
        this._validator.validatePostAuthenticationPayload(req.payload)
        const { username, password } = req.payload
        const id = await this._usersService.verifyUserCridential(username, password)
        const accessToken = this._tokenManager.generateAccessToken({ id })
        const refreshToken = this._tokenManager.generateRefreshToken({ id })

        await this._authenticationsService.addRefreshToken(refreshToken)
        return h.response({
            status: 'success',
            message: 'Authentication berhasil ditambahkan',
            data: { accessToken, refreshToken }
        }).code(201)
    }

    async putAuthenticationHandler(req, h) {
        this._validator.validatePutAuthenticationPayload(req.payload)
        const { refreshToken } = req.payload
        await this._authenticationsService.verifyRefreshToken(refreshToken)
        const { id } = this._tokenManager.generateRefreshToken(refreshToken)
        const accessToken = this._tokenManager.generateAccessToken({ id })
        return h.response({
            status: 'success',
            message: 'Access Token berhasil diperbarui',
            data: { accessToken }
        })
    }

    async deleteAuthenticationHandler(req, h) {
        this._validator.validatePutAuthenticationPayload(req.payload)
        const { refreshToken } = req.payload
        await this._authenticationsService.verifyRefreshToken(refreshToken)
        await this._authenticationsService.deleteRefreshToken(refreshToken)
        return h.response({
            status: 'success',
            message: 'Refresh token berhasil dihapus'
        })
    }
}

module.exports = AuthenticationsHander