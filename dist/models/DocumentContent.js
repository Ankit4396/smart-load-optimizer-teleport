"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const sequelize_1 = require("sequelize");
const DocumentContent = _1.sequelize.define("DocumentContent", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    documentId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, comment: "Ref to post table" },
    languageId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, comment: "Language for which content has been created" },
    title: { type: sequelize_1.DataTypes.TEXT, allowNull: false, comment: "Title of the post" },
    titleText: { type: sequelize_1.DataTypes.TEXT, allowNull: false, comment: "Title of the post in text format" },
    description: { type: sequelize_1.DataTypes.TEXT, allowNull: false, comment: "Description of the post" },
    descriptionText: { type: sequelize_1.DataTypes.TEXT, allowNull: false, comment: "Descriotion of the post in text format" },
    excerpt: { type: sequelize_1.DataTypes.TEXT, allowNull: false, comment: "Excerpt of the post" },
    excerptText: { type: sequelize_1.DataTypes.TEXT, allowNull: false, comment: "Excerpt of the post in text format" }
}, {
    paranoid: true,
    underscored: true,
    tableName: "document_contents",
    indexes: []
});
exports.default = DocumentContent;
