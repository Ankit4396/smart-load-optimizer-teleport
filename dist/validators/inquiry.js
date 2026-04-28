"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listInquiryRequest = exports.inquiryStatusRequest = exports.inquiryIdentity = exports.inquiryRequest = void 0;
const joi_1 = __importDefault(require("joi"));
const Constants = __importStar(require("../constants"));
// Create & Update Inquiry Payload
exports.inquiryRequest = joi_1.default.object({
    name: joi_1.default.string().required().description("Name of the inquiry"),
    date: joi_1.default.date().required().description("Date of the inquiry"),
    bookingId: joi_1.default.number().optional().allow(null).description("Booking ID"),
    eventId: joi_1.default.number().optional().allow(null).description("Event ID"),
    slot: joi_1.default.string().optional().allow(null).description("Event slot"),
    partySize: joi_1.default.string().optional().allow(null).description("Party size"),
    message: joi_1.default.string().optional().allow(null).description("Message"),
    contactCountryCode: joi_1.default.string().optional().allow(null).description("Country Code"),
    contactNumber: joi_1.default.string().required().description("Contact number")
});
// ID Param Validator (for get/update/delete/status routes)
exports.inquiryIdentity = joi_1.default.object({
    id: joi_1.default.number().required().description("Inquiry ID")
});
// Status Update Payload
exports.inquiryStatusRequest = joi_1.default.object({
    status: joi_1.default.number()
        .valid(...Object.values(Constants.USER_STATUS))
        .required()
        .description("New status")
});
// List Queries for Admin or User
exports.listInquiryRequest = joi_1.default.object({
    page: joi_1.default.number().optional().min(1).default(1)
        .description("Pagination page number."),
    perPage: joi_1.default.number().integer().optional().min(1).default(+process.env.PAGINATION_LIMIT)
        .description("Number of results per page."),
    search: joi_1.default.string().optional().allow("", null).description("Search keyword"),
    eventId: joi_1.default.number().optional().allow(null).description("Filter by Event ID"),
    bookingId: joi_1.default.number().optional().allow(null).description("Filter by Booking ID"),
    fromDate: joi_1.default.date().optional().description("Start Date"),
    toDate: joi_1.default.date().optional().description("End Date")
});
