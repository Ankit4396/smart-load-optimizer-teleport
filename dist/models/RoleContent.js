"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const sequelize_1 = require("sequelize");
const RoleContent = _1.sequelize.define("RoleContent", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    roleId: { type: sequelize_1.DataTypes.INTEGER, unique: 'role-name', allowNull: false, comment: "Ref to role table" },
    languageId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, unique: 'role-name', comment: "language for which content has been created" },
    name: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: 'role-name', comment: "Name of the role" }
}, {
    paranoid: true,
    underscored: true,
    tableName: "roles_content",
    indexes: [
        { name: 'ref-role-content', fields: ['role_id'] },
        { name: 'name', fields: ['name'] },
        { name: 'name_language', fields: ['language_id', 'name'] },
    ]
});
exports.default = RoleContent;
