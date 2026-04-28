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
const Controller = __importStar(require("../controllers/shops"));
const shops_1 = require("../validators/shops");
const global_1 = require("../validators/global");
module.exports = [
    {
        method: 'POST',
        path: '/shop',
        handler: Controller.create,
        options: {
            tags: ["api", "Shop"],
            notes: "Creates a new shop with the provided details. Requires JWT authentication with either 'admin' or 'seller' scope. Validates and processes the request to create a shop.",
            description: "Create shop with general details",
            auth: { strategy: "jwt", scope: ["admin", "seller"] },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                payload: shops_1.createShopRequest,
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
        path: '/shop/{id}',
        handler: Controller.update,
        options: {
            tags: ["api", "Shop"],
            notes: "Updates the details of an existing shop identified by its ID. Requires JWT authentication with either 'admin' or 'seller' scope. The request must include the shop ID as a path parameter and the updated details in the payload.",
            description: "Update shop with general details",
            auth: { strategy: "jwt", scope: ["admin", "seller"] },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                payload: shops_1.createShopRequest,
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
        path: '/shop/{id}',
        handler: Controller.get,
        options: {
            tags: ["api", "Shop"],
            notes: "Retrieves the details of a specific shop identified by its ID. Requires JWT authentication. The shop ID must be provided as a path parameter.",
            description: "Fetch details of a shop by its ID.",
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
        path: '/shops',
        handler: Controller.list,
        options: {
            tags: ["api", "Shop"],
            notes: "Retrieves a list of shops with optional filters for user ID, search text, and pagination. Requires JWT authentication.",
            description: "Fetch a list of shops based on optional query parameters",
            auth: { strategy: "jwt" },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                query: shops_1.listShopRequest,
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
        path: '/user/{id}/shops',
        handler: Controller.listUserShops,
        options: {
            tags: ["api", "Shop"],
            notes: "Retrieves a list of shops associated with a specific user ID. Requires JWT authentication.",
            description: "Fetch a list of shops for a user identified by their user ID.",
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
        path: '/shops/user',
        handler: Controller.listUserShops,
        options: {
            tags: ["api", "Shop"],
            notes: "Retrieves a list of shops associated with the currently authenticated user. Requires JWT authentication.",
            description: "Fetch a list of shops belonging to the currently logged-in user.",
            auth: { strategy: "jwt" },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
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
        path: '/shop/{id}/status',
        handler: Controller.changeStatus,
        options: {
            tags: ["api", "Shop"],
            notes: "Updates the status of a specific shop identified by its ID. Requires JWT authentication and admin or seller privileges.",
            description: "Change the status of a shop, where the status can be set to active, inactive, or any other defined state.",
            auth: { strategy: "jwt" },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                payload: global_1.changeStatusRequest,
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
        method: 'PATCH',
        path: '/shop/{id}/featured',
        handler: Controller.changefeatured,
        options: {
            tags: ["api", "Shop"],
            notes: "Updates the featured status of a specific shop identified by its ID. Requires JWT authentication and admin or seller privileges.",
            description: "Toggle the featured status of a shop. The endpoint sets the shop as featured or not featured based on the provided data.",
            auth: { strategy: "jwt" },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                payload: global_1.changeStatusRequest,
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
        method: 'PATCH',
        path: '/shop/{id}/settings',
        handler: Controller.shopSettings,
        options: {
            tags: ["api", "Shop"],
            notes: "Updates the settings of a specific shop identified by its ID. Requires JWT authentication and admin or seller privileges.",
            description: "Update the settings of a shop, including various configurations such as slot settings and other shop-specific options.",
            auth: { strategy: "jwt" },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                payload: shops_1.shopSettingsRequest,
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
        method: 'POST',
        path: '/shop/generate-url',
        handler: Controller.generateUrlForShop,
        options: {
            tags: ["api", "Shop"],
            notes: "Generates a URL based on the provided subdomain code for a shop. Requires JWT authentication.",
            description: "Generates a unique URL for a shop using the given subdomain code. The URL will be used for accessing the shop's page.",
            auth: { strategy: "jwt" },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                payload: shops_1.generateUrlRequest,
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
