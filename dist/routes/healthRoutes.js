"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const healthCheck_1 = require("../controllers/healthCheck");
const routes = [
    {
        method: 'GET',
        path: '/health',
        handler: healthCheck_1.status,
        options: {
            tags: ['api'],
            description: 'Health check endpoint',
            notes: 'Returns service status'
        }
    }
];
exports.default = routes;
