"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const sequelize_1 = require("sequelize");
const Language = _1.sequelize.define("Language", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: 'language-name', comment: "Language" },
    code: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: 'langiage-code', comment: "unique code for language created, generated from title" },
    isDefault: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, comment: "if language is set as default? true, false" },
    status: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 0, comment: "Status of language. 0-> Inactive, 1-> Active" }
}, {
    paranoid: true,
    underscored: true,
    tableName: "languages",
    indexes: [
        { name: 'language_code', fields: ['name', 'code'] }
    ]
});
exports.default = Language;
