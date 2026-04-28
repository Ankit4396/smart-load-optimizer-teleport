"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const sequelize_1 = require("sequelize");
const PermissionContent = _1.sequelize.define("PermissionContent", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    permissionId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, comment: "Ref to permission table" },
    languageId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, comment: "language for which content has been created" },
    name: { type: sequelize_1.DataTypes.TEXT, allowNull: false, comment: "Name of the permission" },
    description: { type: sequelize_1.DataTypes.TEXT, allowNull: true, comment: "Small description about the permission" }
}, {
    paranoid: true,
    underscored: true,
    tableName: "permissions_content",
    indexes: [
        { name: 'ref-permission-content', fields: ['permission_id'] },
        { name: 'name', fields: ['name'], type: 'FULLTEXT' },
        { name: 'language', fields: ['language_id'] },
    ]
});
exports.default = PermissionContent;
