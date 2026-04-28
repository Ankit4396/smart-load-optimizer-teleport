import { ServerRoute } from '@hapi/hapi';
import { status } from '../controllers/healthCheck';

const routes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/health',
    handler: status,
    options: {
      tags: ['api'],
      description: 'Health check endpoint',
      notes: 'Returns service status'
    }
  }
];

module.exports = routes;