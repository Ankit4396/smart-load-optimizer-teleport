"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHealthStatus = void 0;
const getHealthStatus = () => {
    return {
        status: 'ok',
        service: 'load-optimizer',
        version: '1.0.0'
    };
};
exports.getHealthStatus = getHealthStatus;
