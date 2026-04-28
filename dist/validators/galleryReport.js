"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportGalleryRequest = exports.galleryIdentity = void 0;
const joi_1 = __importDefault(require("joi"));
// ID Param Validator (for get/update/delete/status routes)
exports.galleryIdentity = joi_1.default.object({
    galleryId: joi_1.default.number().required().description("Gallery ID").optional()
});
exports.reportGalleryRequest = joi_1.default.object({
    galleryId: joi_1.default.number().required().example(12),
    reason: joi_1.default.string().required().example("Inappropriate content")
});
