"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchSupportListRequest = exports.adminReplyRequest = exports.createSupportRequest = void 0;
const routeImporter_1 = require("../config/routeImporter");
// ######################################################################### request validator #########################################################################
const createSupportRequest = routeImporter_1.Joi.object({
    subject: routeImporter_1.Joi.string().trim().example("My ticket is not booked").description("Subject of ticket").error(errors => { return routeImporter_1.Common.routeError(errors, 'SUBJECT_IS_REQUIRED'); }),
    message: routeImporter_1.Joi.string().trim().example("Money deducted and ticket not booked").description("Detail of ticket").error(errors => { return routeImporter_1.Common.routeError(errors, 'MESSAGE_IS_REQUIRED'); }),
});
exports.createSupportRequest = createSupportRequest;
const adminReplyRequest = routeImporter_1.Joi.object({
    adminReply: routeImporter_1.Joi.string().required().label('Admin Reply'),
    status: routeImporter_1.Joi.number().valid(1, 2).required().label('Status (1->In Progress, 2->Closed)'),
});
exports.adminReplyRequest = adminReplyRequest;
const fetchSupportListRequest = routeImporter_1.Joi.object().keys({
    searchText: routeImporter_1.Joi.string().trim().optional()
        .example('John Doe')
        .description("Optional text to search and filter ticket by name")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'SEARCH_TEXT_MUST_BE_STRING'); }),
    page: routeImporter_1.Joi.number().integer().optional().default(1)
        .example(1)
        .description("Optional page number for pagination, default is 1")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'PAGE_NUMBER_MUST_BE_INTEGER'); }),
    perPage: routeImporter_1.Joi.number().integer().optional().default(20)
        .example(20)
        .description("Optional number of ticket per page, default is 20")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'PER_PAGE_MUST_BE_INTEGER'); }),
    sortParameter: routeImporter_1.Joi.string().trim().optional().valid("id", "createdAt", "updatedAt").default("id")
        .example('id')
        .description("Optional parameter to sort ticket by, default is 'id'")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'SORT_PARAMETER_MUST_BE_STRING'); }),
    sortValue: routeImporter_1.Joi.string().trim().optional().valid("asc", "desc").default("desc")
        .example('desc')
        .description("Optional sort order, can be 'asc' or 'desc', default is 'desc'")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'SORT_VALUE_MUST_BE_STRING'); }),
    status: routeImporter_1.Joi.string().trim().optional().default(null)
        .example('active')
        .description("Optional filter to show ticket by their status")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'STATUS_MUST_BE_STRING'); }),
}).label('fetch-ticket-list-request')
    .description("Schema for validating the request to fetch a ticket list, including optional filters, pagination settings, sorting parameters, and status filters.");
exports.fetchSupportListRequest = fetchSupportListRequest;
