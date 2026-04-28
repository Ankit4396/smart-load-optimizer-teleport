"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.status = void 0;
const healthCheck_1 = require("../services/healthCheck");
const status = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = (0, healthCheck_1.getHealthStatus)();
        return h.response({
            message: "Server running",
            responseData: data
        }).code(200);
    }
    catch (error) {
        return h.response({
            message: error.message || 'Internal Server Error'
        }).code(500);
    }
});
exports.status = status;
