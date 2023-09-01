class CollabHandler {
    constructor(service, validator){
        this._service = service
        this._validator = validator
    }

    async postCollaborationHandler(req, h){
        this._validator.validateCollaboration(req.payload)
        const { playlistId, userId } = req.payload
        console.log(userId)
        console.log(playlistId)
        await this._service.addCollaboration({ playlistId, userId })
        return console.log('test')
    }
}

module.exports = CollabHandler