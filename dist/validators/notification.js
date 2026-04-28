"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteScheduledRequest = exports.rescheduleRequest = exports.createScheduledNotificationRequest = exports.sendNotificationRequest = exports.uniqueIdentifierRequest = exports.notificationListRequest = void 0;
const routeImporter_1 = require("../config/routeImporter");
exports.notificationListRequest = routeImporter_1.Joi.object({
    page: routeImporter_1.Joi.number().optional().min(1).default(1)
        .description("Pagination page number."),
    perPage: routeImporter_1.Joi.number().integer().optional().min(1).default(+process.env.PAGINATION_LIMIT)
        .description("Number of results per page."),
    status: routeImporter_1.Joi.number().valid(0, 1).optional().allow(null).description("Active or expired"),
    scheduleStatus: routeImporter_1.Joi.number().valid(0, 1, 2).optional().allow(null).description("1->scheduled,0->cancelled,2->sent/processed"),
    isRead: routeImporter_1.Joi.number().valid(0, 1).optional().allow(null).description("0->Unread, 1-> Read"),
    type: routeImporter_1.Joi.string().valid('EVENT', 'CUSTOM').optional(),
    venue: routeImporter_1.Joi.string().optional().description("Venue name to filter notifications")
});
exports.uniqueIdentifierRequest = routeImporter_1.Joi.object({
    id: routeImporter_1.Joi.number().min(1).required(),
});
exports.sendNotificationRequest = routeImporter_1.Joi.object({
    // type: Joi.string().valid('EVENT').required(),
    title: routeImporter_1.Joi.string().required(),
    content: routeImporter_1.Joi.string().required(),
    scheduleDate: routeImporter_1.Joi.string(),
    scheduleTime: routeImporter_1.Joi.string(),
    venue: routeImporter_1.Joi.string().optional().description("Venue name to filter notifications")
});
exports.createScheduledNotificationRequest = routeImporter_1.Joi.object({
    title: routeImporter_1.Joi.string().required(),
    content: routeImporter_1.Joi.string().required(),
    scheduleDate: routeImporter_1.Joi.string().required().description('YYYY-MM-DD'),
    scheduleTime: routeImporter_1.Joi.string().required().description('HH:mm (24h)'),
    venue: routeImporter_1.Joi.string().optional().description("Venue name to filter notifications")
});
exports.rescheduleRequest = routeImporter_1.Joi.object({
    id: routeImporter_1.Joi.string().required(),
    scheduleDate: routeImporter_1.Joi.string().required().description('YYYY-MM-DD'),
    scheduleTime: routeImporter_1.Joi.string().required().description('HH:mm (24h)'),
    title: routeImporter_1.Joi.string().required(),
    content: routeImporter_1.Joi.string().required(),
    venue: routeImporter_1.Joi.string().optional().description("Venue name to filter notifications")
});
exports.deleteScheduledRequest = routeImporter_1.Joi.object({
    id: routeImporter_1.Joi.string().required()
});
