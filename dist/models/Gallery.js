"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const sequelize_1 = require("sequelize");
const Galleries = _1.sequelize.define("Gallery", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    photosetId: { type: sequelize_1.DataTypes.STRING, allowNull: false, comment: "photo set id" },
    title: { type: sequelize_1.DataTypes.STRING, allowNull: true, comment: "title" },
    link: { type: sequelize_1.DataTypes.STRING(768), allowNull: true, defaultValue: null, comment: "photo link" }
}, {
    paranoid: true,
    underscored: true,
    tableName: "galleries",
    indexes: [
        { name: 'id', fields: ['id'] },
        { name: 'title', fields: ['title'] },
        { name: 'link', fields: [{ name: 'link', length: 255 }] },
        { name: 'photoset_id', fields: ['photoset_id'] },
    ]
});
exports.default = Galleries;
