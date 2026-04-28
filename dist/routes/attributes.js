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
const { authorizedheaders, optional_authorizedheaders, headers, options, validator, respmessage, resp400, resp500 } = require("../validators/global");
const attributes = __importStar(require("../controllers/attributes"));
const attributes_1 = require("../validators/attributes");
module.exports = [{
        method: 'POST',
        path: '/attribute',
        handler: attributes.createAttribute,
        options: {
            tags: ["api", "Product Attribute"],
            notes: "Create a new attribute to be used in products",
            description: "Create a new attribute",
            auth: { strategy: "jwt", scope: ['admin'] },
            validate: {
                headers: authorizedheaders,
                options: options,
                payload: attributes_1.attributeRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: validator
            },
            response: {
                status: {
                    //200: categoryResponse,
                    400: resp400,
                    500: resp500
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/attribute/{id}',
        handler: attributes.getAttribute,
        options: {
            tags: ["api", "Product Attribute"],
            notes: "Get attribute by id",
            description: "Get attribute",
            auth: { strategy: "jwt", scope: ['admin', 'manageCategory', 'createCategory'] },
            validate: {
                headers: authorizedheaders,
                options: options,
                params: attributes_1.attributeIdentity,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: validator
            },
            response: {
                status: {
                    //200: categoryResponse,
                    400: resp400,
                    500: resp500
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/attributeList',
        handler: attributes.attributeList,
        options: {
            tags: ["api", "Product Attribute"],
            notes: "List category attributes",
            description: "List category attributes",
            auth: { strategy: "jwt", scope: ['admin'] },
            validate: {
                headers: authorizedheaders,
                options: options,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: validator
            },
            response: {
                status: {
                    //200: listCategoryResponse,
                    400: resp400,
                    500: resp500
                }
            }
        }
    },
    {
        method: 'PATCH',
        path: '/attribute/{id}',
        handler: attributes.updateAttribute,
        options: {
            tags: ["api", "Product Attribute"],
            notes: "Update attribute",
            description: "Update attribute",
            auth: { strategy: "jwt", scope: ['admin', 'manageCategory', 'updateCategory'] },
            validate: {
                headers: authorizedheaders,
                options: options,
                params: attributes_1.attributeIdentity,
                payload: attributes_1.attributeRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: validator
            },
            response: {
                status: {
                    //200: categoryResponse,
                    400: resp400,
                    500: resp500
                }
            }
        }
    },
    {
        method: 'PATCH',
        path: '/attribute/{id}/status',
        handler: attributes.updateAttributeStatus,
        options: {
            tags: ["api", "Product Attribute"],
            notes: "Update attribute status",
            description: "Update attribute status",
            auth: { strategy: "jwt", scope: ['admin', 'manage_category', 'update_category'] },
            validate: {
                headers: authorizedheaders,
                options: options,
                params: attributes_1.attributeIdentity,
                payload: attributes_1.attributeStatusRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: validator
            },
            response: {
                status: {
                    //200: categoryResponse,
                    400: resp400,
                    500: resp500
                }
            }
        }
    },
    {
        method: 'DELETE',
        path: '/attribute/{id}',
        handler: attributes.deleteAttribute,
        options: {
            tags: ["api", "Product Attribute"],
            notes: "Delete attribute",
            description: "Delete attribute",
            auth: { strategy: "jwt", scope: ['admin'] },
            validate: {
                headers: authorizedheaders,
                options: options,
                params: attributes_1.attributeIdentity,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: validator
            },
            response: {
                status: {
                    //200: categoryDeleteResponse,
                    400: resp400,
                    500: resp500
                }
            }
        }
    }];
