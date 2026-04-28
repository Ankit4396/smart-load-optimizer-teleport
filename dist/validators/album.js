"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAlbumRequest = void 0;
const joi_1 = __importDefault(require("joi"));
exports.listAlbumRequest = joi_1.default.object({
    page: joi_1.default.number().optional().min(1).default(1)
        .description("Pagination page number."),
    perPage: joi_1.default.number().integer().optional().min(1).default(+process.env.PAGINATION_LIMIT)
        .description("Number of results per page."),
    title: joi_1.default.string().optional().example("CityFest")
});
