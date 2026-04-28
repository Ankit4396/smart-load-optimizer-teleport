"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const sequelize_1 = require("sequelize");
const AttributeOptionContent = _1.sequelize.define("AttributeOptionContent", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    attributeOptionId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, comment: "Attribute option id" },
    languageId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, comment: "Language id" },
    name: { type: sequelize_1.DataTypes.STRING, allowNull: false, comment: "Name of the attribute option" },
    dataDump: { type: sequelize_1.DataTypes.JSON, comment: "Original Payload" }
}, {
    paranoid: true,
    underscored: true,
    tableName: "attribute_option_contents",
});
exports.default = AttributeOptionContent;
