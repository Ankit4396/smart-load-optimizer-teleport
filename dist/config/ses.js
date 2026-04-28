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
exports.sendEmailSES = void 0;
const client_ses_1 = require("@aws-sdk/client-ses");
const sesClient = new client_ses_1.SESClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
const sendEmailSES = (_a) => __awaiter(void 0, [_a], void 0, function* ({ to, subject, htmlBody }) {
    try {
        const command = new client_ses_1.SendEmailCommand({
            Source: process.env.SES_FROM_EMAIL,
            Destination: {
                ToAddresses: [to],
            },
            Message: {
                Subject: {
                    Data: subject,
                },
                Body: {
                    Html: {
                        Data: htmlBody,
                    },
                },
            },
        });
        const response = yield sesClient.send(command);
        return response;
    }
    catch (error) {
        console.error("SES Error:", error);
        throw error;
    }
});
exports.sendEmailSES = sendEmailSES;
