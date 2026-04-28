"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routes = [
    {
        method: 'GET',
        path: '/health',
        handler: () => ({
            status: 'ok',
            service: 'load-optimizer',
            version: '1.0.0'
        }),
        options: {
            tags: ['api'],
            description: 'Health check endpoint',
            notes: 'Returns service status'
        }
    }
];
module.exports = routes;
