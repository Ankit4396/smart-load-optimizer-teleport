"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeStatusRequest = exports.identifierRequest = exports.resp500 = exports.resp400 = exports.respmessage = exports.validator = exports.options = exports.headers = exports.apiheader = exports.optional_authorizedheaders = exports.authorizedheaders = void 0;
const routeImporter_1 = require("../config/routeImporter");
const optional_authorizedheaders = routeImporter_1.Joi.object(routeImporter_1.Common.headers('optionalauthorized')).options({ allowUnknown: true });
exports.optional_authorizedheaders = optional_authorizedheaders;
const authorizedheaders = routeImporter_1.Joi.object(routeImporter_1.Common.headers('authorized')).options({ allowUnknown: true });
exports.authorizedheaders = authorizedheaders;
const headers = routeImporter_1.Joi.object(routeImporter_1.Common.headers(null)).options({ allowUnknown: true });
exports.headers = headers;
const apiheader = routeImporter_1.Joi.object(routeImporter_1.Common.headers('apiheader')).options({ allowUnknown: true });
exports.apiheader = apiheader;
const options = { abortEarly: false, state: { parse: true, failAction: 'error' } };
exports.options = options;
const validator = routeImporter_1.Joi;
exports.validator = validator;
const respmessage = "Confirmation/error message from API";
exports.respmessage = respmessage;
const identifierRequest = routeImporter_1.Joi.object().keys({
    id: routeImporter_1.Joi.string().trim().required()
        .example('1')
        .description("The unique identifier for the entity. Must be a string")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'ID_IS_REQUIRED'); }),
}).label('unique-identifier')
    .description("Schema for requesting a record using a unique identifier.");
exports.identifierRequest = identifierRequest;
const changeStatusRequest = routeImporter_1.Joi.object().keys({
    status: routeImporter_1.Joi.number().integer().valid(0, 1).required()
        .description("Status to be updated, valid values are 0 and 1")
        .example(1)
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'INVALID_STATUS_VALUE'); }),
}).label('change-status-request').description('Request to change status');
exports.changeStatusRequest = changeStatusRequest;
// const identifierRequest = (label: string) => {
//   return (Joi.object().keys({
//     id: Joi.string().trim().required()
//       .example('1')
//       .description("The unique identifier for the entity. Must be a string")
//       .error(errors => { return Common.routeError(errors, 'ID_IS_REQUIRED') }),
//   }).label(`${label}-unique-identifier`)
//     .description("Schema for requesting a record using a unique identifier."))
// }
const resp400 = routeImporter_1.Joi.object().keys({
    statusCode: 400,
    message: routeImporter_1.Joi.string().example('400 error message').description('Error message from server'),
    error: routeImporter_1.Joi.string().example('bad request').description('description of error'),
    errors: routeImporter_1.Joi.object().example('{key:"details of error"}').description('error object with key value pair')
}).unknown(true).label('400-response-model').description('400 response object');
exports.resp400 = resp400;
const resp500 = routeImporter_1.Joi.object().keys({
    statusCode: 500,
    message: routeImporter_1.Joi.string().example('500 internal server error').description('Error message from server'),
    error: routeImporter_1.Joi.string().example('exception encountered while processing request').description('Error details in string format')
}).unknown(true).label('500-response-model').description('500 response object');
exports.resp500 = resp500;
