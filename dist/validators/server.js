"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.status = void 0;
const joi_1 = __importDefault(require("joi"));
;
const status = joi_1.default.object({
    message: joi_1.default.string().required().trim().example("Running status of the server").description("Success message"),
}).label('running-server-response').description("Shows if the server is accessible");
exports.status = status;
