"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const sequelize_1 = require("sequelize");
const PostMedia = _1.sequelize.define("PostMedia", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    postId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, comment: "Ref to post table" },
    languageId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, comment: "Language for which media has been created" },
    type: { type: sequelize_1.DataTypes.STRING, allowNull: false, comment: "Media type (image,video)" },
    fileId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, comment: "Attachment identifier" },
    isFeatured: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: false, comment: "Attachment identifier" }
}, {
    paranoid: true,
    underscored: true,
    tableName: "posts_media",
    indexes: [
        { name: 'ref-post-media', fields: ['post_id'] }
    ]
});
exports.default = PostMedia;
