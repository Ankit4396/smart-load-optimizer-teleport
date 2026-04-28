"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attributeStatusRequest = exports.listAttributeRequest = exports.attributeIdentity = exports.attributeRequest = void 0;
const routeImporter_1 = require("../config/routeImporter");
const attributeOptions = routeImporter_1.Joi.object().keys({
    id: routeImporter_1.Joi.number().example("12").description('Id of the attribute option'),
    isDeleted: routeImporter_1.Joi.boolean().example("true").description('If this attribute option needs to be deleted'),
    name: routeImporter_1.Joi.string().example("Option name").description('name of the option'),
}).label('attribute-option').description('Attribute option');
const attributeRequest = routeImporter_1.Joi.object().keys({
    name: routeImporter_1.Joi.string().trim().required().error(errors => { return routeImporter_1.Common.routeError(errors, 'ATTRIBUTE_NAME_IS_REQUIRED'); }).example("Color").description('It must be unique for attributes'),
    type: routeImporter_1.Joi.number().example(1).description('1 => Text field, 2 => Dropdown field').optional().allow(null).default(null),
    isVariant: routeImporter_1.Joi.number().example(1).description("0 or 1, whether this is variant attribute or not").optional().allow(null).default(null),
    options: routeImporter_1.Joi.array().items(attributeOptions).min(0).label('options-listing').description('Array of options objects')
}).label('attribute-request').description('Payload object for creating a new attribute');
exports.attributeRequest = attributeRequest;
const attributeIdentity = routeImporter_1.Joi.object().keys({
    id: routeImporter_1.Joi.number().required().example(1).description("Unique identifier for the attribute"),
}).label('attribute-identity').description('Identifier for attribute');
exports.attributeIdentity = attributeIdentity;
const listAttributeRequest = routeImporter_1.Joi.object().keys({
    page: routeImporter_1.Joi.number().optional().min(1).default(1),
    perPage: routeImporter_1.Joi.number().integer().optional().min(1).default(+process.env.PAGINATION_LIMIT),
}).label('attributes-list-request').description('Attributes list request ');
exports.listAttributeRequest = listAttributeRequest;
const attributeStatusRequest = routeImporter_1.Joi.object().keys({
    status: routeImporter_1.Joi.boolean().required().error(errors => { return routeImporter_1.Common.routeError(errors, 'ATTRIBUTE_STATUS_IS_REQUIRED'); }).valid(true, false).description("Status of the attribute")
}).label('attribute-status-request').description("Request to update the status of the attribute");
exports.attributeStatusRequest = attributeStatusRequest;
