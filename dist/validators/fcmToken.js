"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setFcmToken = exports.updateFcmTokenResponse = exports.updateFcmToken = void 0;
const routeImporter_1 = require("../config/routeImporter");
const updateFcmToken = routeImporter_1.Joi.object().keys({
    deviceType: routeImporter_1.Joi.string().trim().example("WEB").description("Device type").required().error(errors => { return routeImporter_1.Common.routeError(errors, 'DEVICE_TYPE_IS_REQUIRED'); }),
    deviceToken: routeImporter_1.Joi.string().trim().example("fcm_token").description("FCM TOKEN").required().error(errors => { return routeImporter_1.Common.routeError(errors, 'FCM_TOKEN_IS_REQUIRED'); }),
}).label('user-fcm_token-update').description("Request for updating user fcm token");
exports.updateFcmToken = updateFcmToken;
const setFcmToken = routeImporter_1.Joi.object().keys({
    userId: routeImporter_1.Joi.number().optional().example("1").description("User id"),
    deviceToken: routeImporter_1.Joi.string().trim().example("fcm_token").description("FCM TOKEN").required().error(errors => { return routeImporter_1.Common.routeError(errors, 'FCM_TOKEN_IS_REQUIRED'); }),
}).label('user-fcm_token-update').description("Request for updating user fcm token");
exports.setFcmToken = setFcmToken;
const updateFcmTokenResponse = routeImporter_1.Joi.object().keys({
    message: routeImporter_1.Joi.string().trim().description('Request success message'),
}).label('user-update-fcm-token-response').description("Response for updating user's fcm token");
exports.updateFcmTokenResponse = updateFcmTokenResponse;
