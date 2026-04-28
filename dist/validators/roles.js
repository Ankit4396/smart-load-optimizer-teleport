"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listResponse = exports.roleFilters = exports.deletedRoleResponse = exports.roleResponse = exports.roleRequest = exports.roleIdentity = void 0;
const routeImporter_1 = require("../config/routeImporter");
const relations_1 = require("./relations");
const role = routeImporter_1.Joi.object().keys({
    id: routeImporter_1.Joi.number().example(1).description("Unique identifier for the permission"),
    code: routeImporter_1.Joi.string().example('permission-code').description("Permission code must match with text used in code"),
    name: routeImporter_1.Joi.string().example("Permission name").description('Name of the permission'),
    author: relations_1.userObject.allow(null),
    updatedBy: relations_1.userObject.allow(null),
    Permissions: routeImporter_1.Joi.array().items(relations_1.permissionObject.allow(null)).min(0),
    status: routeImporter_1.Joi.number().example(1).valid(0, 1).description("Activation status"),
    isRevision: routeImporter_1.Joi.boolean().example(true).allow(null).description("If the entry is stored as revision or not"),
    revisionId: routeImporter_1.Joi.number().example(1).allow(null).description("Ref to the revision entity"),
    createdAt: routeImporter_1.Joi.date().example("2023-01-02T12:18:55.000Z").description("creation date"),
    updatedAt: routeImporter_1.Joi.date().example("2023-01-02T12:18:55.000Z").description("last update date")
}).label('role').description('Role');
const roleRequest = routeImporter_1.Joi.object().keys({
    name: routeImporter_1.Joi.string().trim().required().error(errors => { return routeImporter_1.Common.routeError(errors, 'PERMISSION_NAME_IS_REQUIRED'); }).example("Permission name").description('Name of the permission'),
    permissions: routeImporter_1.Joi.array().items(routeImporter_1.Joi.number()).required().min(1).example("[1,2,3]").description('Permission to be associted with the role')
}).label('role-request').description('Role Request');
exports.roleRequest = roleRequest;
const roleResponse = routeImporter_1.Joi.object().keys({
    message: routeImporter_1.Joi.string().example("Request status message").description("Message to confirm the operation"),
    responseData: role
}).label('role-response').description('Responsedata for create and update role');
exports.roleResponse = roleResponse;
const roleObj = role.keys({ deletedAt: routeImporter_1.Joi.date().example("2023-01-02T12:18:55.000Z").description("Deleted Role object"), }).label('deleted-role');
const deletedRoleResponse = routeImporter_1.Joi.object().keys({
    message: routeImporter_1.Joi.string().example("Request status message").description("Message to confirm the operation"),
    responseData: roleObj
}).label('deleted-role-response').description('Response for delete role');
exports.deletedRoleResponse = deletedRoleResponse;
const roleIdentity = routeImporter_1.Joi.object().keys({
    id: routeImporter_1.Joi.number().required().example(1).description("Unique identifier for the role"),
}).label('role-identiry').description('Identifier for the role');
exports.roleIdentity = roleIdentity;
const roleFilters = routeImporter_1.Joi.object().keys({
    searchText: routeImporter_1.Joi.string().trim().optional().example("Search text").description("Your serach text"),
    page: routeImporter_1.Joi.number().min(0).optional().default(1).example(1).description("Page no for paginated data"),
    perPage: routeImporter_1.Joi.number().optional().min(1).default(process.env.PAGINATION_LIMIT),
}).label('role-listing-request').description('Request to generate role listing');
exports.roleFilters = roleFilters;
const listResponse = routeImporter_1.Joi.object().keys({
    message: routeImporter_1.Joi.string().example("Request status message").description("Message to confirm the operation"),
    responseData: routeImporter_1.Joi.object().keys({
        data: routeImporter_1.Joi.array().items(role).min(0).description('Array of role objects'),
        perPage: routeImporter_1.Joi.number().integer().example(1).description("Number or required in response"),
        page: routeImporter_1.Joi.number().integer().example(1).description("page no for which data is requested"),
        totalRecords: routeImporter_1.Joi.number().example(1).description("total number of reccords"),
        totalPages: routeImporter_1.Joi.number().integer().example(1).description("Total number of pages response set will generate")
    }).label('role-list').description('Role listing')
}).label('role-listing-response').description('Roles listing response');
exports.listResponse = listResponse;
