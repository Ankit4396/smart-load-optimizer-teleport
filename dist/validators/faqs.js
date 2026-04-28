"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryFilter = exports.sortResponse = exports.sortRequest = exports.faqStatusRequest = exports.listFaqResponse = exports.listFaqRequest = exports.faqsResponse = exports.faqDeleteResponse = exports.faqResponse = exports.faqIdentity = exports.faqRequest = void 0;
const routeImporter_1 = require("../config/routeImporter");
const { userObject } = require("./relations");
const faqRequest = routeImporter_1.Joi.object().keys({
    question: routeImporter_1.Joi.string().trim().required().error(errors => { return routeImporter_1.Common.routeError(errors, 'FAQ_QUESTION_IS_REQUIRED'); }).example("Question title ").description('Question is required'),
    answer: routeImporter_1.Joi.string().trim().required().error(errors => { return routeImporter_1.Common.routeError(errors, 'FAQ_ANSWER_IS_REQUIRED'); }).example("Answer to the question").description('Detailed answer to the question'),
    categoryId: routeImporter_1.Joi.number().integer().allow(null).optional().default(null).error(errors => { return routeImporter_1.Common.routeError(errors, 'CATEGORY_ID_SHOULD_BE_A_VALID_NUMBER'); }).example(1).description('ref category id')
}).label('faq-request').description('Create a FAQ entry');
exports.faqRequest = faqRequest;
const faqIdentity = routeImporter_1.Joi.object().keys({
    id: routeImporter_1.Joi.number().required().example(1).description("Unique identifier for the faq"),
}).label('faq-identiry').description('Identifier for the content type');
exports.faqIdentity = faqIdentity;
const faq = routeImporter_1.Joi.object().keys({
    id: routeImporter_1.Joi.number().example(1).description("Unique identifier for the faq"),
    categoryId: routeImporter_1.Joi.number().allow(null).example(1).example("category"),
    question: routeImporter_1.Joi.string().example("Question title").description('Question'),
    answer: routeImporter_1.Joi.string().example("Answer to the question").description('Answer'),
    author: userObject.allow(null),
    updatedBy: userObject.allow(null),
    status: routeImporter_1.Joi.number().example(1).valid(0, 1).description("Activation status"),
    isRevision: routeImporter_1.Joi.boolean().example(true).allow(null).description("If the entry is stored as revision or not"),
    revisionId: routeImporter_1.Joi.number().example(1).allow(null).description("Ref to the revision entity"),
    createdAt: routeImporter_1.Joi.date().example("2023-01-02T12:18:55.000Z").description("creation date"),
    updatedAt: routeImporter_1.Joi.date().example("2023-01-02T12:18:55.000Z").description("last update date")
}).label('FAQ').description('FAQ object');
const faqResponse = routeImporter_1.Joi.object().keys({
    message: routeImporter_1.Joi.string().example("Request status message").description("Message to confirm the operation"),
    responseData: faq
}).label('faq-response').description('FAQ response object');
exports.faqResponse = faqResponse;
const faqDeletedObj = faq.keys({ deletedAt: routeImporter_1.Joi.date().example("2023-01-02T12:18:55.000Z").description("Date when record was deleted"), }).label('deleted-faq').description('Deleted models for FAQ');
const faqDeleteResponse = routeImporter_1.Joi.object().keys({
    message: routeImporter_1.Joi.string().example("Request status message").description("Message to confirm the operation"),
    responseData: faqDeletedObj
}).label('faq-delete-response').description('FAQ response object');
exports.faqDeleteResponse = faqDeleteResponse;
const faqsResponse = routeImporter_1.Joi.object().keys({
    message: routeImporter_1.Joi.string().example("Request status message").description("Message to confirm the operation"),
    responseData: routeImporter_1.Joi.array().items(faq).min(0).label('faq-listing').description('Array of faq objects')
}).label('faq-response').description('List of all faq in array format');
exports.faqsResponse = faqsResponse;
const listFaqRequest = routeImporter_1.Joi.object().keys({
    page: routeImporter_1.Joi.number().optional().min(1).default(1),
    parentId: routeImporter_1.Joi.number().optional().default(null),
    perPage: routeImporter_1.Joi.number().optional().min(1).default(+process.env.PAGINATION_LIMIT),
    showRevisions: routeImporter_1.Joi.boolean().optional().default(false).valid(true, false).example(false).description("If request is to list all category types or revisions of a category. For revisions id is required parameter"),
    categoryId: routeImporter_1.Joi.number().optional().default(null).allow(null).example(1),
    searchText: routeImporter_1.Joi.string().trim().optional()
        .example('John Doe')
        .description("Optional text to search and filter users by name")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'SEARCH_TEXT_MUST_BE_STRING'); }),
}).label('faq-list-request').description('FAQ list request with filters');
exports.listFaqRequest = listFaqRequest;
const categoryFilter = routeImporter_1.Joi.object().keys({
    categoryId: routeImporter_1.Joi.number().optional().default(null).allow(null).example(1)
}).label('faq-list-request').description('FAQ list request with filters');
exports.categoryFilter = categoryFilter;
const listFaqResponse = routeImporter_1.Joi.object().keys({
    message: routeImporter_1.Joi.string().example("Request status message").description("Message to confirm the operation"),
    responseData: routeImporter_1.Joi.object().keys({
        data: routeImporter_1.Joi.array().items(faq).min(0).description('Array of faq objects'),
        perPage: routeImporter_1.Joi.number().example(1).description("Number or required in response"),
        page: routeImporter_1.Joi.number().example(1).description("page no for which data is requested"),
        totalPages: routeImporter_1.Joi.number().example(1).description("Total number of pages response set will generate"),
        totalRecords: routeImporter_1.Joi.number().example(1).description("Total number of pages response set will generate")
    }).label('category-list-responseData').description('Category list response data object')
}).label('category-list-response').description('Category list response');
exports.listFaqResponse = listFaqResponse;
const faqStatusRequest = routeImporter_1.Joi.object().keys({
    status: routeImporter_1.Joi.number().required().error(errors => { return routeImporter_1.Common.routeError(errors, 'FAQ_STATUS_IS_REQUIRED'); }).description("Status of the faq")
}).label('faq-status-request').description("Request to update the status of the faq");
exports.faqStatusRequest = faqStatusRequest;
const sortRequest = routeImporter_1.Joi.object().keys({
    sortOrder: routeImporter_1.Joi.number().strict().required().error(errors => { return routeImporter_1.Common.routeError(errors, 'SORT_ORDER_IS_REQUIRED'); }).description("Sort order for the record")
}).label('faq-order-request').description("Request to update the order of the faq");
exports.sortRequest = sortRequest;
const sortResponse = routeImporter_1.Joi.object().keys({
    message: routeImporter_1.Joi.string().example("Request status message").description("Message to confirm the operation")
});
exports.sortResponse = sortResponse;
