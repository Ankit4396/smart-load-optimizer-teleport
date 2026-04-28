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
exports.markNotificationRead = exports.getNotifications = exports.notifyUsersByAdmin = exports.updateCustomNotificationStatus = exports.updateNotificationStatus = exports.sendEventNotification = exports.sendNotification = exports.generateNotification = void 0;
exports.getAccessToken = getAccessToken;
exports.fireNotification = fireNotification;
exports.convertToCron = convertToCron;
exports.scheduleDynamicNotification = scheduleDynamicNotification;
exports.processScheduledNotification = processScheduledNotification;
exports.toCronExpressionFromDate = toCronExpressionFromDate;
exports.scheduleTaskForRecord = scheduleTaskForRecord;
exports.createScheduledNotification = createScheduledNotification;
exports.rescheduleScheduledNotification = rescheduleScheduledNotification;
exports.deleteScheduledNotification = deleteScheduledNotification;
exports.loadScheduledNotifications = loadScheduledNotifications;
exports.scheduleTaskForMergedNotification = scheduleTaskForMergedNotification;
exports.createMergedScheduledNotificationsForAdmin = createMergedScheduledNotificationsForAdmin;
exports.processScheduledNotifications = processScheduledNotifications;
const models_1 = require("../models");
const dbImporter_1 = require("../config/dbImporter");
const Common = __importStar(require("./common"));
const moment_1 = __importDefault(require("moment"));
const handlebars = __importStar(require("handlebars"));
const google_auth_library_1 = require("google-auth-library");
const axios_1 = __importDefault(require("axios"));
const he_1 = __importDefault(require("he"));
const node_cron_1 = __importDefault(require("node-cron"));
const uuid_1 = require("uuid");
// In-memory registry of scheduled tasks keyed by ScheduledNotification.id
// NEW: key is mergedNotificationId (string UUID)
const scheduledTasks = new Map();
// We'll store scheduling data on the existing Notification model (Models.Notification)
// export async function getAccessToken(): Promise<string> {
//   const auth = new GoogleAuth({
//     keyFile: path.join(__dirname, process.env.GOOGLE_APPLICATION_CREDENTIALS!),
//     scopes: ["https://www.googleapis.com/auth/firebase.messaging"],
//   });
//   const client = await auth.getClient();
//   const accessTokenResponse = await client.getAccessToken();
//   return accessTokenResponse?.token || "";
// }
function getAccessToken() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
            throw new Error("GOOGLE_APPLICATION_CREDENTIALS is not set in .env");
        }
        // Parse JSON from .env
        let serviceAccount;
        console.log("process.env.GOOGLE_APPLICATION_CREDENTIALS====>", process.env.GOOGLE_APPLICATION_CREDENTIALS);
        try {
            serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
        }
        catch (err) {
            throw new Error("Invalid JSON in GOOGLE_APPLICATION_CREDENTIALS env variable");
        }
        const auth = new google_auth_library_1.GoogleAuth({
            credentials: serviceAccount, // use parsed JSON instead of keyFile
            scopes: ["https://www.googleapis.com/auth/firebase.messaging"],
        });
        const client = yield auth.getClient();
        const accessTokenResponse = yield client.getAccessToken();
        return (accessTokenResponse === null || accessTokenResponse === void 0 ? void 0 : accessTokenResponse.token) || "";
    });
}
function fireNotification(notificationData, sessionIds) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        // const serviceAccountPath = path.join(__dirname, process.env.GOOGLE_APPLICATION_CREDENTIALS!);
        // const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
        // const projectId = serviceAccount.project_id;
        const projectId = process.env.FIREBASE_PROJECT_ID;
        const url = `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`;
        const accessToken = yield getAccessToken();
        const headers = {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json; charset=UTF-8",
        };
        for (const token of sessionIds) {
            console.log("sessionIds====>", token);
            try {
                const message = {
                    message: {
                        token,
                        notification: {
                            title: notificationData.title,
                            body: notificationData.body,
                        },
                        data: {
                            title: notificationData.title,
                            body: notificationData.body,
                            data: JSON.stringify(notificationData.data),
                        },
                    },
                };
                console.log("message=====>", message);
                const response = yield axios_1.default.post(url, message, { headers });
                console.log("Push sent:", response.data);
            }
            catch (error) {
                if (axios_1.default.isAxiosError(error)) {
                    console.error("Error sending message:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
                    console.error("Error sending message 1:", JSON.stringify((_b = error.response) === null || _b === void 0 ? void 0 : _b.data));
                }
                else {
                    console.error("Unexpected error:", error);
                }
            }
        }
    });
}
const generateNotification = (type, replacements, users, data, language) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notificationInfo = yield models_1.Models.NotificationTemplate.findOne({
            where: { type },
            include: [
                {
                    model: models_1.Models.NotificationTemplateContent,
                    as: "content",
                    include: [{ model: models_1.Models.Language, where: { code: language } }],
                },
                {
                    required: true,
                    model: models_1.Models.NotificationTemplateContent,
                    as: "defaultContent",
                    include: [
                        { model: models_1.Models.Language, where: { code: process.env.DEFAULT_LANGUAGE_CODE } },
                    ],
                },
            ],
        });
        if (!notificationInfo) {
            return { success: false, message: "INVALID_NOTIFICATION_TYPE", data: null };
        }
        // Pick correct content (prefer requested language, fallback to default)
        const contentData = notificationInfo.content || notificationInfo.defaultContent;
        const titleTemplate = handlebars.compile((contentData === null || contentData === void 0 ? void 0 : contentData.title) || "");
        const contentTemplate = handlebars.compile((contentData === null || contentData === void 0 ? void 0 : contentData.content) || "");
        // const compiledTitle = titleTemplate(replacements);
        // const compiledContent = contentTemplate(replacements);
        const compiledTitle = he_1.default.decode(titleTemplate(replacements));
        const compiledContent = he_1.default.decode(contentTemplate(replacements));
        // Create DB records for all users
        const notifications = yield Promise.all(users.map((userId) => models_1.Models.Notification.create({
            userId,
            notificationTemplateId: notificationInfo.id,
            type,
            title: (contentData === null || contentData === void 0 ? void 0 : contentData.title) || "",
            content: (contentData === null || contentData === void 0 ? void 0 : contentData.content) || "",
            replacements,
            compiledTitle,
            compiledContent,
            notificationObject: data,
            scheduleStatus: 2, // mark as sent
        })));
        return { success: true, message: "REQUEST_SUCCESSFULL", data: notifications };
    }
    catch (error) {
        console.error("generateNotification error:", error);
        return { success: false, message: "NOTIFICATION_CREATION_FAILED", data: null };
    }
});
exports.generateNotification = generateNotification;
const sendNotification = (type, replacements, users, data, language) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // 1. Generate + Save Notification in DB
        const notificationResult = yield (0, exports.generateNotification)(type, replacements, users, data, language);
        if (!notificationResult.success || !notificationResult.data) {
            return { success: false, message: "INVALID_NOTIFICATION", data: null };
        }
        // 2. Normalize Sequelize result
        const notification = Array.isArray(notificationResult.data)
            ? notificationResult.data[0]
            : notificationResult.data;
        if (!notification) {
            return { success: false, message: "NOTIFICATION_NOT_CREATED", data: null };
        }
        // 3. Prepare push payload (force string type)
        const notificationData = {
            title: (_a = notification.compiledTitle) !== null && _a !== void 0 ? _a : "",
            body: (_b = notification.compiledContent) !== null && _b !== void 0 ? _b : "",
            data,
        };
        // 4. Fetch FCM tokens for users
        const devices = yield models_1.Models.UserSession.findAll({
            where: { status: 1, userId: { [dbImporter_1.Op.in]: users } },
            attributes: ["deviceToken"],
            raw: true,
        });
        const sessionIds = devices.map((d) => d.deviceToken).filter((token) => Boolean(token));
        if (!sessionIds.length) {
            return { success: true, message: "NO_DEVICES_FOUND", data: notification };
        }
        // 5. Fire Notification to all devices
        if (type === 'CUSTOM') {
            yield fireNotification(notificationData, sessionIds);
        }
        return { success: true, message: "NOTIFICATION_SENT", data: notification };
    }
    catch (error) {
        console.error("sendNotification error:", error);
        return { success: false, message: "NOTIFICATION_FAILED", data: null };
    }
});
exports.sendNotification = sendNotification;
// export const generateNotification = async(type: string, replacements: { [key: string]: any }, users: number[], data: { [key: string]: any }, language: string) => {
//     try {
//         const notificationInfo = await Models.NotificationTemplate.findOne({
//             where: { type: type },
//             include: [
//                 {
//                     model: Models.NotificationTemplateContent, as: "content",
//                     include: [
//                         {
//                             model: Models.Language, where: { code: language }
//                         }
//                     ]
//                 },
//                 {
//                     required: true,
//                     model: Models.NotificationTemplateContent, as: "defaultContent",
//                     include: [
//                         {
//                             model: Models.Language, where: { code: process.env.DEFAULT_LANGUAGE_CODE }
//                         }
//                     ]
//                 }
//             ]
//         });
//         if(!notificationInfo) {
//             return { success: false, message: "INVALID_NOTIFICATION_TYPE", data: null }
//         }
//         const title = notificationInfo.content ? notificationInfo.content.title : notificationInfo.defaultContent!.title;
//         const content = notificationInfo.content ? notificationInfo.content.content : notificationInfo.defaultContent!.content;
//         let titleTemplate = handlebars.compile(title);
//         let contentTemplate = handlebars.compile(content);
//         const compiledTitle = titleTemplate(replacements);
//         const compiledContent = contentTemplate(replacements);
//         const createNotification = await Models.Notification.create({
//             userId: users[0],
//             notificationTemplateId: notificationInfo.id,
//             type: type,
//             title: title,
//             content: content,
//             replacements: replacements,
//             compiledTitle: compiledTitle,
//             compiledContent: compiledContent,
//             notificationObject: data
//         });
//         return { success: true, message: "REQUEST_SUCCESSFULL", data: createNotification }
//     } catch (error) {
//         console.log(error)
//     }
// }
const sendEventNotification = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const timezone = "America/Los_Angeles";
        const pstStartOfDay = moment_1.default.tz(timezone).startOf("day").utc().toISOString();
        const pstEndOfDay = moment_1.default.tz(timezone).endOf("day").utc().toISOString();
        // Fetch events scheduled for today
        const eventDetails = yield models_1.Models.Events.findAll({
            where: dbImporter_1.Sequelize.where(dbImporter_1.Sequelize.literal(`JSON_UNQUOTE(JSON_EXTRACT(event_meta_data, '$.eventStart'))`), {
                [dbImporter_1.Op.between]: [pstStartOfDay, pstEndOfDay],
            }),
        });
        if (!eventDetails.length) {
            console.log("NO_EVENTS_FOR_TODAY");
            return;
        }
        // Get all active users
        const allUserInfo = yield models_1.Models.User.findAll({
            where: { status: 1 },
            include: [
                {
                    attributes: ["name"],
                    model: models_1.Models.UserProfile,
                    as: "userProfile",
                },
            ],
        });
        if (!allUserInfo.length) {
            console.log("NO_ACTIVE_USERS");
            return;
        }
        for (const user of allUserInfo) {
            const userName = (((_a = user.userProfile) === null || _a === void 0 ? void 0 : _a.name) || "User").trim().split(" ")[0];
            for (const event of eventDetails) {
                const { id = null, link = "", city = "", title = "", venue = "", eventday = "", eventtime = "", image = "", } = (event.eventMetaData || {});
                yield (0, exports.sendNotification)("EVENT", { userName, title, city, venue, eventtime, image }, [user === null || user === void 0 ? void 0 : user.id], { id, link, city, title, venue, eventday, eventtime, image }, "en");
            }
        }
        console.log("Notifications sent successfully.");
    }
    catch (err) {
        console.error("FAILED_TO_SEND_NOTIFICATION", err);
    }
});
exports.sendEventNotification = sendEventNotification;
const updateNotificationStatus = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const timezone = "America/Los_Angeles";
        const pstYesterdayStart = moment_1.default.tz(timezone).subtract(1, "day").startOf("day").utc().toISOString();
        const pstYesterdayEnd = moment_1.default.tz(timezone).subtract(1, "day").endOf("day").utc().toISOString();
        const whereClause = {
            type: 'EVENT',
            createdAt: {
                [dbImporter_1.Op.between]: [pstYesterdayStart, pstYesterdayEnd],
            },
        };
        // Update notifications of type 'EVENT' created yesterday
        yield models_1.Models.Notification.update({ status: 0 }, { where: whereClause });
        console.log(`Notifications updated successfully`);
    }
    catch (err) {
        console.error("FAILED_TO_UPDATE_NOTIFICATION", err);
    }
});
exports.updateNotificationStatus = updateNotificationStatus;
const updateCustomNotificationStatus = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const timezone = "America/Los_Angeles";
        const now = moment_1.default.tz(timezone).utc().toDate();
        const whereClause = {
            type: 'CUSTOM',
            status: 1,
            scheduledAt: {
                [dbImporter_1.Op.lte]: now,
            },
        };
        const customNotif = yield models_1.Models.Notification.findAll({ where: whereClause });
        console.log("customNotif====>", customNotif);
        // Update notifications of type 'CUSTOM' sent yesterday
        yield models_1.Models.Notification.update({ status: 0 }, { where: whereClause });
        console.log(`Custom Notifications updated successfully`);
    }
    catch (err) {
        console.error("FAILED_TO_UPDATE_NOTIFICATION", err);
    }
});
exports.updateCustomNotificationStatus = updateCustomNotificationStatus;
const notifyUsersByAdmin = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { title, content, scheduleDate, scheduleTime, venue } = request.payload;
        const isScheduled = scheduleDate && scheduleTime;
        const timezone = "America/Los_Angeles";
        if (isScheduled) {
            const result = yield createMergedScheduledNotificationsForAdmin({
                title,
                content,
                scheduleDate,
                scheduleTime,
                timezone: "America/Los_Angeles",
                createdBy: ((_a = request.auth.credentials.userData) === null || _a === void 0 ? void 0 : _a.id) || null,
                language: request.headers.language,
                venue,
            });
            if (!result.success) {
                return Common.generateError(request, 400, result.message, {});
            }
            return h
                .response({
                message: "Notification Scheduled",
                mergedNotificationId: result.mergedNotificationId,
            })
                .code(200);
        }
        // Get all active users
        const allUserInfo = yield models_1.Models.User.findAll({
            where: { status: 1 },
            include: [
                {
                    attributes: ["name"],
                    model: models_1.Models.UserProfile,
                    as: "userProfile",
                },
            ],
        });
        if (!allUserInfo.length) {
            return Common.generateError(request, 400, "NO_ACTIVE_USERS", {});
        }
        // Send notifications to all users
        yield Promise.all(allUserInfo.map((user) => __awaiter(void 0, void 0, void 0, function* () {
            if (!user.id)
                return;
            yield (0, exports.sendNotification)("CUSTOM", { title, content }, [user.id], {}, request.headers.language);
        })));
        return h.response({ message: request.i18n.__("REQUEST_SUCCESSFULL") }).code(200);
    }
    catch (err) {
        return Common.generateError(request, 500, "FAILED_TO_SEND_NOTIFICATION", err);
    }
});
exports.notifyUsersByAdmin = notifyUsersByAdmin;
const getNotifications = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = request.auth.credentials.userData.id;
        const permissions = request.auth.credentials.userData.permissions;
        const { type, status, isRead, scheduleStatus, page = 1, perPage = 20 } = request.query;
        const whereClause = { userId: userId };
        if (type && permissions.includes("admin")) {
            whereClause.type = type;
        }
        if (status !== undefined) {
            whereClause.status = status;
        }
        if (isRead !== undefined) {
            whereClause.isRead = isRead;
        }
        const nowUtc = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" }));
        console.log("nowUtc====>", permissions, whereClause);
        if (permissions.includes("user")) {
            whereClause[dbImporter_1.Op.and] = [
                {
                    [dbImporter_1.Op.or]: [
                        { scheduleStatus: { [dbImporter_1.Op.ne]: 1 } },
                        { scheduledAt: { [dbImporter_1.Op.lte]: nowUtc } }
                    ]
                }
            ];
        }
        if (scheduleStatus !== undefined && permissions.includes("admin")) {
            whereClause.scheduleStatus = scheduleStatus;
        }
        if (permissions && permissions.includes('user')) {
            whereClause.userId = userId;
        }
        // Fetch all notifications matching filters
        const allNotifications = yield models_1.Models.Notification.findAll({
            where: whereClause,
            order: [["createdAt", "DESC"]],
        });
        // Pagination
        const pageNum = Number(page);
        const pageSize = Number(perPage);
        const total = allNotifications.length;
        const totalPages = Math.ceil(total / pageSize);
        const paginatedNotifications = allNotifications.slice((pageNum - 1) * pageSize, pageNum * pageSize);
        return h.response({
            message: "Notifications fetched successfully",
            responseData: paginatedNotifications,
            pagination: {
                total,
                page: pageNum,
                perPage: pageSize,
                totalPages,
            },
        }).code(200);
    }
    catch (err) {
        return Common.generateError(request, 500, "FAILED_TO_FETCH_NOTIFICATIONS", err);
    }
});
exports.getNotifications = getNotifications;
const markNotificationRead = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = request.query;
        let userId = request.auth.credentials.userData.id;
        const whereClause = { id, userId: userId };
        const notification = yield models_1.Models.Notification.findOne({ where: whereClause });
        if (!notification) {
            return Common.generateError(request, 400, "NOTIFICATION_NOT_FOUND", {});
        }
        yield models_1.Models.Notification.update({ isRead: 1 }, { where: { id: notification.id } });
        return h.response({ success: true, message: "NOTIFICATION_MARKED_AS_READ", notificationId: notification.id, }).code(200);
    }
    catch (err) {
        console.error("markNotificationRead error:", err);
        return Common.generateError(request, 500, "FAILED_TO_MARK_NOTIFICATION_READ", err);
    }
});
exports.markNotificationRead = markNotificationRead;
function convertToCron(date, time) {
    const [yyyy, mm, dd] = date.split("-").map(Number);
    const [HH, MM] = time.split(":").map(Number);
    return `${MM} ${HH} ${dd} ${mm} *`;
}
function scheduleDynamicNotification(cronExp, callback) {
    const task = node_cron_1.default.schedule(cronExp, callback, {
        timezone: "America/Los_Angeles"
    });
    task.start();
    return task; // if you want to cancel later
}
function processScheduledNotification(title_1, content_1) {
    return __awaiter(this, arguments, void 0, function* (title, content, language = "en") {
        // Fetch all active users
        const activeUsers = yield models_1.Models.User.findAll({
            where: { status: 1 }
        });
        // Send notifications to all
        for (const user of activeUsers) {
            yield (0, exports.sendNotification)("CUSTOM", { title, content }, [user.id], {}, language);
        }
        return true;
    });
}
function toCronExpressionFromDate(scheduledAt) {
    // Convert to target timezone and build cron expression: minute hour day month *
    const timezone = "America/Los_Angeles";
    const m = (0, moment_1.default)(scheduledAt).tz(timezone);
    const minute = m.minute();
    const hour = m.hour();
    const day = m.date();
    const month = m.month() + 1; // Moment months are 0-indexed
    return `${minute} ${hour} ${day} ${month} *`;
}
function scheduleTaskForRecord(record) {
    if (!record || !record.id || !record.scheduledAt)
        return null;
    const cronExp = record.cronExpression || toCronExpressionFromDate(record.scheduledAt);
    // Ensure existing task is stopped
    const existing = scheduledTasks.get(record.id);
    if (existing) {
        try {
            existing.stop();
            if (existing.destroy)
                existing.destroy();
        }
        catch (e) { }
    }
    const task = node_cron_1.default.schedule(cronExp, () => __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(`Executing scheduled notification id=${record.id}`);
            yield processScheduledNotification(record.title, record.content, record.scheduleLanguage || 'en');
            yield models_1.Models.Notification.update({ scheduleStatus: 2 }, { where: { id: record.id } });
            // stop and remove
            try {
                task.stop();
                if (task.destroy)
                    task.destroy();
            }
            catch (e) { }
            scheduledTasks.delete(record.id);
        }
        catch (err) {
            console.error('Error executing scheduled task', err);
        }
    }), { timezone: 'America/Los_Angeles' });
    task.start();
    scheduledTasks.set(record.id, task);
    return task;
}
function createScheduledNotification(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const cronExpression = toCronExpressionFromDate(data.scheduledAt);
        console.log('user Id ', data.userId);
        const created = yield models_1.Models.Notification.create({ title: data.title, content: data.content, compiledTitle: data.title, compiledContent: data.content, scheduledAt: data.scheduledAt, cronExpression, scheduleStatus: 1, notificationObject: null, scheduledBy: data.createdBy || null, userId: data.userId, scheduleLanguage: data.language || null, type: 'CUSTOM' });
        // Schedule it in-memory
        scheduleTaskForRecord(created);
        return created;
    });
}
function rescheduleScheduledNotification(mergedNotificationId, newScheduledAt, newTitle, newContent) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!mergedNotificationId)
            throw new Error("MERGED_ID_REQUIRED");
        const cronExpression = toCronExpressionFromDate(newScheduledAt);
        // Update all pending notifications of this group
        yield models_1.Models.Notification.update({
            scheduledAt: newScheduledAt,
            compiledTitle: newTitle,
            compiledContent: newContent,
            cronExpression,
        }, {
            where: {
                mergedNotificationId,
                scheduleStatus: 1,
            },
        });
        // Restart cron
        scheduleTaskForMergedNotification(mergedNotificationId, cronExpression);
        // Optionally fetch updated records if you need them
        const updated = yield models_1.Models.Notification.findAll({
            where: { mergedNotificationId, scheduleStatus: 1 },
        });
        return updated;
    });
}
function deleteScheduledNotification(mergedNotificationId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!mergedNotificationId)
            throw new Error("MERGED_ID_REQUIRED");
        // Stop cron if exists
        const existing = scheduledTasks.get(mergedNotificationId);
        if (existing) {
            try {
                existing.stop();
                if (existing.destroy)
                    existing.destroy();
            }
            catch (e) { }
            scheduledTasks.delete(mergedNotificationId);
        }
        // Delete all notifications with that merged id
        yield models_1.Models.Notification.destroy({
            where: { mergedNotificationId },
        });
        return true;
    });
}
function loadScheduledNotifications() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const now = new Date();
            // Fetch all scheduled notifications
            const all = yield models_1.Models.Notification.findAll({
                where: {
                    scheduleStatus: 1,
                    mergedNotificationId: { [dbImporter_1.Op.ne]: null },
                },
                raw: true,
            });
            // Group by mergedNotificationId
            const grouped = {};
            for (const rec of all) {
                const mergedId = rec.mergedNotificationId;
                if (!mergedId)
                    continue;
                // Use the first encountered record as representative
                if (!grouped[mergedId]) {
                    grouped[mergedId] = {
                        scheduledAt: rec.scheduledAt,
                        cronExpression: rec.cronExpression,
                    };
                }
            }
            let count = 0;
            for (const [mergedId, info] of Object.entries(grouped)) {
                const scheduledAt = new Date(info.scheduledAt);
                if (scheduledAt <= now) {
                    // already past, you can either skip or run immediately (your choice)
                    continue;
                }
                scheduleTaskForMergedNotification(mergedId, info.cronExpression);
                count++;
            }
            console.log(`Loaded ${count} merged scheduled notifications into memory`);
        }
        catch (err) {
            console.error("Failed to load scheduled notifications", err);
        }
    });
}
function scheduleTaskForMergedNotification(mergedNotificationId, cronExpression) {
    if (!mergedNotificationId || !cronExpression)
        return null;
    // Stop existing, if any
    const existing = scheduledTasks.get(mergedNotificationId);
    if (existing) {
        try {
            existing.stop();
            if (existing.destroy)
                existing.destroy();
        }
        catch (e) { }
    }
    const task = node_cron_1.default.schedule(cronExpression, () => __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(`Executing scheduled notifications for mergedNotificationId=${mergedNotificationId}`);
            yield processScheduledNotifications(mergedNotificationId);
        }
        catch (err) {
            console.error("Error executing scheduled merged notifications", err);
        }
    }), { timezone: "America/Los_Angeles" });
    task.start();
    scheduledTasks.set(mergedNotificationId, task);
    return task;
}
function createMergedScheduledNotificationsForAdmin(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const { title, content, scheduleDate, scheduleTime, timezone = "America/Los_Angeles", createdBy = null, language = "en", venue, } = params;
        // 1. Build scheduledAt in target timezone
        const scheduledAtMoment = moment_1.default.tz(`${scheduleDate}T${scheduleTime}`, "YYYY-MM-DDTHH:mm", timezone);
        const scheduledAt = scheduledAtMoment.toDate();
        const cronExpression = toCronExpressionFromDate(scheduledAt);
        // 2. Generate mergedNotificationId
        const mergedNotificationId = (0, uuid_1.v4)();
        // 3. Get all active users
        const allUserInfo = yield models_1.Models.User.findAll({
            where: { status: 1 },
            include: [
                {
                    attributes: ["name"],
                    model: models_1.Models.UserProfile,
                    as: "userProfile",
                },
            ],
        });
        if (!allUserInfo.length) {
            return { success: false, message: "NO_ACTIVE_USERS", mergedNotificationId: null };
        }
        // 4. Prepare bulk notification rows
        const notificationsToCreate = allUserInfo
            .filter((u) => u.id)
            .map((user) => ({
            userId: user.id,
            notificationTemplateId: null,
            type: "CUSTOM",
            title: '{{{title}}}',
            content: '{{{content}}}',
            replacements: null,
            compiledTitle: title,
            compiledContent: content,
            notificationObject: {
                venue,
            },
            // scheduling fields
            scheduledAt,
            cronExpression,
            scheduleStatus: 1, // 1 = scheduled
            scheduledBy: createdBy,
            scheduleLanguage: language,
            mergedNotificationId,
        }));
        const createdNotifications = yield models_1.Models.Notification.bulkCreate(notificationsToCreate);
        // 5. Schedule single cron job for this mergedNotificationId
        scheduleTaskForMergedNotification(mergedNotificationId, cronExpression);
        return {
            success: true,
            message: "SCHEDULED_NOTIFICATIONS_CREATED",
            mergedNotificationId,
            notifications: createdNotifications,
        };
    });
}
function processScheduledNotifications(mergedNotificationId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!mergedNotificationId)
                return false;
            const notifications = yield models_1.Models.Notification.findAll({
                where: {
                    mergedNotificationId,
                    scheduleStatus: 1,
                },
            });
            if (!notifications.length) {
                console.log(`No pending notifications found for mergedNotificationId=${mergedNotificationId}`);
                // Stop cron if it exists
                const existing = scheduledTasks.get(mergedNotificationId);
                if (existing) {
                    try {
                        existing.stop();
                        if (existing.destroy)
                            existing.destroy();
                    }
                    catch (e) { }
                    scheduledTasks.delete(mergedNotificationId);
                }
                return false;
            }
            // Use first record as template for title/content/language/payload
            const first = notifications[0];
            const language = first.scheduleLanguage || "en";
            const title = first.compiledTitle || first.title || "";
            const body = first.compiledContent || first.content || "";
            const basePayload = first.notificationObject || {};
            const userIds = notifications
                .map((n) => n.userId)
                .filter((id) => !!id);
            if (!userIds.length) {
                console.log(`No userIds found for mergedNotificationId=${mergedNotificationId}`);
            }
            else {
                // Fetch device tokens
                const devices = yield models_1.Models.UserSession.findAll({
                    where: { status: 1, userId: { [dbImporter_1.Op.in]: userIds } },
                    attributes: ["deviceToken"],
                    raw: true,
                });
                const sessionIds = devices
                    .map((d) => d.deviceToken)
                    .filter((token) => Boolean(token));
                if (sessionIds.length) {
                    yield fireNotification({
                        title,
                        body,
                        data: basePayload || {},
                    }, sessionIds);
                }
                else {
                    console.log(`No device tokens found for mergedNotificationId=${mergedNotificationId}`);
                }
            }
            // Mark all as executed: scheduleStatus = 0
            yield models_1.Models.Notification.update({ scheduleStatus: 0 }, { where: { mergedNotificationId, scheduleStatus: 1 } });
            // Stop and cleanup cron task
            const existing = scheduledTasks.get(mergedNotificationId);
            if (existing) {
                try {
                    existing.stop();
                    if (existing.destroy)
                        existing.destroy();
                }
                catch (e) { }
                scheduledTasks.delete(mergedNotificationId);
            }
            return true;
        }
        catch (err) {
            console.error("processScheduledNotifications error:", err);
            return false;
        }
    });
}
