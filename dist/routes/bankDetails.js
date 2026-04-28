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
const Controller = __importStar(require("../controllers/bankDetails"));
const bankDetails_1 = require("../validators/bankDetails");
const global_1 = require("../validators/global");
module.exports = [
    {
        method: 'POST',
        path: '/bank-detail',
        handler: Controller.create,
        options: {
            tags: ["api", "Bank Details"],
            notes: "This endpoint allows users to submit their bank details for processing. It is used by both admins and sellers to provide their banking information.",
            description: "Submit bank details for a user.",
            auth: { strategy: "jwt", scope: ["admin", "seller"] },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                payload: bankDetails_1.addBankDetailsRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: routeImporter_1.Joi
            },
            response: {
                status: {
                    // 200: otpResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: 'PATCH',
        path: '/bank-detail/{id}',
        handler: Controller.update,
        options: {
            tags: ["api", "Bank Details"],
            notes: "This endpoint allows users to update their existing bank details. It is used by both admins and sellers to modify banking information.",
            description: "Update the bank details for a specific user.",
            auth: { strategy: "jwt", scope: ["admin", "seller"] },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                payload: bankDetails_1.addBankDetailsRequest,
                params: global_1.identifierRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: routeImporter_1.Joi
            },
            response: {
                status: {
                    // 200: otpResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/bank-detail/{id}',
        handler: Controller.get,
        options: {
            tags: ["api", "Bank Details"],
            notes: "Retrieve the bank details for a specific user. This endpoint allows users or admins to view existing bank details associated with a user's account.",
            description: "Fetch the bank details for a specific user by ID.",
            auth: { strategy: "jwt" },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                params: global_1.identifierRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: routeImporter_1.Joi
            },
            response: {
                status: {
                    // 200: otpResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/bank-details',
        handler: Controller.list,
        options: {
            tags: ["api", "Bank Details"],
            notes: "Retrieve a list of all bank details associated with user accounts. This endpoint allows users or admins to view all available bank details.",
            description: "Fetch a list of all bank details.",
            auth: { strategy: "jwt" },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                // query: listShopRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: routeImporter_1.Joi
            },
            response: {
                status: {
                    // 200: otpResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: 'DELETE',
        path: '/bank-detail/{id}',
        handler: Controller.remove,
        options: {
            tags: ["api", "Bank Details"],
            notes: "This endpoint allows for the deletion of a specific bank detail record by its ID. Only admins or authorized users can perform this operation.",
            description: "Delete a bank detail record by its ID.",
            auth: { strategy: "jwt" },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                params: global_1.identifierRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: routeImporter_1.Joi
            },
            response: {
                status: {
                    // 200: otpResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    }
];
