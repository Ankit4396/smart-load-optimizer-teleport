'use strict';

import Hapi, { Server } from '@hapi/hapi';
import dotenv from 'dotenv';
import Inert from '@hapi/inert';
import Vision from '@hapi/vision';
import HapiSwagger from 'hapi-swagger';
import * as routes from 'hapi-auto-routes';
import Path from 'path';

dotenv.config();

export let server: Server;

export const init = async (): Promise<Server> => {
  server = Hapi.server({
    port: Number(process.env.PORT) || 8080,
    host: '0.0.0.0',
    routes: {
      cors: {
        origin: ['*']
      }
    }
  });

  // API Key Middleware
  server.ext('onRequest', (request, h) => {
    const apiKey = request.headers['x-api-key'];
  
    // Allow all Swagger + health routes
    if (
      request.path.startsWith('/documentation') ||
      request.path.startsWith('/swaggerui') ||
      request.path.startsWith('/swagger.json') ||
      request.path === '/health'
    ) {
      return h.continue;
    }
  
    if (!apiKey || apiKey !== process.env.API_KEY) {
      return h.response({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid or missing API key'
      }).code(401).takeover();
    }
  
    return h.continue;
  });

  // Swagger config
  const swaggerOptions: HapiSwagger.RegisterOptions = {
    info: {
      title: 'Smart Load Optimizer API',
      version: '1.0.0'
    },
    securityDefinitions: {
      ApiKey: {
        type: 'apiKey',
        name: 'x-api-key',
        in: 'header'
      }
    }
  };

  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions
    }
  ]);

  // Auto-load routes
  routes.bind(server).register({
    pattern: Path.join(process.cwd(), 'src/routes/**/*.ts')
  });

  return server;
};

export const start = async (): Promise<void> => {
  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

process.on('unhandledRejection', (err: any) => {
  console.error(err);
  process.exit(1);
});

// Start server
init().then(() => start());