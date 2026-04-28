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
const global_1 = require("../validators/global");
const attachments = __importStar(require("../controllers/attachements"));
const attachments_1 = require("../validators/attachments");
module.exports = [
    {
        method: "POST",
        path: "/attachment/upload",
        handler: attachments.upload,
        options: {
            tags: ["api", "Attachment"],
            notes: "Endpoint to upload single/multiple attachments",
            description: "Upload file",
            auth: { strategies: ['jwt'], mode: 'optional' },
            validate: {
                headers: global_1.optional_authorizedheaders,
                options: global_1.options,
                failAction: (req, h, err) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(err, req);
                }),
                payload: attachments_1.uploadRequest,
                validator: global_1.validator,
            },
            response: {
                status: {
                    200: attachments_1.uploadResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            },
            payload: {
                maxBytes: 125000000,
                output: "stream",
                parse: true,
                multipart: true,
                timeout: 600000,
            },
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form',
                },
            }
        },
    },
    {
        method: "GET",
        path: "/attachment/{uniqueName}/download",
        handler: attachments.download,
        options: {
            tags: ["api", "Attachment"],
            notes: "Endpoint to download attachment",
            description: "Download file",
            auth: false,
            validate: {
                headers: global_1.headers,
                options: global_1.options,
                params: attachments_1.requestWithIdentifier,
                failAction: (req, h, err) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(err, req);
                }),
                validator: global_1.validator,
            },
            response: {
                status: {
                    //200: UD,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            },
        },
    },
    {
        method: "GET",
        path: "/attachment/{uniqueName}",
        handler: attachments.view,
        options: {
            tags: ["api", "Attachment"],
            notes: "Endpoint to view attachment",
            description: "View file",
            auth: false,
            validate: {
                headers: global_1.headers,
                options: global_1.options,
                params: attachments_1.requestWithIdentifier,
                failAction: (req, h, err) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(err, req);
                }),
                validator: routeImporter_1.Joi,
            },
            response: {
                status: {
                    //200: UD,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            },
        },
    },
    {
        method: "DELETE",
        path: "/attachment/{uniqueName}",
        handler: attachments.deleteAttachment,
        options: {
            tags: ["api", "Attachment"],
            notes: "Endpoint to remove attachment",
            description: "Delete file",
            auth: { strategies: ['jwt'] },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                params: attachments_1.requestWithIdentifier,
                failAction: (req, h, err) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(err, req);
                }),
                validator: global_1.validator,
            },
            response: {
                status: {
                    //200: UD,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            },
        },
    },
    {
        method: "DELETE",
        path: "/attachments/{attachmentId}",
        handler: attachments.deleteAttachmentById,
        options: {
            tags: ["api", "Attachment"],
            notes: "Endpoint to remove attachment",
            description: "Delete file",
            auth: { strategies: ['jwt'] },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                params: attachments_1.requestWithIdIdentifier,
                failAction: (req, h, err) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(err, req);
                }),
                validator: global_1.validator,
            },
            response: {
                status: {
                    //200: UD,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            },
        },
    },
    {
        method: "GET",
        path: "/attachment/verifyS3Upload",
        handler: attachments.verifyS3Upload,
        options: {
            tags: ["api", "Attachment"],
            notes: "Endpoint to verify s3 upload made using signed url",
            description: "verify s3 upload",
            auth: false,
            validate: {
                headers: global_1.headers,
                options: {
                    abortEarly: false,
                },
                query: {
                    key: routeImporter_1.Joi.string().required(),
                },
                failAction: (req, h, err) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(err, req);
                }),
                validator: global_1.validator,
            },
            response: {
                status: {
                    // 200: loginResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        },
    },
];
