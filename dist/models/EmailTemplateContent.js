"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const sequelize_1 = require("sequelize");
let EmailTemplateContent = _1.sequelize.define("EmailTemplateContent", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    EmailTemplateId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, unique: 'unique-language-content' },
    languageId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, unique: 'unique-language-content' },
    title: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    message: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    messageText: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    subject: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
}, {
    paranoid: true,
    underscored: true,
    tableName: "emails_template_content",
    indexes: [
        { name: 'name', fields: ['title', 'message_text'], type: 'FULLTEXT' }
    ]
});
exports.default = EmailTemplateContent;
