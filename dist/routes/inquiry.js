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
const inquiry = __importStar(require("../controllers/inquiry"));
const global_1 = require("../validators/global");
const inquiry_1 = require("../validators/inquiry");
module.exports = [
    {
        method: 'POST',
        path: '/inquiry',
        handler: inquiry.createInquiry,
        options: {
            tags: ["api", "Inquiry"],
            notes: "Create a new Inquiry",
            description: "Create a new Inquiry",
            auth: { strategy: 'jwt' },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                payload: inquiry_1.inquiryRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: global_1.validator
            },
            response: {
                status: {
                    // 200: inquiryResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/inquiry/{id}',
        handler: inquiry.getInquiryById,
        options: {
            tags: ["api", "Inquiry"],
            notes: "Get Inquiry by ID",
            description: "Get Inquiry by ID",
            auth: { strategy: 'jwt' },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                params: inquiry_1.inquiryIdentity,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: global_1.validator
            },
            response: {
                status: {
                    // 200: inquiryResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: 'PATCH',
        path: '/inquiry/{id}',
        handler: inquiry.updateInquiry,
        options: {
            tags: ["api", "Inquiry"],
            notes: "Update Inquiry",
            description: "Update Inquiry",
            auth: { strategy: 'jwt' },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                params: inquiry_1.inquiryIdentity,
                payload: inquiry_1.inquiryRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: global_1.validator
            },
            response: {
                status: {
                    // 200: inquiryResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: 'DELETE',
        path: '/inquiry/{id}',
        handler: inquiry.deleteInquiry,
        options: {
            tags: ["api", "Inquiry"],
            notes: "Delete Inquiry",
            description: "Delete Inquiry",
            auth: { strategy: 'jwt' },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                params: inquiry_1.inquiryIdentity,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: global_1.validator
            },
            response: {
                status: {
                    // 200: inquiryResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: 'PATCH',
        path: '/inquiry/{id}/status',
        handler: inquiry.updateInquiryStatus,
        options: {
            tags: ["api", "Inquiry"],
            notes: "Update Inquiry Status",
            description: "Update Inquiry Status",
            auth: { strategy: 'jwt' },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                params: inquiry_1.inquiryIdentity,
                payload: inquiry_1.inquiryStatusRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: global_1.validator
            },
            response: {
                status: {
                    // 200: inquiryResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/inquiry/list',
        handler: inquiry.getAllInquiriesForAdmin,
        options: {
            tags: ["api", "Inquiry"],
            notes: "List Inquiries for Admin",
            description: "List Inquiries for Admin",
            auth: { strategy: 'jwt' },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                query: inquiry_1.listInquiryRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: global_1.validator
            },
            response: {
                status: {
                    // 200: listInquiryResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/inquiry/user/list',
        handler: inquiry.getAllInquiriesForUser,
        options: {
            tags: ["api", "Inquiry"],
            notes: "List Inquiries for User",
            description: "List Inquiries for User",
            auth: { strategy: 'jwt' },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                query: inquiry_1.listInquiryRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: global_1.validator
            },
            response: {
                status: {
                    // 200: listInquiryResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    }
];
