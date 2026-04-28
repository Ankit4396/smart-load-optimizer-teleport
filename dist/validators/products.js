"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productApprovalRequest = exports.copyGalleryIdentity = exports.productIdentity = exports.listProductRequest = exports.productRequest = void 0;
const routeImporter_1 = require("../config/routeImporter");
const productRequest = routeImporter_1.Joi.object().keys({
    name: routeImporter_1.Joi.string().trim().required().error(errors => { return routeImporter_1.Common.routeError(errors, 'PRODUCT_NAME_IS_REQUIRED'); }).example("Tshirt").description('Name of the product'),
    attachmentId: routeImporter_1.Joi.number().required().example(101).description('Main image of the product'),
    storeId: routeImporter_1.Joi.number().required().example(101).description('Store id'),
    categoryId: routeImporter_1.Joi.number().required().example(101).description('Category id'),
    basePrice: routeImporter_1.Joi.number().required().example(101).description('Base price'),
    sku: routeImporter_1.Joi.string().required().example(101).description('SKU of the product'),
    description: routeImporter_1.Joi.string().required().example(101).description('Description of the product'),
    keywords: routeImporter_1.Joi.string().optional().example("").description('Keywords for the product'),
    brandId: routeImporter_1.Joi.number().required().example(101).description('Product id'),
    rent: routeImporter_1.Joi.boolean().optional().valid(true, false).description("Is available for rent"),
    buy: routeImporter_1.Joi.boolean().optional().valid(true, false).description("Is available for buying"),
    preLoved: routeImporter_1.Joi.boolean().optional().valid(true, false).description("Can be sold as used product"),
    rentalDurationType: routeImporter_1.Joi.when('rent', {
        is: true,
        then: routeImporter_1.Joi.number().required(),
        otherwise: routeImporter_1.Joi.number().optional().allow(null)
    }),
    rentalDuration: routeImporter_1.Joi.when('rent', {
        is: true,
        then: routeImporter_1.Joi.number().required(),
        otherwise: routeImporter_1.Joi.number().optional().allow(null)
    }),
    rentalPrice: routeImporter_1.Joi.when('rent', {
        is: true,
        then: routeImporter_1.Joi.number().required(),
        otherwise: routeImporter_1.Joi.number().optional().allow(null)
    }),
    securityDeposit: routeImporter_1.Joi.when('rent', {
        is: true,
        then: routeImporter_1.Joi.number().required(),
        otherwise: routeImporter_1.Joi.number().optional().allow(null)
    }),
    prepDays: routeImporter_1.Joi.when('rent', {
        is: true,
        then: routeImporter_1.Joi.number().required(),
        otherwise: routeImporter_1.Joi.number().optional().allow(null)
    }),
    preLovedPrice: routeImporter_1.Joi.when('preLoved', {
        is: true,
        then: routeImporter_1.Joi.number().required(),
        otherwise: routeImporter_1.Joi.number().optional().allow(null)
    }),
    attributes: routeImporter_1.Joi.array().items(routeImporter_1.Joi.object().keys({
        attributeId: routeImporter_1.Joi.number().required()
            .example(1)
            .description("The ID of the attribute. Must be a number.")
            .error(errors => { return routeImporter_1.Common.routeError(errors, 'ATTRIBUTE_ID_MUST_BE_NUMBER'); }),
        values: routeImporter_1.Joi.alternatives().try(routeImporter_1.Joi.string().trim().required()
            .example('Red')
            .description("The value of the attribute. Must be a string."), routeImporter_1.Joi.array().items(routeImporter_1.Joi.string().trim().required())
            .example(['Red', 'Blue'])
            .description("The value of the attribute as an array of strings.")).required()
            .description("The value of the attribute. Can be a string or an array of strings.")
            .error(errors => { return routeImporter_1.Common.routeError(errors, 'VALUE_MUST_BE_STRING_OR_ARRAY'); })
    })).required()
        .description("An array of attribute objects, each containing an attributeId and a value.")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'ATTRIBUTES_MUST_BE_ARRAY_OF_OBJECTS'); })
}).or('rent', 'buy', 'preLoved')
    .error(errors => { return routeImporter_1.Common.routeError(errors, 'AT_LEAST_ONE_OF_RENT_BUY_PRELOVED_MUST_BE_TRUE'); })
    .label('product-request').description('Payload object for creating a new product');
exports.productRequest = productRequest;
const listProductRequest = routeImporter_1.Joi.object().keys({
    searchText: routeImporter_1.Joi.string().trim(),
    page: routeImporter_1.Joi.number().optional().min(1).default(1),
    perPage: routeImporter_1.Joi.number().integer().optional().min(1).default(+process.env.PAGINATION_LIMIT),
    productType: routeImporter_1.Joi.number().optional().valid(1, 2, 3).default(1),
    storeId: routeImporter_1.Joi.number().required(),
    parentProductId: routeImporter_1.Joi.number().optional(),
}).label('product-list-request').description('Product list request ');
exports.listProductRequest = listProductRequest;
const productIdentity = routeImporter_1.Joi.object().keys({
    id: routeImporter_1.Joi.number().required().example(1).description("Unique identifier for the product"),
}).label('product-identity').description('Identifier for product');
exports.productIdentity = productIdentity;
const productApprovalRequest = routeImporter_1.Joi.object().keys({
    id: routeImporter_1.Joi.number().required().example(1).description("Unique identifier for the product"),
    status: routeImporter_1.Joi.number().required().valid(2, 3).example(1).description("Unique identifier for the product"),
    reason: routeImporter_1.Joi.when('status', {
        is: 3,
        then: routeImporter_1.Joi.string().required(),
        otherwise: routeImporter_1.Joi.string().optional().allow(null)
    }).example(1).description("Unique identifier for the product"),
}).label('product-identity').description('Identifier for product');
exports.productApprovalRequest = productApprovalRequest;
const copyGalleryIdentity = routeImporter_1.Joi.object().keys({
    productId: routeImporter_1.Joi.number().required().example(1).description("Unique identifier for the product for which gallery is to be updated"),
    toBeCopiedFromProductId: routeImporter_1.Joi.number().required().example(1).description("Unique identifier for the product from which gallery is to be copied"),
}).label('product-gallery-copy-identity').description('Identifier for copying product gallery');
exports.copyGalleryIdentity = copyGalleryIdentity;
