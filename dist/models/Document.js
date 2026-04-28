"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const sequelize_1 = require("sequelize");
let Document = _1.sequelize.define("Document", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    documentType: { type: sequelize_1.DataTypes.STRING, allowNull: false, comment: "" },
    userId: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, defaultValue: null, comment: "Aurthor of role, null means system default" },
    lastUpdatedBy: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, defaultValue: null, comment: "Last user who has updated the record" },
    accountId: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, defaultValue: null, comment: "Account for which role has been created" },
    isRevision: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: false, comment: "Revision of updates" },
    revisionId: { type: sequelize_1.DataTypes.INTEGER, defaultValue: null, comment: "ref to entity, If its a revision" },
    status: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 0, comment: "Status of role. 0-> Inactive, 1-> Active" }
}, {
    paranoid: true,
    underscored: true,
    tableName: "documents"
});
exports.default = Document;
