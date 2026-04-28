"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appVersionRequest = exports.appVersionResponse = void 0;
const routeImporter_1 = require("../config/routeImporter");
const appVersionRequest = routeImporter_1.Joi.object().keys({
    ios_soft_update: routeImporter_1.Joi.string().trim().required().error(errors => { return routeImporter_1.Common.routeError(errors, 'IOS_SOFT_UPDATE_IS_REQUIRED'); }).example("1.0").description('IOS_SOFT_UPDATE_VERSION'),
    ios_critical_update: routeImporter_1.Joi.string().trim().required().error(errors => { return routeImporter_1.Common.routeError(errors, 'IOS_CRITICAL_UPDATE_IS_REQUIRED'); }).example("1.0").description('IOS_CRITICAL_UPDATE_VERSION'),
    android_soft_update: routeImporter_1.Joi.number().precision(3).required().error(errors => { return routeImporter_1.Common.routeError(errors, 'ANDROID_SOFT_UPDATE_IS_REQUIRED'); }).example("1.0").description('ANDROID_SOFT_UPDATE_VERSION'),
    android_critical_update: routeImporter_1.Joi.number().precision(3).required().error(errors => { return routeImporter_1.Common.routeError(errors, 'ANDROID_CRITICAL_UPDATE_IS_REQUIRED_REQUIRED'); }).example("1.0").description('ANDROID_CRITICAL_UPDATE_VERSION'),
}).label('app-version-response').description("Shows App Version Information");
exports.appVersionRequest = appVersionRequest;
const appVersionResponse = routeImporter_1.Joi.object().keys({
    message: routeImporter_1.Joi.string().trim().description('App Version Information'),
    responseData: routeImporter_1.Joi.object().keys({
        ios_soft_update: routeImporter_1.Joi.string().trim().description('IOS soft update information'),
        ios_critical_update: routeImporter_1.Joi.string().trim().description('IOS critical update information'),
        android_soft_update: routeImporter_1.Joi.number().precision(3).description('Android soft update information'),
        android_critical_update: routeImporter_1.Joi.number().precision(3).description('Android critical update information'),
    }).label('app-version').allow(null)
}).label('app-version-response').description("Shows App Version Information");
exports.appVersionResponse = appVersionResponse;
