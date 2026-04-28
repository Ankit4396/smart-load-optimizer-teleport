"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const sequelize_1 = require("sequelize");
const AttributeContent = _1.sequelize.define("AttributeContent", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    attributeId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, comment: "Attribute id" },
    languageId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, comment: "Language id" },
    name: { type: sequelize_1.DataTypes.STRING, allowNull: false, comment: "Name of the attribute" },
    dataDump: { type: sequelize_1.DataTypes.JSON, comment: "Original Payload" }
}, {
    paranoid: true,
    underscored: true,
    tableName: "attribute_contents",
});
exports.default = AttributeContent;
