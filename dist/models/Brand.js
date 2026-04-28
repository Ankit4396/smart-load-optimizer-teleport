"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const sequelize_1 = require("sequelize");
const Brand = _1.sequelize.define("Brand", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    code: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: 'brand-code', comment: "unique code for brand created, generated from title" },
    attachmentId: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, defaultValue: null, comment: "Brand logo" },
    accountId: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, defaultValue: null, comment: "Aurthor account identity" },
    userId: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, defaultValue: null, comment: "Aurthor account identity" },
    lastUpdatedBy: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, defaultValue: null, comment: "Last user who has updated the record" },
    status: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 1, comment: "Status of Brand. 0-> Inactive, 1-> Active" }
}, {
    paranoid: true,
    underscored: true,
    tableName: "brands",
});
exports.default = Brand;
