"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const sequelize_1 = require("sequelize");
let NotificationTemplate = _1.sequelize.define("NotificationTemplate", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    type: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: 'notification-template' },
    replacements: { type: sequelize_1.DataTypes.STRING, allowNull: false, defaultValue: '' },
    userId: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, defaultValue: null, comment: "Aurthor of the record" },
    accountId: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, defaultValue: null, comment: "Aurthor account id" },
    lastUpdatedById: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, defaultValue: null, comment: "Last user who has updated the record" },
    isRevision: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: false, comment: "If redord is revision?" },
    revisionId: { type: sequelize_1.DataTypes.INTEGER, defaultValue: null, comment: "ref to entity, If its a revision" },
    status: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 1, comment: "Status of email Template. 0-> Inactive, 1-> Active" }
}, {
    paranoid: true,
    underscored: true,
    tableName: "notification_templates"
});
exports.default = NotificationTemplate;
