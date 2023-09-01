const routes = (handler) => [
    {
        method: 'POST',
        path: '/collaborations',
        handler: (req, h) => handler.postCollaborationHandler(req, h)
    },{
        method: 'DELETE',
        path: '/collaborations',
        handler: (req, h) => handler.deleteCollaborationHandler(req, h)
    }
]

module.exports = routes