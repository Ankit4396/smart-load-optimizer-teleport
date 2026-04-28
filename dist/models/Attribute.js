"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const sequelize_1 = require("sequelize");
const Attribute = _1.sequelize.define("Attribute", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    code: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: 'category-attribute-code', comment: "unique code for categorytype created, generated from title" },
    type: { type: sequelize_1.DataTypes.TINYINT, allowNull: false, defaultValue: 1, comment: "Parent of category" },
    isVariant: { type: sequelize_1.DataTypes.TINYINT, allowNull: false, defaultValue: 0, comment: "Aurthor of the record" },
    accountId: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, defaultValue: null, comment: "Aurthor account identity" },
    userId: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, defaultValue: null, comment: "Aurthor account identity" },
    lastUpdatedBy: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, defaultValue: null, comment: "Last user who has updated the record" },
    orderSequence: { type: sequelize_1.DataTypes.TEXT, allowNull: true, defaultValue: null, comment: "Order sequence for tree structure" },
    status: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 1, comment: "Status of Category. 0-> Inactive, 1-> Active" }
}, {
    paranoid: true,
    underscored: true,
    tableName: "attributes",
});
exports.default = Attribute;
