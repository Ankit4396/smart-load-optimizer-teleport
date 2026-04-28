"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailTemplateStatusRequest = exports.emailTemplateListRequest = exports.emailTemplate = exports.emailTemplteIdentity = exports.emailTemplateRequest = void 0;
const routeImporter_1 = require("../config/routeImporter");
const emailTemplateRequest = routeImporter_1.Joi.object().keys({
    code: routeImporter_1.Joi.string().trim().required().error(errors => { return routeImporter_1.Common.routeError(errors, 'EMAIL_TEMPLATE_CODE_IS_REQUIRED'); }).example("UNIQUE_CODE").description('Code to uniquely identify email template'),
    title: routeImporter_1.Joi.string().trim().required().error(errors => { return routeImporter_1.Common.routeError(errors, 'EMAIL_TITLE_SUBJECT_IS_REQUIRED'); }).example("Title for template").description('Template title'),
    subject: routeImporter_1.Joi.string().trim().required().error(errors => { return routeImporter_1.Common.routeError(errors, 'EMAIL_TEMPLATE_SUBJECT_IS_REQUIRED'); }).example("Subject line").description('Subject of email with replacement placeholders'),
    message: routeImporter_1.Joi.string().trim().required().error(errors => { return routeImporter_1.Common.routeError(errors, 'EMAIL_TEMPLATE_MESSAGE_IS_REQUIRED'); }).example("Email content").description('Email content with replacement placeholders'),
    replacements: routeImporter_1.Joi.string().trim().optional().allow(null, '').example("Replacement tokens").description('Comma separated keywords for replacements')
}).label('email-template-request').description('Request objest for email template');
exports.emailTemplateRequest = emailTemplateRequest;
const emailTemplteIdentity = routeImporter_1.Joi.object().keys({
    id: routeImporter_1.Joi.number().required().example(1).description("Unique identifier for the email template"),
}).label('category-type-identiry').description('Identifier for the content type');
exports.emailTemplteIdentity = emailTemplteIdentity;
const emailTemplate = routeImporter_1.Joi.object().keys({
    id: routeImporter_1.Joi.number().example(1).description("Unique identifier for the email template"),
    code: routeImporter_1.Joi.string().example('template-code').description("Unique code for email template"),
    title: routeImporter_1.Joi.string().example("Email template title").description('Title of email template'),
    subject: routeImporter_1.Joi.string().trim().example("Subject line").description('Subject of email with replacement placeholders'),
    message: routeImporter_1.Joi.string().trim().example("Email content").description('Email content with replacement placeholders'),
    replacements: routeImporter_1.Joi.string().trim().example("NAME,CODE").description('Raplacement tokens for the email template'),
    userId: routeImporter_1.Joi.number().allow(null).example(1).description("Identity of the user who has created the record"),
    status: routeImporter_1.Joi.number().example(1).valid(0, 1).description("activation status"),
    isRevision: routeImporter_1.Joi.boolean().example(true).allow(null).description("If the entry is stored as revision or not"),
    revisionId: routeImporter_1.Joi.number().example(1).allow(null).description("ref to the revision entity"),
    createdAt: routeImporter_1.Joi.date().example("2023-01-02T12:18:55.000Z").description("creation date"),
    updatedAt: routeImporter_1.Joi.date().example("2023-01-02T12:18:55.000Z").description("last update date")
}).label('email-template').description('Email templare object');
exports.emailTemplate = emailTemplate;
const emailTemplateListRequest = {
    page: routeImporter_1.Joi.number().optional().default(1),
    perPage: routeImporter_1.Joi.number().optional().min(1).default(+process.env.PAGINATION_LIMIT),
};
exports.emailTemplateListRequest = emailTemplateListRequest;
const emailTemplateStatusRequest = routeImporter_1.Joi.object().keys({
    status: routeImporter_1.Joi.boolean().required().error(errors => { return routeImporter_1.Common.routeError(errors, 'EMAIL_TEMPLATE_STATUS_IS_REQUIRED'); }).valid(true, false).description("Status of the email template").default(true)
}).label('email-template-status-request').description("Request to updated status of the email template");
exports.emailTemplateStatusRequest = emailTemplateStatusRequest;
