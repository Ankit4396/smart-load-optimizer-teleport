"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const sequelize_1 = require("sequelize");
const CategoryContent = _1.sequelize.define("CategoryContent", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    categoryId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, unique: 'category-type-name', comment: "Ref to category content table" },
    languageId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, unique: 'category-type-name', comment: "language for which content has been created" },
    name: { type: sequelize_1.DataTypes.TEXT, allowNull: false, comment: "Name of the category" }
}, {
    paranoid: true,
    underscored: true,
    tableName: "categories_content",
    indexes: [
        { name: 'ref-category-content', fields: ['category_id'] },
        { name: 'name', fields: ['name'], type: 'FULLTEXT' },
        { name: 'language', fields: ['language_id'] },
        { name: 'categoryId', fields: ['category_id'] },
    ]
});
exports.default = CategoryContent;
