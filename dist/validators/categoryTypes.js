"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCategoryTypeResponse = exports.listCategoryTypeRequest = exports.categoryTypeStatusRequest = exports.categoryTypesResponse = exports.categoryTypeResponse = exports.categoryTypeRequest = exports.categoryTypeDeleteResponse = exports.categoryTypeIdentity = void 0;
const routeImporter_1 = require("../config/routeImporter");
const { userObject } = require("./relations");
// const categoryTypeRequest=Joi.object().keys({
//     name: Joi.string().trim().required().error(errors=>{return Common.routeError(errors,'CATEGORY_TYPE_NAME_IS_REQUIRED')}).example("Category type name").description('Name of category type'),
//     description:Joi.string().trim().required().error(errors=>{return Common.routeError(errors,'CATEGORY_TYPE_DESCRIPTION_IS_REQUIRED')}).example("Description for the category type")
// }).label('category-type-request').description('Request to create a category type')
const categoryTypeRequest = routeImporter_1.Joi.object().keys({
    name: routeImporter_1.Joi.string().trim().required()
        .example("Category type name")
        .description("Name of category type")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'CATEGORY_TYPE_NAME_IS_REQUIRED'); }),
    description: routeImporter_1.Joi.string().trim().required()
        .example("Description for the category type")
        .description("Description of the category type")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'CATEGORY_TYPE_DESCRIPTION_IS_REQUIRED'); })
}).label('category-type-request')
    .description("Schema for validating requests to create a category type, including name and description.");
exports.categoryTypeRequest = categoryTypeRequest;
const categoryTypeIdentity = routeImporter_1.Joi.object().keys({
    id: routeImporter_1.Joi.number().required().error(errors => { return routeImporter_1.Common.routeError(errors, 'CATEGORY_TYPE_ID_REQUIRED'); }).example(1).description("Identifier for the category type"),
}).label('category-type-identiry').description('Identifier for the content type');
exports.categoryTypeIdentity = categoryTypeIdentity;
const categoryType = routeImporter_1.Joi.object().keys({
    id: routeImporter_1.Joi.number().example(1).description("Identifier for the category type"),
    code: routeImporter_1.Joi.string().example('category-code').description("Code for the category type (Generate by the system)"),
    name: routeImporter_1.Joi.string().example("Category type name").description('Name of category type'),
    description: routeImporter_1.Joi.string().example("Description for the category type"),
    userId: routeImporter_1.Joi.number().example(1).allow(null).description('author`s identity'),
    author: userObject.allow(null),
    updatedBy: userObject.allow(null),
    status: routeImporter_1.Joi.number().example(1).valid(0, 1).description("Activation status 0=>Inactive, 1=>Active"),
    isRevision: routeImporter_1.Joi.boolean().example(true).allow(null).description("If the entry is stored as revision or not"),
    revisionId: routeImporter_1.Joi.number().example(1).allow(null).description("ref to the revision entity"),
    createdAt: routeImporter_1.Joi.date().example("2023-01-02T12:18:55.000Z").description("creation date"),
    updatedAt: routeImporter_1.Joi.date().example("2023-01-02T12:18:55.000Z").description("last update date")
}).label('category-type').description('Category type object');
const categoryTypeResponse = routeImporter_1.Joi.object().keys({
    message: routeImporter_1.Joi.string().example("Confirmation message").description("Message to confirm the operation"),
    responseData: categoryType
}).label('category-type-response').description('Category type response object');
exports.categoryTypeResponse = categoryTypeResponse;
const categoryTypeDeleteObj = categoryType.keys({ deletedAt: routeImporter_1.Joi.date().example("2023-01-02T12:18:55.000Z").description("Date when record was deleted"), }).label('deleted-category-type').description('Deleted category type object');
const categoryTypeDeleteResponse = routeImporter_1.Joi.object().keys({
    message: routeImporter_1.Joi.string().example("Confirmation message").description("Message to confirm the operation"),
    responseData: categoryTypeDeleteObj
}).label('category-type-delete-response').description('Categorytype operation response object');
exports.categoryTypeDeleteResponse = categoryTypeDeleteResponse;
const categoryTypesResponse = routeImporter_1.Joi.object().keys({
    message: routeImporter_1.Joi.string().example("Confirmation message").description("Message to confirm the operation"),
    responseData: routeImporter_1.Joi.array().items(categoryType).min(0).description('Array of category type objects')
}).label('category-types-response').description('List of all category types in array format');
exports.categoryTypesResponse = categoryTypesResponse;
const filters = {
    "searchText": routeImporter_1.Joi.string().trim().optional().allow(null).description("Search Text")
};
const listCategoryTypeRequest = routeImporter_1.Joi.object().keys({
    searchText: routeImporter_1.Joi.string().trim().optional().allow(null).description("Search Text"),
    page: routeImporter_1.Joi.number().optional().min(1).default(1),
    perPage: routeImporter_1.Joi.number().optional().min(1).default(+process.env.PAGINATION_LIMIT),
    showRevisions: routeImporter_1.Joi.boolean().default(false).valid(true, false).example(false).description("If request is to list all category types or revisions of a category. For revisions id is required parameter"),
}).label('category-type-list-request').description('Categorytype list request with filters');
exports.listCategoryTypeRequest = listCategoryTypeRequest;
const listCategoryTypeResponse = routeImporter_1.Joi.object().keys({
    message: routeImporter_1.Joi.string().example("Confirmation message").description("Message to confirm the operation"),
    responseData: routeImporter_1.Joi.object().keys({
        data: routeImporter_1.Joi.array().items(categoryType).min(0).description('Array of category type objects'),
        perPage: routeImporter_1.Joi.number().example(1).description("Number or required in response"),
        page: routeImporter_1.Joi.number().example(1).description("page no for which data is requested"),
        totalPages: routeImporter_1.Joi.number().example(1).description("Total number of pages response set will generate"),
        totalRecords: routeImporter_1.Joi.number().example(35).description("Total number of pages response set will generate")
    }).label('category-type-list-responseData').description('Categorytype list response data object')
}).label('category-type-list-response').description('Categorytype list response');
exports.listCategoryTypeResponse = listCategoryTypeResponse;
const categoryTypeStatusRequest = routeImporter_1.Joi.object().keys({
    status: routeImporter_1.Joi.boolean().required().error(errors => { return routeImporter_1.Common.routeError(errors, 'CATEGORY__TYPE_STATUS_IS_REQUIRED'); }).valid(true, false).description("Status of the category type")
}).label('category-type-status-request').description("Request to update the status of the category type");
exports.categoryTypeStatusRequest = categoryTypeStatusRequest;
