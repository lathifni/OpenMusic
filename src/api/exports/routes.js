const routes = (handler) => [
    {
      method: 'POST',
      path: '/export/playlists/{id}',
      handler: (req, h) => handler.postExportNotesHandler(req, h),
      options: {
        auth: 'musicapp_jwt',
      },
    },
  ];
  
  module.exports = routes;