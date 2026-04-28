"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const sequelize_1 = require("sequelize");
const Category = _1.sequelize.define("Category", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    code: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: 'category-type-code', comment: "unique code for categorytype created, generated from title" },
    categorytypeId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, unique: 'category-type-code', comment: "Type of category" },
    parentId: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, defaultValue: null, unique: 'category-type-code', comment: "Parent of category" },
    userId: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, defaultValue: null, unique: 'category-type-code', comment: "Aurthor of the record" },
    accountId: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, defaultValue: null, comment: "Aurthor account identity" },
    adminOnly: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: false, comment: "If Category can be managed by system admin only? 0=>Account admin can manage it for subaccount, 1=> Its exclusive for system admin only" },
    lastUpdatedBy: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, defaultValue: null, comment: "Last user who has updated the record" },
    isRevision: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: false, comment: "If redord is revision?" },
    imageId: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, defaultValue: null, comment: "Identity of image associated with category" },
    revisionId: { type: sequelize_1.DataTypes.INTEGER, defaultValue: null, comment: "ref to entity, If its a revision" },
    orderSequence: { type: sequelize_1.DataTypes.TEXT, defaultValue: null, comment: "Order sequence for tree structure" },
    level: { type: sequelize_1.DataTypes.INTEGER, defaultValue: null, comment: "Level of category" },
    status: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 1, comment: "Status of Category. 0-> Inactive, 1-> Active" }
}, {
    paranoid: true,
    underscored: true,
    tableName: "categories",
    indexes: [
        { name: 'id-revision', fields: ['id', 'is_revision'] },
        { name: 'categorytypeId', fields: ['categorytype_id'] },
        { name: 'parentId', fields: ['parent_id'] },
        { name: 'accountId', fields: ['account_id'] },
        { name: 'status', fields: ['status'] },
    ]
});
exports.default = Category;
