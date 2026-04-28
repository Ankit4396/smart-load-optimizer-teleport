"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const sequelize_1 = require("sequelize");
let NotificationTemplateContent = _1.sequelize.define("NotificationTemplateContent", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    notificationTemplateId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, unique: 'unique-language-content' },
    languageId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, unique: 'unique-language-content' },
    title: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    content: { type: sequelize_1.DataTypes.TEXT, allowNull: false }
}, {
    paranoid: true,
    underscored: true,
    tableName: "notification_template_content",
    indexes: [
        { name: 'name', fields: ['title', 'content'], type: 'FULLTEXT' }
    ]
});
exports.default = NotificationTemplateContent;
