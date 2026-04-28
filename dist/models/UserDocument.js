"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const sequelize_1 = require("sequelize");
let UserDocument = _1.sequelize.define("UserDocument", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    documentId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, comment: "" },
    userId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, comment: "" },
    attachmentId: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, comment: "" },
    agreement: { type: sequelize_1.DataTypes.JSON, allowNull: true, defaultValue: null, comment: "" },
    isSigned: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: false, comment: "" },
    signAttachmentId: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, defaultValue: null, comment: "" },
    docCreatedDate: { type: sequelize_1.DataTypes.DATE, allowNull: true, defaultValue: null, comment: "" },
    docSignedDate: { type: sequelize_1.DataTypes.DATE, allowNull: true, defaultValue: null, comment: "" },
    linkedHtml: { type: sequelize_1.DataTypes.TEXT, allowNull: false, defaultValue: false, comment: "" },
    lastUpdatedBy: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, defaultValue: null, comment: "Last user who has updated the record" },
    accountId: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, defaultValue: null, comment: "Account for which role has been created" },
    isRevision: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: false, comment: "Revision of updates" },
    revisionId: { type: sequelize_1.DataTypes.INTEGER, defaultValue: null, comment: "ref to entity, If its a revision" },
    status: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 1, comment: "Status of role. 0-> Inactive, 1-> Active" }
}, {
    paranoid: true,
    underscored: true,
    tableName: "user_documents"
});
exports.default = UserDocument;
