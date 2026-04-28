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
const notifications_1 = require("../../controllers/notifications");
module.exports = [
    {
        method: "POST",
        path: "/internal/scheduled-notification",
        options: {
            auth: false, // NO JWT
            tags: ["internal"], // NOT for API users
            description: "Internal cron trigger",
            notes: "Used only by dynamic cron to send scheduled notifications"
        },
        handler: (request, h) => __awaiter(void 0, void 0, void 0, function* () {
            const { title, content } = request.payload;
            yield (0, notifications_1.processScheduledNotification)(title, content, request.headers.language);
            return h.response("OK").code(200);
        })
    }
];
