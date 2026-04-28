"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTokenRequest = exports.signDocumentRequest = exports.slugRequest = exports.getDocumentListRequest = exports.generateDocumentRequest = void 0;
const routeImporter_1 = require("../config/routeImporter");
const generateDocumentRequest = routeImporter_1.Joi.object().keys({
    userId: routeImporter_1.Joi.number().required()
        .example(1)
        .description("User Id for whom the agreement to be generated")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'USER_ID_IS_REQUIRED_AND_MUST_BE_NUMBER'); }),
    commissionRateBuy: routeImporter_1.Joi.number().required()
        .example(5.0)
        .description("The commission rate for the seller")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'COMMISSION_RATE_IS_REQUIRED_AND_MUST_BE_NUMBER'); }),
    commissionRateRent: routeImporter_1.Joi.number().required()
        .example(5.0)
        .description("The commission rate for the seller")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'COMMISSION_RATE_IS_REQUIRED_AND_MUST_BE_NUMBER'); }),
    commissionRatePreloved: routeImporter_1.Joi.number().required()
        .example(5.0)
        .description("The commission rate for the seller")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'COMMISSION_RATE_IS_REQUIRED_AND_MUST_BE_NUMBER'); }),
    creditCardProcessingFee: routeImporter_1.Joi.number().required()
        .example(2.5)
        .description("The credit card processing fee")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'CREDIT_CARD_PROCESSING_FEE_IS_REQUIRED_AND_MUST_BE_NUMBER'); }),
    orderExecutionTime: routeImporter_1.Joi.string().trim().required()
        .example('24 hours')
        .description("The order execution time")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'ORDER_EXECUTION_TIME_IS_REQUIRED_AND_MUST_BE_STRING'); }),
    shippingPenality48to96h: routeImporter_1.Joi.number().required()
        .example(50)
        .description("The shipping penalty for 48 to 96 hours")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'SHIPPING_PENALTY_48_TO_96H_IS_REQUIRED_AND_MUST_BE_NUMBER'); }),
    shippingPenality96hAbove: routeImporter_1.Joi.number().required()
        .example(100)
        .description("The shipping penalty for above 96 hours")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'SHIPPING_PENALTY_96H_ABOVE_IS_REQUIRED_AND_MUST_BE_NUMBER'); }),
    compensation: routeImporter_1.Joi.number().required()
        .example(1000)
        .description("The compensation amount")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'COMPENSATION_IS_REQUIRED_AND_MUST_BE_NUMBER'); }),
    payoutDuration: routeImporter_1.Joi.number().required()
        .example(30)
        .description("The payout duration in days")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'PAYOUT_DURATION_IS_REQUIRED_AND_MUST_BE_NUMBER'); }),
    terminationDuration: routeImporter_1.Joi.number().required()
        .example(60)
        .description("The termination duration in days")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'TERMINATION_DURATION_IS_REQUIRED_AND_MUST_BE_NUMBER'); }),
    businessName: routeImporter_1.Joi.string().trim().required()
        .example('Example Business')
        .description("The name of the business")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'BUSINESS_NAME_IS_REQUIRED_AND_MUST_BE_STRING'); }),
    companyAddress: routeImporter_1.Joi.string().trim().required()
        .example('123 Example Street, Example City, EX 12345')
        .description("The address of the company")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'COMPANY_ADDRESS_IS_REQUIRED_AND_MUST_BE_STRING'); }),
    phone: routeImporter_1.Joi.string().trim().required()
        .example('+1234567890')
        .description("The contact phone number")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'PHONE_IS_REQUIRED_AND_MUST_BE_STRING'); }),
    taxIdNumber: routeImporter_1.Joi.string().trim().required()
        .example('AB123456C')
        .description("The tax identification number")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'TAX_ID_NUMBER_IS_REQUIRED_AND_MUST_BE_STRING'); }),
    contactName: routeImporter_1.Joi.string().trim().required()
        .example('John Doe')
        .description("The contact name")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'CONTACT_NAME_IS_REQUIRED_AND_MUST_BE_STRING'); }),
    contactEmail: routeImporter_1.Joi.string().trim().email().required()
        .example('contact@example.com')
        .description("The contact email address")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'CONTACT_EMAIL_IS_REQUIRED_AND_MUST_BE_VALID_EMAIL'); }),
    contactDirectDial: routeImporter_1.Joi.string().trim().required()
        .example('+0987654321')
        .description("The direct dial number for the contact")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'CONTACT_DIRECT_DIAL_IS_REQUIRED_AND_MUST_BE_STRING'); }),
}).label('generate-document-request')
    .description("Schema for generating a document, including required fields such as commission rate, credit card processing fee, order execution time, shipping penalties, compensation, payout and termination durations, business name, company address, phone, tax ID number, contact name, contact email, and contact direct dial.");
exports.generateDocumentRequest = generateDocumentRequest;
const getDocumentListRequest = routeImporter_1.Joi.object().keys({
    isRevision: routeImporter_1.Joi.boolean().optional()
        .example(false)
        .default(null)
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'IS_REVISION_MUST_BE_A_VALID_VALUE'); })
}).label('get-document-request')
    .description("Schema for generating a document, including required fields such as commission rate, credit card processing fee, order execution time, shipping penalties, compensation, payout and termination durations, business name, company address, phone, tax ID number, contact name, contact email, and contact direct dial.");
exports.getDocumentListRequest = getDocumentListRequest;
const slugRequest = routeImporter_1.Joi.object().keys({
    slug: routeImporter_1.Joi.string().trim().required().error(errors => { return routeImporter_1.Common.routeError(errors, 'SLUG_MUST_BE_A_VALID_VALUE'); }),
    // time: Joi.string().optional().allow(null).default(null).error(errors => { return Common.routeError(errors, 'SLUG_MUST_BE_A_VALID_VALUE') }),
}).label('my-directories-request').description('Request to get all account directories');
exports.slugRequest = slugRequest;
const signDocumentRequest = routeImporter_1.Joi.object().keys({
    documentId: routeImporter_1.Joi.number().required()
        .example(1)
        .description("The ID of the document to be signed")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'DOCUMENT_ID_IS_REQUIRED_AND_MUST_BE_NUMBER'); }),
    attachmentId: routeImporter_1.Joi.number().required()
        .example(100)
        .description("The ID of the attachment")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'ATTACHMENT_ID_IS_REQUIRED_AND_MUST_BE_NUMBER'); })
}).label('sign-document-request')
    .description("Schema for signing a document, including required fields such as document ID and attachment ID.");
exports.signDocumentRequest = signDocumentRequest;
const verifyTokenRequest = routeImporter_1.Joi.object().keys({
    token: routeImporter_1.Joi.string().trim().required()
        .example('otp_token_value')
        .description("The OTP token that was received after sending the OTP request")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'TOKEN_IS_REQUIRED'); }),
    code: routeImporter_1.Joi.string().trim().required()
        .example('9999')
        .description("The OTP code received by the user for verification")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'CODE_IS_REQUIRED_AND_MUST_BE_NUMERIC'); })
}).label('verify-token-request')
    .description("Schema for validating the OTP verification request, including the token and the code received by the user.");
exports.verifyTokenRequest = verifyTokenRequest;
