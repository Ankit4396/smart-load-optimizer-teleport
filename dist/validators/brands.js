"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.brandStatusRequest = exports.listBrandRequest = exports.brandIdentity = exports.brandRequest = void 0;
const routeImporter_1 = require("../config/routeImporter");
const brandRequest = routeImporter_1.Joi.object().keys({
    name: routeImporter_1.Joi.string().trim().required().error(errors => { return routeImporter_1.Common.routeError(errors, 'BRAND_NAME_IS_REQUIRED'); }).example("Gucci").description('It must be unique'),
    attachmentId: routeImporter_1.Joi.number().optional().example(101).description('Logo of the brand'),
}).label('brand-request').description('Payload object for creating a new brand');
exports.brandRequest = brandRequest;
const brandIdentity = routeImporter_1.Joi.object().keys({
    id: routeImporter_1.Joi.number().required().example(1).description("Unique identifier for the brand"),
}).label('brand-identity').description('Identifier for brand');
exports.brandIdentity = brandIdentity;
const listBrandRequest = routeImporter_1.Joi.object().keys({
    searchText: routeImporter_1.Joi.string().trim(),
    page: routeImporter_1.Joi.number().optional().min(1).default(1),
    perPage: routeImporter_1.Joi.number().integer().optional().min(1).default(+process.env.PAGINATION_LIMIT),
}).label('brand-list-request').description('Brand list request ');
exports.listBrandRequest = listBrandRequest;
const brandStatusRequest = routeImporter_1.Joi.object().keys({
    status: routeImporter_1.Joi.boolean().required().error(errors => { return routeImporter_1.Common.routeError(errors, 'BRAND_STATUS_IS_REQUIRED'); }).valid(true, false).description("Status of the brand")
}).label('brand-status-request').description("Request to update the status of the brand");
exports.brandStatusRequest = brandStatusRequest;
