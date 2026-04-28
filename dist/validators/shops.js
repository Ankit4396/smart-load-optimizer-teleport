"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUrlRequest = exports.shopSettingsRequest = exports.listShopRequest = exports.createShopRequest = void 0;
const routeImporter_1 = require("../config/routeImporter");
const createShopRequest = routeImporter_1.Joi.object().keys({
    contactName: routeImporter_1.Joi.string().trim().required()
        .example("John Doe")
        .description("The name of the contact person for the shop.")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'CONTACT_NAME_MUST_BE_STRING'); }),
    contactEmail: routeImporter_1.Joi.string().trim().optional().allow(null)
        .example("contact@example.com")
        .description("The contact email address for the shop. Can be null if not provided.")
        .default(null)
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'CONTACT_EMAIL_MUST_BE_STRING'); }),
    contactCountryCode: routeImporter_1.Joi.string().trim().optional().allow(null)
        .example("+1")
        .description("The country code for the contact phone number. Can be null if not provided.")
        .default(null)
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'CONTACT_COUNTRY_CODE_MUST_BE_STRING'); }),
    contactPhone: routeImporter_1.Joi.string().trim().optional().allow(null)
        .example("1234567890")
        .description("The contact phone number for the shop. Can be null if not provided.")
        .default(null)
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'CONTACT_PHONE_MUST_BE_STRING'); }),
    code: routeImporter_1.Joi.string().trim().regex(/^[a-zA-Z0-9-]+$/).required()
        .example("shop-123")
        .description("The unique subdomain code for the shop, containing only valid characters, numbers, and hyphens.")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'SUBDOMAIN_CODE_INVALID'); }),
    name: routeImporter_1.Joi.string().trim().required()
        .example("Shop Name")
        .description("The name of the shop. Must be a non-empty string.")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'SHOP_NAME_MUST_BE_STRING'); }),
    description: routeImporter_1.Joi.string().trim().optional().allow(null, "")
        .example("A brief description of the shop")
        .description("An optional description of the shop. Can be null or an empty string if not provided.")
        .default(null)
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'DESCRIPTION_MUST_BE_STRING'); }),
}).label('create-shop-request')
    .description("Schema for validating the request to create a shop, including contact details, shop subdomain code, name, and optional description.");
exports.createShopRequest = createShopRequest;
const generateUrlRequest = routeImporter_1.Joi.object().keys({
    code: routeImporter_1.Joi.string().trim().regex(/^[a-zA-Z0-9-]+$/).required()
        .example("shop-123")
        .description("The subdomain code, which must include only valid characters (letters, numbers, and hyphens).")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'SUBDOMAIN_CODE_INVALID'); }),
}).label('generate-url-request')
    .description("Schema for validating a subdomain code used to generate URLs. Ensures that the code contains only valid characters such as letters, numbers, and hyphens.");
exports.generateUrlRequest = generateUrlRequest;
const listShopRequest = routeImporter_1.Joi.object().keys({
    userId: routeImporter_1.Joi.number().optional().allow(null).default(null)
        .description("The user ID for filtering the shop list. If not provided, no user-specific filter is applied."),
    searchText: routeImporter_1.Joi.string().trim().optional().allow(null)
        .description("Text used for searching shops. If not provided, the search is not filtered by text."),
    page: routeImporter_1.Joi.number().optional().min(1).default(1)
        .description("The page number for pagination. Defaults to 1 if not provided."),
    perPage: routeImporter_1.Joi.number().integer().optional().min(1).default(+process.env.PAGINATION_LIMIT)
        .description("The number of items to display per page. Defaults to the value defined in the environment variable `PAGINATION_LIMIT`.")
}).label('list-shop-request')
    .description("Schema for requesting a list of shops with optional filters and pagination settings.");
exports.listShopRequest = listShopRequest;
const shopSettingsRequest = routeImporter_1.Joi.object().keys({
    bankAccountId: routeImporter_1.Joi.number().integer().optional().allow(null).default(null)
        .description("bank account id if linked, can be null")
        .example(1),
    slots: routeImporter_1.Joi.array().optional().allow(null).default(null)
        .description("Slot object containing shop slot settings, can be null")
        .example([{ startTime: "09:00", endTime: "17:00" }]),
    settings: routeImporter_1.Joi.object().optional().allow(null).default(null)
        .description("Settings object containing additional shop settings, can be null")
        .example({ key1: "value1", key2: "value2" }),
    attachments: routeImporter_1.Joi.array().optional().allow(null).default(null)
        .description("Settings object containing additional shop settings, can be null")
        .example([{ type: "cover", attachmentId: 1 }]),
    meta: routeImporter_1.Joi.object().optional().allow(null).default(null)
        .description("Settings object containing additional shop settings, can be null")
        .example({ key1: "value1", key2: "value2" }),
    social: routeImporter_1.Joi.object().optional().allow(null).default(null)
        .description("Settings object containing additional shop settings, can be null")
        .example({ key1: "value1", key2: "value2" }),
}).label('shop-settings-request').description('Request for updating shop settings');
exports.shopSettingsRequest = shopSettingsRequest;
