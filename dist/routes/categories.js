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
const category = __importStar(require("../controllers/categories"));
const { categoryIdentity, categoryTypeIdentity, categoryRequest, categoryResponse, categoriesResponse, categoryDeleteResponse, categoryStatusRequest, listCategoryRequest, listCategoryResponse, } = require("../validators/categories");
module.exports = [
    {
        method: 'POST',
        path: '/category',
        handler: category.create,
        options: {
            tags: ["api", "Category"],
            notes: "Create a new category to manage categories and subcategories",
            description: "Create new category",
            auth: { strategy: "jwt", scope: ['admin', 'manageCategoryTypes', 'createCategoryType'] },
            validate: {
                headers: authorizedheaders,
                options: options,
                payload: categoryRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: validator
            },
            response: {
                status: {
                    // 200: categoryResponse,
                    400: resp400,
                    500: resp500
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/category/{id}',
        handler: category.get,
        options: {
            tags: ["api", "Category"],
            notes: "Get category by id",
            description: "Get category",
            auth: { strategy: "jwt", scope: ['admin', 'manageCategory', 'createCategory'] },
            validate: {
                headers: authorizedheaders,
                options: options,
                params: categoryIdentity,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: validator
            },
            response: {
                status: {
                    // 200: categoryResponse,
                    400: resp400,
                    500: resp500
                }
            }
        }
    },
    {
        method: 'PATCH',
        path: '/category/{id}',
        handler: category.update,
        options: {
            tags: ["api", "Category"],
            notes: "Update category",
            description: "Update category",
            auth: { strategy: "jwt", scope: ['admin', 'manageCategory', 'updateCategory'] },
            validate: {
                headers: authorizedheaders,
                options: options,
                params: categoryIdentity,
                payload: categoryRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: validator
            },
            response: {
                status: {
                    // 200: categoryResponse,
                    400: resp400,
                    500: resp500
                }
            }
        }
    },
    {
        method: 'DELETE',
        path: '/category/{id}',
        handler: category.deleteCategory,
        options: {
            tags: ["api", "Category"],
            notes: "Delete category",
            description: "Delete category",
            auth: { strategy: "jwt", scope: ['admin', 'manageCategory', 'deleteCategory'] },
            validate: {
                headers: authorizedheaders,
                options: options,
                params: categoryIdentity,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: validator
            },
            response: {
                status: {
                    // 200: categoryDeleteResponse,
                    400: resp400,
                    500: resp500
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/categories/{categoryTypeCode}',
        handler: category.getCategories,
        options: {
            tags: ["api", "Category"],
            notes: "Get categories",
            description: "Get categories by type",
            auth: { strategy: "jwt", mode: 'optional' },
            validate: {
                headers: optional_authorizedheaders,
                options: options,
                params: categoryTypeIdentity,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: validator
            },
            response: {
                status: {
                    // 200: categoriesResponse,
                    400: resp400,
                    500: resp500
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/category/{categoryTypeCode}/tree',
        handler: category.getTree,
        options: {
            tags: ["api", "Category"],
            notes: "Get categories",
            description: "Get categories by type",
            auth: { strategy: "jwt", mode: 'optional' },
            validate: {
                headers: optional_authorizedheaders,
                options: options,
                params: categoryTypeIdentity,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: validator
            },
            response: {
                status: {
                    // 200: categoriesResponse,
                    400: resp400,
                    500: resp500
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/category/list',
        handler: category.list,
        options: {
            tags: ["api", "Category"],
            notes: "List categories",
            description: "List categories",
            auth: { strategy: "jwt", scope: ['admin', 'manage_category', 'delete_category', 'update_category', 'create_category'] },
            validate: {
                headers: authorizedheaders,
                options: options,
                query: listCategoryRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: validator
            },
            response: {
                status: {
                    // 200: listCategoryResponse,
                    400: resp400,
                    500: resp500
                }
            }
        }
    },
    {
        method: 'PATCH',
        path: '/category/{id}/status',
        handler: category.updateStatus,
        options: {
            tags: ["api", "Category"],
            notes: "Update category status",
            description: "Update category status",
            auth: { strategy: "jwt", scope: ['admin', 'manage_category', 'update_category'] },
            validate: {
                headers: authorizedheaders,
                options: options,
                params: categoryIdentity,
                payload: categoryStatusRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: validator
            },
            response: {
                status: {
                    // 200: categoryResponse,
                    400: resp400,
                    500: resp500
                }
            }
        }
    }
];
