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
const Controller = __importStar(require("../controllers/documents"));
const documents_1 = require("../validators/documents");
// import { otpResponse, userResponse } from "../validators/users";
const global_1 = require("../validators/global");
module.exports = [
    {
        method: 'POST',
        path: '/document/generate',
        handler: Controller.generateDocument,
        options: {
            tags: ["api", "Documents"],
            notes: "Allows admins to submit required documents for seller account approval. Ensures that all necessary documentation is provided for processing.",
            description: "Submit documents for seller account approval.",
            auth: { strategy: "jwt", scope: ["admin"] },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                payload: documents_1.generateDocumentRequest,
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
        path: '/document/sign',
        handler: Controller.signDocument,
        options: {
            tags: ["api", "Documents"],
            notes: "Allows sellers to sign and submit the necessary documents required for account verification or approval. Ensures that the document signing process is completed securely.",
            description: "Submit signed documents for seller account verification.",
            auth: { strategy: "jwt", scope: ["seller"] },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                payload: documents_1.signDocumentRequest,
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
        method: "GET",
        path: "/document",
        handler: Controller.getDocuments,
        options: {
            tags: ["api", "Documents"],
            notes: "Retrieves a list of documents available for the current user. This endpoint allows both admin and seller users to view documents related to their accounts or submissions.",
            description: "List all documents available to the user, including those submitted and those required for account verification.",
            auth: { strategies: ['jwt'], scope: ["admin", "seller"] },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                query: documents_1.getDocumentListRequest,
                failAction: (req, h, err) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(err, req);
                }),
                validator: global_1.validator
            }
        }
    },
    {
        method: "GET",
        path: "/document/{slug}",
        handler: Controller.generateDocumentHtmlPage,
        options: {
            tags: ["api", "Documents"],
            notes: "Generates and returns an HTML page for a specific document identified by the slug parameter. This endpoint is used to view detailed information or previews of documents.",
            description: "Fetches the HTML content for a document based on the provided slug.",
            auth: false,
            validate: {
                headers: global_1.headers,
                options: global_1.options,
                params: documents_1.slugRequest,
                // query: {
                //     time: Joi.string().optional().allow(null).default(null).error(errors => { return Common.routeError(errors, 'SLUG_MUST_BE_A_VALID_VALUE') }),
                // },
                failAction: (req, h, err) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(err, req);
                }),
                validator: global_1.validator
            }
        }
    },
    {
        method: "GET",
        path: "/user/{id}/document",
        handler: Controller.getDocuments,
        options: {
            tags: ["api", "Documents"],
            notes: "Fetches a list of documents associated with a specific user identified by the user ID. This endpoint provides details on documents submitted or required for the user's profile.",
            description: "Retrieves and lists documents for a specific user based on their user ID.",
            auth: { strategies: ['jwt'], scope: ["admin"] },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                params: global_1.identifierRequest,
                query: documents_1.getDocumentListRequest,
                failAction: (req, h, err) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(err, req);
                }),
                validator: global_1.validator
            }
        }
    },
    {
        method: 'POST',
        path: '/document/verify-token',
        handler: Controller.verifySignDocument,
        options: {
            tags: ["api", "Documents"],
            notes: "Endpoint for verifying a document signature using an OTP. This process is essential for confirming the authenticity of signed documents.",
            description: "This endpoint verifies the document signature by validating an OTP (One-Time Password) provided by the user.",
            auth: false,
            validate: {
                headers: global_1.headers,
                options: global_1.options,
                payload: documents_1.verifyTokenRequest,
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
        path: '/document/user/{id}/regenerate',
        handler: Controller.reGenerateDocument,
        options: {
            tags: ["api", "Documents"],
            notes: "Regenerate a document for a user based on the provided user ID. This endpoint is used when a new document is needed or an existing document needs to be updated.",
            description: "This endpoint regenerates a document for a specified user.",
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
