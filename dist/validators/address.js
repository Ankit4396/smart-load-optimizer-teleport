"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterAddressRequest = exports.addAddressRequest = void 0;
const routeImporter_1 = require("../config/routeImporter");
const addAddressRequest = routeImporter_1.Joi.object().keys({
    mapAddress: routeImporter_1.Joi.string().trim().optional().allow(null, "")
        .example("mapAddress")
        .description("The address as shown on the map")
        .default(null)
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'MAP_ADDRESS_MUST_BE_STRING'); }),
    address: routeImporter_1.Joi.string().trim().optional().allow(null, "")
        .example("address")
        .description("The detailed address")
        .default(null)
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'ADDRESS_MUST_BE_STRING'); }),
    city: routeImporter_1.Joi.string().trim().optional().allow(null, "")
        .example("city")
        .description("The city of the address")
        .default(null)
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'CITY_MUST_BE_STRING'); }),
    state: routeImporter_1.Joi.string().trim().optional().allow(null, "")
        .example("state")
        .description("The state of the address")
        .default(null)
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'STATE_MUST_BE_STRING'); }),
    zipCode: routeImporter_1.Joi.string().trim().optional().allow(null, "")
        .example("zipCode")
        .description("The postal code of the address")
        .default(null)
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'ZIP_CODE_MUST_BE_STRING'); }),
    country: routeImporter_1.Joi.string().trim().optional().allow(null, "")
        .example("country")
        .description("The country of the address")
        .default(null)
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'COUNTRY_MUST_BE_STRING'); }),
    landmark: routeImporter_1.Joi.string().trim().optional().allow(null, "")
        .example("landmark")
        .description("A nearby landmark to help identify the address")
        .default(null)
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'LANDMARK_MUST_BE_STRING'); }),
    latitude: routeImporter_1.Joi.string().trim().optional().allow(null, "")
        .example("latitude")
        .description("The latitude of the address location")
        .default(null)
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'LATITUDE_MUST_BE_STRING'); }),
    longitude: routeImporter_1.Joi.string().trim().optional().allow(null, "")
        .example("longitude")
        .description("The longitude of the address location")
        .default(null)
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'LONGITUDE_MUST_BE_STRING'); }),
    geoLocation: routeImporter_1.Joi.any().optional().allow(null, "")
        .example("longitude")
        .description("The longitude of the address location")
        .default(null)
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'LONGITUDE_MUST_BE_STRING'); }),
    addressLine1: routeImporter_1.Joi.string().trim().optional().allow(null, "")
        .example("addressLine1")
        .description("The first line of the address")
        .default(null)
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'ADDRESS_LINE_1_MUST_BE_STRING'); }),
    addressLine2: routeImporter_1.Joi.string().trim().optional().allow(null, "")
        .example("addressLine2")
        .description("The second line of the address")
        .default(null)
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'ADDRESS_LINE_2_MUST_BE_STRING'); }),
    name: routeImporter_1.Joi.string().trim().optional().allow(null, "")
        .example("label")
        .description("label of the address")
        .default(null)
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'NAME_MUST_BE_STRING'); }),
    countryCode: routeImporter_1.Joi.string().trim().optional().allow(null, "")
        .example("phone")
        .description("phone associated with that address")
        .default(null)
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'COUNTRY_CODE_MUST_BE_STRING'); }),
    phone: routeImporter_1.Joi.string().trim().optional().allow(null, "")
        .example("phone")
        .description("phone associated with that address")
        .default(null)
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'PHONE_MUST_BE_STRING'); }),
    entityType: routeImporter_1.Joi.string().trim().optional().allow(null, "").valid(null, "buyer", "seller", "store")
        .example("buyer | seller | store")
        .description("phone associated with that address")
        .default(null)
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'ENTITY_TYPE_MUST_BE_STRING'); }),
    addressType: routeImporter_1.Joi.string().trim().optional().allow(null, "").valid(null, "pickup", "return", "other")
        .example("pickup | return | other")
        .description("phone associated with that address")
        .default(null)
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'ADDRESS_TYPE_MUST_BE_STRING'); }),
    shopId: routeImporter_1.Joi.number().optional().allow(null)
        .example(123)
        .description("Specifies the shop ID for filtering addresses")
        .default(null)
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'SHOP_ID_MUST_BE_NUMBER'); }),
}).label('add-address-request')
    .description("Schema for validating the add address request, including map address, detailed address, city, state, zip code, country, landmark, latitude, longitude, and address lines 1 and 2.");
exports.addAddressRequest = addAddressRequest;
const filterAddressRequest = routeImporter_1.Joi.object().keys({
    entityType: routeImporter_1.Joi.string().trim().optional().allow(null).valid(null, "buyer", "seller", "store")
        .example("buyer | seller | store")
        .description("Specifies the type of entity associated with the address (e.g., buyer, seller, store)")
        .default(null)
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'ENTITY_TYPE_MUST_BE_STRING'); }),
    addressType: routeImporter_1.Joi.string().trim().optional().allow(null).valid(null, "pickup", "return", "other")
        .example("pickup | return | other")
        .description("Specifies the type of address (e.g., pickup, return, other)")
        .default(null)
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'ADDRESS_TYPE_MUST_BE_STRING'); }),
    shopId: routeImporter_1.Joi.number().optional().allow(null)
        .example(123)
        .description("Specifies the shop ID for filtering addresses")
        .default(null)
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'SHOP_ID_MUST_BE_NUMBER'); }),
}).label('filter-address-request')
    .description("Schema for validating the filter address request, including entity type, address type, and shop ID.");
exports.filterAddressRequest = filterAddressRequest;
