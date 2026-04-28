"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const sequelize_1 = require("sequelize");
let Notification = _1.sequelize.define("Notification", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    type: {
        type: sequelize_1.DataTypes.STRING, allowNull: false,
        comment: 'The unique type or category of the notification (e.g., "account_approved", "message_received")'
    },
    replacements: {
        type: sequelize_1.DataTypes.JSON, allowNull: true, defaultValue: null,
        comment: 'Placeholder replacements for the notification content (e.g., "{{name}}", "{{date}}")'
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER, allowNull: true, defaultValue: null,
        comment: 'The ID of the user who created or owns this record'
    },
    notificationTemplateId: {
        type: sequelize_1.DataTypes.INTEGER, allowNull: true, defaultValue: null,
        comment: 'The ID of the associated notification template'
    },
    title: {
        type: sequelize_1.DataTypes.TEXT, allowNull: false,
        comment: 'The title of the notification template before replacements are applied'
    },
    content: {
        type: sequelize_1.DataTypes.TEXT, allowNull: false,
        comment: 'The content of the notification template before replacements are applied'
    },
    compiledTitle: {
        type: sequelize_1.DataTypes.TEXT, allowNull: false,
        comment: 'The title of the notification with placeholders replaced by actual values'
    },
    compiledContent: {
        type: sequelize_1.DataTypes.TEXT, allowNull: false,
        comment: 'The content of the notification with placeholders replaced by actual values'
    },
    notificationObject: {
        type: sequelize_1.DataTypes.JSON, allowNull: true,
        comment: 'A JSON object that stores additional data relevant to the notification (e.g., actions, metadata)'
    },
    mergedNotificationId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        comment: 'A UUIDv4 used to group/merge related notifications across users or channels'
    },
    // Scheduling fields (used when notification is scheduled for future delivery)
    scheduledAt: { type: sequelize_1.DataTypes.DATE, allowNull: true, defaultValue: null, comment: 'When the notification is scheduled to be sent' },
    cronExpression: { type: sequelize_1.DataTypes.STRING, allowNull: true, defaultValue: null, comment: 'Stored cron expression for recurring/scheduled notifications' },
    scheduleStatus: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, comment: '1->scheduled,0->cancelled,2->sent/processed' },
    scheduledBy: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, defaultValue: null, comment: 'Admin user id who scheduled the notification' },
    scheduleLanguage: { type: sequelize_1.DataTypes.STRING, allowNull: true, defaultValue: null, comment: 'Language code for the scheduled notification' },
    status: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 1, comment: "Status of user. 0-> Expired, 1-> Active," },
    isRead: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 0, comment: "Status of user. 0-> not read, 1-> read," },
}, {
    paranoid: true,
    underscored: true,
    tableName: "notifications"
});
exports.default = Notification;
