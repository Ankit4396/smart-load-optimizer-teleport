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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const routeImporter_1 = require("../config/routeImporter");
const global_1 = require("../validators/global");
const notification = __importStar(require("../controllers/notifications"));
const moment_1 = __importDefault(require("moment"));
const notification_1 = require("../validators/notification");
module.exports = [
    {
        method: "GET",
        path: "/notification/list",
        handler: notification.getNotifications,
        options: {
            tags: ["api", "Notification"],
            notes: "Endpoint to get notification",
            description: "Get notification",
            auth: { strategies: ['jwt'], scope: ['admin', 'user'] },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                query: notification_1.notificationListRequest,
                failAction: (req, h, err) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(err, req);
                }),
                validator: global_1.validator
            }
        }
    },
    {
        method: "POST",
        path: "/admin/send/notification",
        handler: notification.notifyUsersByAdmin,
        options: {
            tags: ["api", "Notification"],
            notes: "Endpoint to send event notification manually",
            description: "Trigger event notification",
            auth: { strategies: ['jwt'], scope: ['admin'] },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                payload: notification_1.sendNotificationRequest,
                failAction: (req, h, err) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(err, req);
                }),
                validator: global_1.validator
            }
        }
    },
    {
        method: "POST",
        path: "/admin/scheduled/notification",
        handler: notification.createScheduledNotification,
        options: {
            tags: ["api", "Notification"],
            notes: "Create a scheduled notification",
            description: "Schedule notification for later",
            auth: { strategies: ['jwt'], scope: ['admin'] },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                payload: notification_1.createScheduledNotificationRequest,
                failAction: (req, h, err) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(err, req);
                }),
                validator: global_1.validator
            }
        }
    },
    {
        method: "PATCH",
        path: "/admin/scheduled/notification/reschedule",
        handler: (request, h) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { id, scheduleDate, scheduleTime, title, content } = request.payload;
                const { rescheduleScheduledNotification } = require('../controllers/notifications');
                const newDate = new Date(`${scheduleDate}T${scheduleTime}:00Z`);
                const scheduledAtMoment = moment_1.default.tz(`${scheduleDate}T${scheduleTime}`, "YYYY-MM-DDTHH:mm", "America/Los_Angeles");
                const scheduledAt = scheduledAtMoment.toDate();
                const updated = yield rescheduleScheduledNotification(id, scheduledAt, title, content);
                return h.response({ message: 'SCHEDULE_UPDATED', data: { id: updated.id } }).code(200);
            }
            catch (err) {
                return routeImporter_1.Common.FailureError(err, request);
            }
        }),
        options: {
            tags: ["api", "Notification"],
            auth: { strategies: ['jwt'], scope: ['admin'] },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                payload: notification_1.rescheduleRequest,
                failAction: (req, h, err) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(err, req);
                }),
                validator: global_1.validator
            }
        }
    },
    {
        method: "DELETE",
        path: "/admin/scheduled/notification",
        handler: (request, h) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { id } = request.query;
                const { deleteScheduledNotification } = require('../controllers/notifications');
                yield deleteScheduledNotification(id);
                return h.response({ message: 'SCHEDULE_CANCELLED' }).code(200);
            }
            catch (err) {
                return routeImporter_1.Common.FailureError(err, request);
            }
        }),
        options: {
            tags: ["api", "Notification"],
            auth: { strategies: ['jwt'], scope: ['admin'] },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                query: notification_1.deleteScheduledRequest,
                failAction: (req, h, err) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(err, req);
                }),
                validator: global_1.validator
            }
        }
    },
    {
        method: "PATCH",
        path: "/notification/mark/read",
        handler: notification.markNotificationRead,
        options: {
            tags: ["api", "Notification"],
            notes: "Endpoint to send event notification manually",
            description: "Trigger event notification",
            auth: { strategies: ['jwt'], scope: ['admin', 'user'] },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                query: notification_1.uniqueIdentifierRequest,
                failAction: (req, h, err) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(err, req);
                }),
                validator: global_1.validator
            }
        }
    },
];
