"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const sequelize_1 = require("sequelize");
const Shop = _1.sequelize.define("Shop", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    code: { type: sequelize_1.DataTypes.STRING, allowNull: true, defaultValue: null, comment: "" },
    userId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, comment: "User ref id" },
    accountId: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, comment: "User ref id" },
    contactName: { type: sequelize_1.DataTypes.STRING, allowNull: true, defaultValue: null, comment: "" },
    contactEmail: { type: sequelize_1.DataTypes.STRING, allowNull: true, defaultValue: null, comment: "" },
    contactCountryCode: { type: sequelize_1.DataTypes.STRING, allowNull: true, defaultValue: null, comment: "" },
    contactPhone: { type: sequelize_1.DataTypes.STRING, allowNull: true, defaultValue: null, comment: "" },
    shopUrl: { type: sequelize_1.DataTypes.STRING, allowNull: true, defaultValue: null, comment: "" },
    isfeatured: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, defaultValue: 0, comment: "" },
    isVerified: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: false, comment: "" },
    settings: { type: sequelize_1.DataTypes.JSON, allowNull: false, defaultValue: {}, comment: "" },
    slots: { type: sequelize_1.DataTypes.JSON, allowNull: false, defaultValue: {}, comment: "" },
    attachments: { type: sequelize_1.DataTypes.JSON, allowNull: false, defaultValue: [], comment: "" },
    social: { type: sequelize_1.DataTypes.JSON, allowNull: false, defaultValue: {}, comment: "" },
    bankAccountId: { type: sequelize_1.DataTypes.INTEGER, allowNull: true },
    documentId: { type: sequelize_1.DataTypes.INTEGER, allowNull: true },
    searchIndex: { type: sequelize_1.DataTypes.TEXT, allowNull: true, defaultValue: null },
    meta: { type: sequelize_1.DataTypes.JSON, allowNull: false, defaultValue: [], comment: "" },
    lastUpdatedBy: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, defaultValue: null, comment: "" },
    isRevision: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: false, comment: "If redord is revision?" },
    revisionId: { type: sequelize_1.DataTypes.INTEGER, defaultValue: null, comment: "ref to entity, If its a revision" },
    status: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 0, comment: "Status of user. 0-> Inactive, 1-> Active, 2-> not verified" }
}, {
    paranoid: true,
    underscored: true,
    tableName: "shops",
    indexes: [
        { name: 'shops_searchIndex', fields: ['search_index'], type: 'FULLTEXT' }
    ]
});
exports.default = Shop;
