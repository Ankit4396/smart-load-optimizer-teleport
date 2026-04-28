"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const sequelize_1 = require("sequelize");
const Attachment = _1.sequelize.define("Attachment", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    fileName: { type: sequelize_1.DataTypes.STRING, allowNull: false, comment: "Original Name of file uploaded to server" },
    userId: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, defaultValue: null, comment: "User identity who has uploaded the file" },
    accountId: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, defaultValue: null, comment: "User`s account id" },
    uniqueName: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: 'fileName', comment: "unique filename" },
    extension: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: 'fileName', comment: "unique filename" },
    filePath: { type: sequelize_1.DataTypes.TEXT, allowNull: false, comment: "relative path of file on server" },
    type: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, defaultValue: 1, comment: "1=>Stored in file system, 2=>Stored on S3 bucket" },
    size: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, defaultValue: 0, comment: "filesize in bytes" },
    dataKey: { type: sequelize_1.DataTypes.TEXT, allowNull: true, defaultValue: null, comment: "datakey for the file" },
    status: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 0, comment: "Status of file uploaded. 0-> not connected to entity, 1-> Connected to entity" }
}, {
    paranoid: true,
    underscored: true,
    tableName: "attachments",
    indexes: [
        { name: 'unique-name', fields: ['unique_name'] },
    ]
});
exports.default = Attachment;
