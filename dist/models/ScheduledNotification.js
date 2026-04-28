"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const sequelize_1 = require("sequelize");
const ScheduledNotification = _1.sequelize.define('ScheduledNotification', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    title: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    content: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    scheduledAt: { type: sequelize_1.DataTypes.DATE, allowNull: false },
    cronExpression: { type: sequelize_1.DataTypes.STRING, allowNull: true, defaultValue: null },
    status: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 1, comment: '1->scheduled,0->cancelled,2->sent' },
    payload: { type: sequelize_1.DataTypes.JSON, allowNull: true, defaultValue: null },
    createdBy: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, defaultValue: null },
}, {
    paranoid: true,
    underscored: true,
    tableName: 'scheduled_notifications',
});
exports.default = ScheduledNotification;
