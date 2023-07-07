class UsersHandler {
    constructor(service, validator) {
        this._service = service
        this._validator = validator
    }

    async postUserHandler(req, h) {
        this._validator.validateUsersPayload(req.payload)
        const { username, password, fullname } = req.payload
        const userId = await this._service.addUser({ username, password, fullname })
        return h.response({
            status: 'success',
            message: 'User berhasil ditambahkan',
            data: { userId }
        }).code(201)
    }

    async getUserByIdHandler(req, h) {
        const { id } = req.params
        const user = await this._service.getUserById(id)
        return {
            status: 'success',
            data: { user }
        }
    }
}

module.exports = UsersHandler