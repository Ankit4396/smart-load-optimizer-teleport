"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const sequelize_1 = require("sequelize");
const Albums = _1.sequelize.define("Albums", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    photosetId: { type: sequelize_1.DataTypes.STRING, allowNull: false, comment: "photo set id" },
    title: { type: sequelize_1.DataTypes.STRING, allowNull: true, comment: "title" },
    link: { type: sequelize_1.DataTypes.STRING(768), unique: true, allowNull: true, defaultValue: null, comment: "photo link" },
    count: { type: sequelize_1.DataTypes.STRING, allowNull: true, comment: "total photo count" },
    viewsCount: { type: sequelize_1.DataTypes.STRING, allowNull: true, defaultValue: null, comment: "total view count" }
}, {
    paranoid: true,
    underscored: true,
    tableName: "albums",
    indexes: [
        { name: 'id', fields: ['id'] },
        { name: 'title', fields: ['title'] },
        { name: 'link', fields: [{ name: 'link', length: 255 }] },
        { name: 'photoset_id', fields: ['photoset_id'] },
    ]
});
exports.default = Albums;
