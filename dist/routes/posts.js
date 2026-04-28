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
const post = __importStar(require("../controllers/posts"));
const global_1 = require("../validators/global");
const posts_1 = require("../validators/posts");
module.exports = [
    {
        method: 'POST',
        path: '/post',
        handler: post.create,
        options: {
            tags: ["api", "Posts"],
            notes: "Create a new post",
            description: "Create new post",
            auth: { strategy: 'jwt', scope: ['admin', 'manage_posts', 'create_post'] },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                payload: posts_1.postRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: global_1.validator
            },
            response: {
                status: {
                    // 200: postResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/post/{id}',
        handler: post.get,
        options: {
            tags: ["api", "Posts"],
            notes: "Get post by id",
            description: "Get post",
            auth: { strategy: 'jwt', scope: ['admin', 'manage_post', 'update_post'] },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                params: posts_1.postIdentity,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: global_1.validator
            },
            response: {
                status: {
                    // 200: postResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/post/public/{slug}',
        handler: post.getBySlug,
        options: {
            tags: ["api", "Posts"],
            notes: "Get post by slug",
            description: "Get post",
            auth: false,
            validate: {
                headers: global_1.headers,
                options: global_1.options,
                params: posts_1.postSulgIdentity,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: global_1.validator
            },
            response: {
                status: {
                    // 200: postResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: 'PATCH',
        path: '/post/{id}',
        handler: post.update,
        options: {
            tags: ["api", "Posts"],
            notes: "Update post",
            description: "Update post",
            auth: { strategy: 'jwt', scope: ['admin', 'manage_post', 'update_post'] },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                params: posts_1.postIdentity,
                payload: posts_1.postRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: global_1.validator
            },
            response: {
                status: {
                    // 200: postResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: 'DELETE',
        path: '/post/{id}',
        handler: post.deletePost,
        options: {
            tags: ["api", "Posts"],
            notes: "Delete post",
            description: "Delete post",
            auth: { strategy: 'jwt', scope: ['admin', 'manage_post', 'delete_post'] },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                params: posts_1.postIdentity,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: global_1.validator
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
    {
        method: 'GET',
        path: '/post/list',
        handler: post.list,
        options: {
            tags: ["api", "Posts"],
            notes: "List posts",
            description: "List posts",
            auth: { strategy: 'jwt', scope: ['admin', 'manage_post', 'delete_post', 'update_post', 'create_post'] },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                query: posts_1.listPostRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: global_1.validator
            },
            response: {
                status: {
                    // 200: listPostResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/post/public-list',
        handler: post.listPublicPost,
        options: {
            tags: ["api", "Posts"],
            notes: "List posts",
            description: "List posts",
            auth: false,
            validate: {
                headers: global_1.headers,
                options: global_1.options,
                query: posts_1.listPostPublicRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: global_1.validator
            },
            response: {
                status: {
                    // 200: listPostResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: 'PATCH',
        path: '/post/{id}/status',
        handler: post.updateStatus,
        options: {
            tags: ["api", "Posts"],
            notes: "Update post status",
            description: "Update post status",
            auth: { strategy: 'jwt', scope: ['admin', 'manage_post', 'update_post'] },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                params: posts_1.postIdentity,
                payload: posts_1.postStatusRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: global_1.validator
            },
            response: {
                status: {
                    // 200: postResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    }
];
