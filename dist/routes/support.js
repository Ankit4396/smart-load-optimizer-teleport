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
const Support = __importStar(require("../controllers/support"));
const support_1 = require("../validators/support");
const global_1 = require("../validators/global");
const isAuthorized = false;
module.exports = [
    {
        method: 'POST',
        path: '/support/ticket',
        handler: Support.createSupportTicket,
        options: {
            tags: ["api", "Support"],
            notes: "User creates a support ticket.",
            description: "Create Support Ticket",
            auth: false,
            validate: {
                headers: global_1.headers,
                options: global_1.options,
                payload: support_1.createSupportRequest,
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
        path: '/support/tickets',
        handler: Support.getUserTickets,
        options: {
            tags: ["api", "Support"],
            notes: "Get user's support tickets.",
            description: "Get Support Tickets",
            auth: false,
            validate: {
                headers: global_1.headers,
                options: global_1.options,
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
        path: '/support/ticket/{id}',
        handler: Support.getTicketById,
        options: {
            tags: ["api", "Support"],
            notes: "Get a specific support ticket.",
            description: "Get Single Support Ticket",
            auth: false,
            validate: {
                headers: global_1.headers,
                options: global_1.options,
                params: global_1.identifierRequest,
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
        path: '/admin/support/tickets',
        handler: Support.getAllSupportTickets,
        options: {
            tags: ["api", "Support"],
            notes: "Get all support tickets with pagination and filters",
            description: "Admin Get All Support Tickets",
            auth: false,
            validate: {
                headers: global_1.headers,
                options: global_1.options,
                query: support_1.fetchSupportListRequest,
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
        method: 'PUT',
        path: '/support/ticket/{id}/reply',
        handler: Support.adminReplyToTicket,
        options: {
            tags: ["api", "Support"],
            notes: "Admin replies to support ticket.",
            description: "Admin Reply to Ticket",
            auth: false,
            validate: {
                headers: global_1.headers,
                options: global_1.options,
                params: global_1.identifierRequest,
                payload: support_1.adminReplyRequest,
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
        path: '/admin/support/ticket/{id}',
        handler: Support.deleteSupportTicket,
        options: {
            tags: ["api", "Support"],
            notes: "Delete support ticket by user.",
            description: "Delete Support Ticket",
            auth: false,
            validate: {
                headers: global_1.headers,
                options: global_1.options,
                params: global_1.identifierRequest,
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
    }
];
