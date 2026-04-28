"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachmentObject = exports.permissionObject = exports.userObject = exports.parenetCategory = exports.directoryObject = exports.categoryTypeObject = exports.categoryObject = void 0;
const routeImporter_1 = require("../config/routeImporter");
const attachmentObject = routeImporter_1.Joi.object().keys({
    id: routeImporter_1.Joi.number().example(1).description("Unique identifier of the file"),
    fileName: routeImporter_1.Joi.string().example('attachment-name').description("file name"),
    extension: routeImporter_1.Joi.string().example('.png').description("extension of the file").allow(null),
    size: routeImporter_1.Joi.number().example(1024).description("Size of the file").allow(null),
    filePath: routeImporter_1.Joi.string().example('attachment-path').description("Http path to the file"),
    isEncrypted: routeImporter_1.Joi.number().allow(null).default(1).description("If the file is encrypted or not")
}).label('attachment-summary').description("Summary of the attachment associated with the entity");
exports.attachmentObject = attachmentObject;
const categoryTypeObject = routeImporter_1.Joi.object().keys({
    id: routeImporter_1.Joi.number().example(1).description("Unique identifier of the category type"),
    code: routeImporter_1.Joi.string().example('category-code').description("Code of the category type"),
    name: routeImporter_1.Joi.string().example("Name of the category type").description("Name of the category type")
}).label('category-type-summary').description("Summary of the category type associated with the entity");
exports.categoryTypeObject = categoryTypeObject;
const directoryObject = routeImporter_1.Joi.object().keys({
    id: routeImporter_1.Joi.number().example(1).description("Unique identifier of the category"),
    code: routeImporter_1.Joi.string().example('category-code').description("Code of the category"),
    isGlobal: routeImporter_1.Joi.number().example(1).description("If category is global"),
    name: routeImporter_1.Joi.string().example("Name of the category").description("Name of the category"),
    size: routeImporter_1.Joi.number().example(100).allow(null).description("Size of files in first level"),
    fileCount: routeImporter_1.Joi.number().example(4).description("Number of child files at first level"),
    directoryCount: routeImporter_1.Joi.number().example(4).description("Number of child directories at first level"),
    totalFilesCount: routeImporter_1.Joi.number().example(4).description("Number of child directories at all levels"),
    totalDirecoryCount: routeImporter_1.Joi.number().example(4).description("Number of child files at all levels"),
    totalFilesSize: routeImporter_1.Joi.number().example(100).allow(null).description("Size of files in all child level"),
    createdAt: routeImporter_1.Joi.date().example("2023-01-02T12:18:55.000Z").description("Creation date"),
    userSignupDate: routeImporter_1.Joi.date().example("2023-01-02T12:18:55.000Z").description("Used when default directory is created by system").allow(null),
    categoryImage: attachmentObject.allow(null)
}).label('directory-summary').description("Summary of the directory");
exports.directoryObject = directoryObject;
const parenetCategory = routeImporter_1.Joi.object().keys({
    id: routeImporter_1.Joi.number().example(1).description("Category identifier"),
    code: routeImporter_1.Joi.string().example("code").description("Category code"),
    name: routeImporter_1.Joi.string().example("category name").description("Category name"),
    parentId: routeImporter_1.Joi.number().allow(null).example(1).description("Category parent id"),
}).label('category-parent-summary').description("Object for category parent");
exports.parenetCategory = parenetCategory;
const categoryObject = routeImporter_1.Joi.object().keys({
    id: routeImporter_1.Joi.number().example(1).description("Unique identifier of the category"),
    code: routeImporter_1.Joi.string().example('category-code').description("Code of the category"),
    name: routeImporter_1.Joi.string().example("Name of the category").description("Name of the category"),
    categoryImage: attachmentObject.allow(null)
}).label('category-summary').description("Summary of the category associated with the entity");
exports.categoryObject = categoryObject;
const userObject = routeImporter_1.Joi.object().keys({
    id: routeImporter_1.Joi.number().example(1).description("Unique identifier of the user"),
    name: routeImporter_1.Joi.string().example("Name of the user").description("Complete name of the user"),
    email: routeImporter_1.Joi.string().example("email@domain.com").description("Email id of the user"),
    countryCode: routeImporter_1.Joi.string().example("+91").description("Country code").allow(null),
    mobile: routeImporter_1.Joi.string().example("999999999").description("Mobile number of the user").allow(null),
    profileImage: routeImporter_1.Joi.string().example("User's profile image").description("User's profile image").allow(null),
    status: routeImporter_1.Joi.number().example(1).description("Account status").allow(null),
}).label('user-summary').description("Summary of user associated with the entity");
exports.userObject = userObject;
const permissionObject = routeImporter_1.Joi.object().keys({
    id: routeImporter_1.Joi.number().example(1).description("Unique identifier of the permission"),
    name: routeImporter_1.Joi.string().example("Name of the permission").description("Complete name of the permission"),
    description: routeImporter_1.Joi.string().example("Description of the permission").description("Description of the permission")
}).label('permission-summary').description("Summary of permissions associated with the entity");
exports.permissionObject = permissionObject;
