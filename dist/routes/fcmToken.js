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
const FCM = __importStar(require("../controllers/fcmToken"));
const fcmToken_1 = require("../validators/fcmToken");
const global_1 = require("../validators/global");
const isAuthorized = false;
module.exports = [
    {
        method: 'GET',
        path: '/fcmTokens',
        handler: FCM.getFcmToken,
        options: {
            tags: [
                "api", "Fcm"
            ],
            notes: "Get user FCM token",
            description: "Get user FCM token",
            // auth: false,
            auth: { strategies: ['jwt'], scope: ['user', 'admin'] },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                failAction: (request, h, err) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(err, request);
                }),
                validator: routeImporter_1.Joi
            },
            response: {
                status: {
                    // 200: updateFcmTokenResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: 'PATCH',
        path: '/fcmToken',
        handler: FCM.updateFcmToken,
        options: {
            tags: [
                "api", "Fcm"
            ],
            notes: "Update user FCM token",
            description: "Update user FCM token",
            auth: { strategies: ['jwt'], scope: ['user', 'admin'] },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                payload: fcmToken_1.updateFcmToken,
                failAction: (request, h, err) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(err, request);
                }),
                validator: routeImporter_1.Joi
            },
            response: {
                status: {
                    // 200: updateFcmTokenResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: 'DELETE',
        path: '/destroySession',
        handler: FCM.destroySession,
        options: {
            tags: [
                "api", "Fcm"
            ],
            notes: "Destroy user session",
            description: "Destroy user session",
            // auth: false,
            auth: { strategies: ['jwt'], scope: ['user', 'admin'] },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                failAction: (request, h, err) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(err, request);
                }),
                validator: routeImporter_1.Joi
            },
            response: {
                status: {
                    // 200: updateFcmTokenResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
];
