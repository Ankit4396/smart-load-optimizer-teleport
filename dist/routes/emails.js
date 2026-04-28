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
const emails = __importStar(require("../controllers/email"));
const emails_1 = require("../validators/emails");
module.exports = [
    {
        method: "POST",
        path: "/email/template",
        handler: emails.create,
        options: {
            tags: ["api", "Email"],
            notes: "Endpoint to define a new email template for portal",
            description: "Create email template",
            auth: { strategies: ['jwt'], scope: ["admin", "create_email_templates", "manage_email_templates"] },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                payload: emails_1.emailTemplateRequest,
                failAction: (req, h, err) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(err, req);
                }),
                validator: global_1.validator
            }
        }
    },
    {
        method: "GET",
        path: "/email/template/{id}",
        handler: emails.get,
        options: {
            tags: ["api", "Email"],
            notes: "Endpoint to get defined email template by code",
            description: "Get email template",
            auth: { strategies: ['jwt'], scope: ["admin", "view_email_templates", "list_email_templates", "manage_email_templates"] },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                params: emails_1.emailTemplteIdentity,
                failAction: (request, h, err) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(err, request);
                }),
                validator: global_1.validator
            }
        }
    },
    {
        method: "PATCH",
        path: "/email/template/{id}",
        handler: emails.update,
        options: {
            tags: ["api", "Email"],
            notes: "Endpoint to update defined email template for portal by id",
            description: "Update email template",
            auth: { strategies: ['jwt'], scope: ["admin", "update_email_templates", "manage_email_templates"] },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                params: emails_1.emailTemplteIdentity,
                payload: emails_1.emailTemplateRequest,
                failAction: (req, h, err) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(err, req);
                }),
                validator: global_1.validator
            }
        }
    },
    {
        method: "DELETE",
        path: "/email/template/{id}",
        handler: emails.deleteTemplate,
        options: {
            tags: ["api", "Email"],
            notes: "Endpoint to remove defined email template from the portal by id",
            description: "Remove email template",
            auth: { strategies: ['jwt'], scope: ["admin", "delete_email_templates", "manage_email_templates"] },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                params: emails_1.emailTemplteIdentity,
                failAction: (req, h, err) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(err, req);
                }),
                validator: global_1.validator
            }
        }
    },
    {
        method: "GET",
        path: "/email/template/list",
        handler: emails.list,
        options: {
            tags: ["api", "Email"],
            notes: "Endpoint to list defined email template for portal",
            description: "List email templates",
            auth: { strategies: ['jwt'], scope: ["admin", "list_email_templates", "manage_email_templates"] },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                query: emails_1.emailTemplateListRequest,
                failAction: (req, h, err) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(err, req);
                }),
                validator: global_1.validator
            }
        }
    },
    {
        method: "POST",
        path: "/email/send",
        handler: emails.sendMail,
        options: {
            tags: ["api", "Email"],
            notes: "Endpoint to send test email",
            description: "Send test email",
            auth: { strategies: ['jwt'], scope: ["admin", "manage_email_templates", "send_test_email"] },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                failAction: (req, h, err) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(err, req);
                }),
                validator: global_1.validator
            }
        }
    },
    {
        method: "PATCH",
        path: "/email/template/{id}/status",
        handler: emails.updateStatus,
        options: {
            tags: ["api", "Email"],
            notes: "Endpoint to update defined email template for portal by id",
            description: "Update email template status",
            auth: { strategies: ['jwt'], scope: ["admin", "update_email_templates_status", "manage_email_templates"] },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                params: emails_1.emailTemplteIdentity,
                payload: emails_1.emailTemplateStatusRequest,
                failAction: (req, h, err) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(err, req);
                }),
                validator: global_1.validator
            }
        }
    }
];
