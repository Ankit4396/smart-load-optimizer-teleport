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
const faqs = __importStar(require("../controllers/faqs"));
const global_1 = require("../validators/global");
const faqs_1 = require("../validators/faqs");
module.exports = [
    {
        method: 'POST',
        path: '/faq',
        handler: faqs.create,
        options: {
            tags: ["api", "FAQ"],
            notes: "Create a new faq entry",
            description: "Create new FAQ",
            auth: { strategy: 'jwt', scope: ['admin', 'manage_faqs', 'create_faq'] },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                payload: faqs_1.faqRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: global_1.validator
            },
            response: {
                status: {
                    // 200: faqResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/faq/{id}',
        handler: faqs.get,
        options: {
            tags: ["api", "FAQ"],
            notes: "Get FAQ by id",
            description: "Get FAQ",
            auth: { strategy: 'jwt', scope: ['admin', 'manage_faqs', 'get_faqs'] },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                params: faqs_1.faqIdentity,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: global_1.validator
            },
            response: {
                status: {
                    // 200: faqResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: 'PATCH',
        path: '/faq/{id}',
        handler: faqs.update,
        options: {
            tags: ["api", "FAQ"],
            notes: "update faq entry",
            description: "Ureate FAQ",
            auth: { strategy: 'jwt', scope: ['admin', 'manage_faqs', 'update_faq'] },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                params: faqs_1.faqIdentity,
                payload: faqs_1.faqRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: global_1.validator
            },
            response: {
                status: {
                    // 200: faqResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: 'DELETE',
        path: '/faq/{id}',
        handler: faqs.deleteFaq,
        options: {
            tags: ["api", "FAQ"],
            notes: "Delete FAQ entry",
            description: "Delete FAQ",
            auth: { strategy: 'jwt', scope: ['admin', 'manage_faqs', 'delete_faq'] },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                params: faqs_1.faqIdentity,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: global_1.validator
            },
            response: {
                status: {
                    // 200: faqDeleteResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/faq/list',
        handler: faqs.list,
        options: {
            tags: ["api", "FAQ"],
            notes: "List faqs",
            description: "List FAQs",
            auth: { strategy: 'jwt', scope: ['admin', 'manage_faqs', 'list_faq'] },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                query: faqs_1.listFaqRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: global_1.validator
            },
            response: {
                status: {
                    // 200: listFaqResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/faq/public-list',
        handler: faqs.publicList,
        options: {
            tags: ["api", "FAQ"],
            notes: "List faqs",
            description: "List FAQs",
            auth: false,
            validate: {
                headers: global_1.headers,
                options: global_1.options,
                query: faqs_1.listFaqRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: global_1.validator
            },
            response: {
                status: {
                    // 200: listFaqResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: 'PATCH',
        path: '/faq/setOrder/{id}',
        handler: faqs.setOrder,
        options: {
            tags: ["api", "FAQ"],
            notes: "Set Sort Order for faqs",
            description: "Order FAQs",
            auth: { strategy: 'jwt', scope: ['admin', 'manage_faqs', 'list_faq'] },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                params: faqs_1.faqIdentity,
                payload: faqs_1.sortRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: global_1.validator
            },
            response: {
                status: {
                    // 200: sortResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: 'PATCH',
        path: '/faq/{id}/status',
        handler: faqs.updateStatus,
        options: {
            tags: ["api", "FAQ"],
            notes: "Update FAQ status",
            description: "Update FAQ status",
            auth: { strategy: 'jwt', scope: ['admin', 'manage_faqs', 'update_faq'] },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                params: faqs_1.faqIdentity,
                payload: faqs_1.faqStatusRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: global_1.validator
            },
            response: {
                status: {
                    // 200: faqResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/faq',
        handler: faqs.listAll,
        options: {
            tags: ["api", "FAQ"],
            notes: "Update FAQ status",
            description: "Update FAQ status",
            auth: false,
            validate: {
                headers: global_1.headers,
                options: global_1.options,
                query: faqs_1.categoryFilter,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: global_1.validator
            },
            response: {
                status: {
                    // 200: faqsResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    }
];
