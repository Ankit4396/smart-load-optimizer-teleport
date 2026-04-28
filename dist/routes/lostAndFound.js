"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const routeImporter_1 = require("../config/routeImporter");
const Controller = __importStar(require("../controllers/lostAndFound"));
const lostAndFound_1 = require("../validators/lostAndFound");
const global_1 = require("../validators/global");
module.exports = [
    {
        method: 'POST',
        path: '/lost-and-found',
        handler: Controller.createRequest,
        options: {
            tags: ["api", "LostAndFound"],
            notes: "Create a lost or found item entry. Requires JWT authentication.",
            description: "Create Lost & Found entry",
            auth: { strategy: "jwt" },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                payload: lostAndFound_1.createLostAndFoundRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: routeImporter_1.Joi
            },
            response: {
                status: {
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: 'PATCH',
        path: '/lost-and-found/{id}',
        handler: Controller.updateRequest,
        options: {
            tags: ["api", "LostAndFound"],
            notes: "Update a lost or found item entry by ID. Requires JWT authentication.",
            description: "Update Lost & Found entry",
            auth: { strategy: "jwt" },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                payload: lostAndFound_1.updateLostAndFoundRequest,
                params: lostAndFound_1.identifierRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: routeImporter_1.Joi
            },
            response: {
                status: {
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/lost-and-found/{id}',
        handler: Controller.getById,
        options: {
            tags: ["api", "LostAndFound"],
            notes: "Get a Lost & Found entry by ID. Requires JWT authentication.",
            description: "Fetch Lost & Found entry by ID",
            auth: { strategy: "jwt" },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                params: lostAndFound_1.identifierRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: routeImporter_1.Joi
            },
            response: {
                status: {
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/lost-and-found',
        handler: Controller.getAll,
        options: {
            tags: ["api", "LostAndFound"],
            notes: "List all Lost & Found entries with filters and pagination. Requires JWT authentication.",
            description: "List Lost & Found entries",
            auth: { strategy: "jwt" },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                query: lostAndFound_1.listLostAndFoundRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: routeImporter_1.Joi
            },
            response: {
                status: {
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/lost-and-found/user',
        handler: Controller.getAllByUser,
        options: {
            tags: ["api", "LostAndFound"],
            notes: "List all Lost & Found entries with filters and pagination. Requires JWT authentication.",
            description: "List Lost & Found entries",
            auth: { strategy: "jwt" },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                query: lostAndFound_1.listLostAndFoundRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: routeImporter_1.Joi
            },
            response: {
                status: {
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/lost-and-found/listAll',
        handler: Controller.list,
        options: {
            tags: ["api", "LostAndFound"],
            notes: "List all Lost & Found entries with filters and pagination. Requires JWT authentication.",
            description: "List Lost & Found entries",
            auth: { strategy: "jwt" },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                query: lostAndFound_1.listLostAndFoundRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: routeImporter_1.Joi
            },
            response: {
                status: {
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/lost-and-found/listAll/user',
        handler: Controller.listForUser,
        options: {
            tags: ["api", "LostAndFound"],
            notes: "List all Lost & Found entries with filters and pagination. Requires JWT authentication.",
            description: "List Lost & Found entries",
            auth: { strategy: "jwt" },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                query: lostAndFound_1.listLostAndFoundRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: routeImporter_1.Joi
            },
            response: {
                status: {
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: 'PATCH',
        path: '/lost-and-found/{id}/status',
        handler: Controller.updateStatus,
        options: {
            tags: ["api", "LostAndFound"],
            notes: "Change status of a Lost & Found entry. Requires JWT authentication.",
            description: "Update status (e.g., active/inactive) of Lost & Found entry",
            auth: { strategy: "jwt" },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                payload: lostAndFound_1.updateLostAndFoundStatusRequest,
                params: lostAndFound_1.identifierRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: routeImporter_1.Joi
            },
            response: {
                status: {
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: 'DELETE',
        path: '/lost-and-found/{id}',
        handler: Controller.deleteRecord,
        options: {
            tags: ["api", "LostAndFound"],
            notes: "Delete record",
            description: "Delete record",
            auth: { strategy: 'jwt', scope: ['admin', 'user'] },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                params: lostAndFound_1.identifierRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: routeImporter_1.Joi
            },
            response: {
                status: {
                    // 200: postDeleteResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
];
