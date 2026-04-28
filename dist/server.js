'use strict';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = exports.init = exports.server = void 0;
const hapi_1 = __importDefault(require("@hapi/hapi"));
const dotenv_1 = __importDefault(require("dotenv"));
const inert_1 = __importDefault(require("@hapi/inert"));
const vision_1 = __importDefault(require("@hapi/vision"));
const hapi_swagger_1 = __importDefault(require("hapi-swagger"));
const routes = __importStar(require("hapi-auto-routes"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    exports.server = hapi_1.default.server({
        port: Number(process.env.PORT) || 8080,
        host: '0.0.0.0',
        routes: {
            cors: {
                origin: ['*']
            }
        }
    });
    // API Key Middleware
    exports.server.ext('onRequest', (request, h) => {
        const apiKey = request.headers['x-api-key'];
        // Allow all Swagger + health routes
        if (request.path.startsWith('/documentation') ||
            request.path.startsWith('/swaggerui') ||
            request.path.startsWith('/swagger.json') ||
            request.path === '/health') {
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
    const swaggerOptions = {
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
    yield exports.server.register([
        inert_1.default,
        vision_1.default,
        {
            plugin: hapi_swagger_1.default,
            options: swaggerOptions
        }
    ]);
    // Auto-load routes
    routes.bind(exports.server).register({
        pattern: path_1.default.join(process.cwd(), 'src/routes/**/*.ts')
    });
    return exports.server;
});
exports.init = init;
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    yield exports.server.start();
    console.log(`Server running on ${exports.server.info.uri}`);
});
exports.start = start;
process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
});
// Start server
(0, exports.init)().then(() => (0, exports.start)());
