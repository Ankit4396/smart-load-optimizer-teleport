"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const sequelize_1 = require("sequelize");
const CategoryTypeContent = _1.sequelize.define("CategoryTypeContent", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    categorytypeId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, unique: 'category-type-name', comment: "Ref to category content table" },
    languageId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, unique: 'category-type-name', comment: "language for which content has been created" },
    name: { type: sequelize_1.DataTypes.TEXT, allowNull: false, comment: "Name of the categorytype" },
    description: { type: sequelize_1.DataTypes.TEXT, allowNull: false, comment: "description for category type in HTML format" },
    descriptionText: { type: sequelize_1.DataTypes.TEXT, allowNull: false, comment: "description for category type in plain text format" }
}, {
    paranoid: true,
    underscored: true,
    tableName: "categories_types_content",
    indexes: [
        { name: 'ref-category-content', fields: ['categorytype_id'] },
        { name: 'name', fields: ['name'], type: 'FULLTEXT' },
        { name: 'language', fields: ['language_id'] },
    ]
});
exports.default = CategoryTypeContent;
