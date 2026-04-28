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
const brand = __importStar(require("../controllers/brands"));
const brands_1 = require("../validators/brands");
const global_1 = require("../validators/global");
const isAuthorized = false;
module.exports = [
    {
        method: 'POST',
        path: '/brand',
        handler: brand.create,
        options: {
            tags: ["api", "Brand"],
            notes: "Create a new brand to be used in products",
            description: "Create new brand",
            auth: { strategy: "jwt", scope: ['admin', 'manage_brand', 'create_brand'] },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                payload: brands_1.brandRequest,
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
        path: '/brand/{id}',
        handler: brand.getBrand,
        options: {
            tags: ["api", "Brand"],
            notes: "Get brand by id",
            description: "Get brand",
            auth: { strategy: "jwt", scope: ['admin', 'manage_brand'] },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                params: brands_1.brandIdentity,
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
        path: '/brand',
        handler: brand.list,
        options: {
            tags: ["api", "Brand"],
            notes: "List brands",
            description: "List brands",
            auth: { strategy: "jwt", scope: ['admin', 'manage_brand', 'delete_brand', 'update_brand', 'create_brand'] },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                query: brands_1.listBrandRequest,
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
        method: 'PATCH',
        path: '/brand/{id}',
        handler: brand.update,
        options: {
            tags: ["api", "Brand"],
            notes: "Update brand",
            description: "Update brand",
            auth: { strategy: "jwt", scope: ['admin', 'manage_brand', 'update_brand'] },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                params: brands_1.brandIdentity,
                payload: brands_1.brandRequest,
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
        path: '/brand/{id}/status',
        handler: brand.updateStatus,
        options: {
            tags: ["api", "Brand"],
            notes: "Update brand status",
            description: "Update brand status",
            auth: { strategy: "jwt", scope: ['admin', 'manage_brand', 'update_brand'] },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                params: brands_1.brandIdentity,
                payload: brands_1.brandStatusRequest,
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
        method: 'DELETE',
        path: '/brand/{id}',
        handler: brand.deleteBrand,
        options: {
            tags: ["api", "Brand"],
            notes: "Delete brand",
            description: "Delete brand",
            auth: { strategy: "jwt", scope: ['admin', 'manage_brand', 'delete_brand'] },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                params: brands_1.brandIdentity,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: global_1.validator
            },
            response: {
                status: {
                    //200: categoryDeleteResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
];
