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
const categoryTypes = __importStar(require("../controllers/categoryTypes"));
const { authorizedheaders, headers, options, validator, respmessage, resp400, resp500 } = require("../validators/global");
// const categoryTypes=require("../controllers/categoryTypes");
const categoryTypes_1 = require("../validators/categoryTypes");
module.exports = [
    {
        method: 'POST',
        path: '/category-type',
        handler: categoryTypes.create,
        options: {
            tags: ["api", "Category Types"],
            notes: "Create a new category type to manage categories and subcategories",
            description: "Create new category type",
            auth: { strategy: 'jwt', scope: ['admin', 'manage_category_types', 'create_category_type'] },
            validate: {
                headers: authorizedheaders,
                options: options,
                payload: categoryTypes_1.categoryTypeRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: validator
            },
            response: {
                status: {
                    200: categoryTypes_1.categoryTypeResponse,
                    400: resp400,
                    500: resp500
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/category-type/{id}',
        handler: categoryTypes.get,
        options: {
            tags: ["api", "Category Types"],
            notes: "Get category type by id",
            description: "Get category type by id",
            auth: false,
            validate: {
                headers: headers,
                params: categoryTypes_1.categoryTypeIdentity,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: validator
            },
            response: {
                status: {
                    200: categoryTypes_1.categoryTypeResponse,
                    400: resp400,
                    500: resp500
                }
            }
        }
    },
    {
        method: 'PATCH',
        path: '/category-type/{id}',
        handler: categoryTypes.update,
        options: {
            tags: ["api", "Category Types"],
            notes: "Update category type",
            description: "Update category type",
            auth: { strategy: 'jwt', scope: ['admin', 'manage_category_types', 'update_category_type'] },
            validate: {
                headers: authorizedheaders,
                options: options,
                params: categoryTypes_1.categoryTypeIdentity,
                payload: categoryTypes_1.categoryTypeRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: validator
            },
            response: {
                status: {
                    200: categoryTypes_1.categoryTypeResponse,
                    400: resp400,
                    500: resp500
                }
            }
        }
    },
    {
        method: 'DELETE',
        path: '/category-type/{id}',
        handler: categoryTypes.deleteCategoryType,
        options: {
            tags: ["api", "Category Types"],
            notes: "Delete category type by id",
            description: "Delete category type by id",
            auth: { strategy: 'jwt', scope: ['admin', 'manage_category_types', 'delete_category_type'] },
            validate: {
                headers: authorizedheaders,
                options: options,
                params: categoryTypes_1.categoryTypeIdentity,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: validator
            },
            response: {
                status: {
                    200: categoryTypes_1.categoryTypeDeleteResponse,
                    400: resp400,
                    500: resp500
                }
            }
        }
    },
    {
        method: 'PATCH',
        path: '/category-type/{id}/status',
        handler: categoryTypes.updateStatus,
        options: {
            tags: ["api", "Category Types"],
            notes: "Update category status",
            description: "Update category status",
            auth: { strategy: 'jwt', scope: ['admin', 'manage_category_types', 'update_category_type'] },
            validate: {
                headers: authorizedheaders,
                options: options,
                params: categoryTypes_1.categoryTypeIdentity,
                payload: categoryTypes_1.categoryTypeStatusRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: validator
            },
            response: {
                status: {
                    200: categoryTypes_1.categoryTypeResponse,
                    400: resp400,
                    500: resp500
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/category-type/list',
        handler: categoryTypes.list,
        options: {
            tags: ["api", "Category Types"],
            notes: "List category types with pagination",
            description: "List category types with pagination",
            auth: { strategy: 'jwt', scope: ['admin', 'manage_category_types', 'delete_category_type', 'update_category_type', 'create_category_type'] },
            validate: {
                headers: authorizedheaders,
                options: options,
                query: categoryTypes_1.listCategoryTypeRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: validator
            },
            response: {
                status: {
                    200: categoryTypes_1.listCategoryTypeResponse,
                    400: resp400,
                    500: resp500
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/category-types',
        handler: categoryTypes.getAll,
        options: {
            tags: ["api", "Category Types"],
            notes: "Get all category types",
            description: "Get all category types",
            auth: { strategy: 'jwt', scope: ['admin', 'manage_category_types', 'delete_category_type', 'update_category_type', 'create_category_type'] },
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
                    200: categoryTypes_1.categoryTypesResponse,
                    400: resp400,
                    500: resp500
                }
            }
        }
    }
];
