const CollabHandler = require('./handler')
const routes = require('./routes')

module.exports = {
    name: 'collaborations',
    version: '1.0.0',
    register: async(server, {service, validator}) => {
        const collabHandler = new CollabHandler(service, validator)
        server.route(routes(collabHandler))
    }
}