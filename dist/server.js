'use strict';
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
const healthRoutes_1 = __importDefault(require("./routes/healthRoutes"));
const loadOptimizer_1 = __importDefault(require("./routes/loadOptimizer"));
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
    // ========================
    // API KEY AUTH MIDDLEWARE
    // ========================
    exports.server.ext('onRequest', (request, h) => {
        const apiKey = request.headers['x-api-key'];
        // allow public routes
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
    // ========================
    // SWAGGER CONFIG
    // ========================
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
    // ========================
    // REGISTER PLUGINS
    // ========================
    yield exports.server.register([
        inert_1.default,
        vision_1.default,
        {
            plugin: hapi_swagger_1.default,
            options: swaggerOptions
        }
    ]);
    // ========================
    // REGISTER ROUTES (IMPORTANT FIX)
    // ========================
    exports.server.route([
        ...healthRoutes_1.default,
        ...loadOptimizer_1.default
    ]);
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
(0, exports.init)().then(() => (0, exports.start)());
