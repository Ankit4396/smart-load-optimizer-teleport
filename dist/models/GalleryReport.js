"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const sequelize_1 = require("sequelize");
const GalleryReport = _1.sequelize.define("GalleryReport", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    galleryId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: "gallery_id"
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true, // allow anonymous
        field: "user_id"
    },
    reason: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true
    },
    reportedIp: {
        type: sequelize_1.DataTypes.STRING(45),
        allowNull: true,
        field: "reported_ip"
    }
}, {
    tableName: "gallery_reports",
    underscored: true,
    paranoid: true,
    indexes: [
        { fields: ["gallery_id"] },
        { fields: ["user_id"] },
        { fields: ["reported_ip"] },
        {
            unique: true,
            fields: ["gallery_id", "user_id"]
        }
        // {
        //   unique: true,
        //   fields: ["gallery_id", "reported_ip"]
        // }
    ]
});
exports.default = GalleryReport;
