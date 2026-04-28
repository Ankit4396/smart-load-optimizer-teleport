"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const sequelize_1 = require("sequelize");
const AttributeOption = _1.sequelize.define("AttributeOption", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    code: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: 'attribute-option-code', comment: "unique code for option created, generated from option name" },
    attributeId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, unique: 'attribute-option-code', comment: "Attribute id" },
}, {
    paranoid: true,
    underscored: true,
    tableName: "attribute_options",
});
exports.default = AttributeOption;
