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
const product = __importStar(require("../controllers/products"));
const products_1 = require("../validators/products");
const global_1 = require("../validators/global");
const isAuthorized = false;
module.exports = [
    {
        method: 'POST',
        path: '/product',
        handler: product.create,
        options: {
            tags: ["api", "Product"],
            notes: "Create a new product to be used in products",
            description: "Create new product",
            auth: { strategy: "jwt", scope: ['admin', 'seller'] },
            validate: {
                // headers: authorizedheaders,
                headers: global_1.headers,
                options: global_1.options,
                payload: products_1.productRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: global_1.validator
            },
            response: {
                status: {
                    //200: categoryResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/product',
        handler: product.list,
        options: {
            tags: ["api", "Product"],
            notes: "List products",
            description: "List products",
            auth: { strategy: "jwt", scope: ['admin', 'seller'] },
            validate: {
                headers: global_1.headers,
                options: global_1.options,
                query: products_1.listProductRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: global_1.validator
            },
            response: {
                status: {
                    //200: listCategoryResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/product/{id}',
        handler: product.getProduct,
        options: {
            tags: ["api", "Product"],
            notes: "Get product by id",
            description: "Get product",
            auth: { strategy: "jwt", scope: ['admin', 'seller'] },
            validate: {
                headers: global_1.headers,
                options: global_1.options,
                params: products_1.productIdentity,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: global_1.validator
            },
            response: {
                status: {
                    //200: categoryResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/product/copyGallery',
        handler: product.copyGallery,
        options: {
            tags: ["api", "Product"],
            notes: "Get product by id",
            description: "Get product",
            auth: { strategy: "jwt", scope: ['admin', 'seller'] },
            validate: {
                headers: global_1.headers,
                options: global_1.options,
                query: products_1.copyGalleryIdentity,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: global_1.validator
            },
            response: {
                status: {
                    //200: categoryResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: 'PATCH',
        path: '/product/sendForApproval',
        handler: product.sendForApproval,
        options: {
            tags: ["api", "Product"],
            notes: "Send for admin approval",
            description: "Send for admin approval",
            auth: { strategy: "jwt", scope: ['admin', 'seller'] },
            validate: {
                headers: global_1.headers,
                options: global_1.options,
                payload: products_1.productIdentity,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: global_1.validator
            },
            response: {
                status: {
                    //200: categoryResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: 'PATCH',
        path: '/product/updateProductApprovalStatus',
        handler: product.updateProductApprovalStatus,
        options: {
            tags: ["api", "Product"],
            notes: "Admin update product approval status",
            description: "Admin update product approval status",
            auth: { strategy: "jwt", scope: ['admin', 'seller'] },
            validate: {
                headers: global_1.headers,
                options: global_1.options,
                payload: products_1.productApprovalRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: global_1.validator
            },
            response: {
                status: {
                    //200: categoryResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    // {
    //     method: 'PATCH',
    //     path: '/product/sendForApproval',
    //     handler:product.sendForApproval,
    //     options:{
    //         tags: ["api", "Product"],
    //         notes: "Send for admin approval",
    //         description: "Send for admin approval",
    //         //auth: { strategy: "jwt", scope: ['admin','manage_brand'] },
    //         auth: false,
    //         validate: {
    //             headers: headers,
    //             options: options,
    //             payload: productIdentity,
    //             failAction: async (request: any, h: any, error: any) => {
    //                 return Common.FailureError(error, request);
    //             },
    //             validator: validator
    //         },
    //         response: {
    //             status: {
    //                 //200: categoryResponse,
    //                 400: resp400,
    //                 500: resp500
    //             }
    //         }
    //     }
    // },
];
