"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.payloadSchema = void 0;
const routeImporter_1 = require("../config/routeImporter");
const payloadSchema = routeImporter_1.Joi.object({
    truck: routeImporter_1.Joi.object({
        id: routeImporter_1.Joi.string().trim().required(),
        max_weight_lbs: routeImporter_1.Joi.number().positive().required(),
        max_volume_cuft: routeImporter_1.Joi.number().positive().required()
    }).required(),
    orders: routeImporter_1.Joi.array()
        .items(routeImporter_1.Joi.object({
        id: routeImporter_1.Joi.string().trim().required(),
        payout_cents: routeImporter_1.Joi.number().integer().min(0).required(),
        weight_lbs: routeImporter_1.Joi.number().positive().required(),
        volume_cuft: routeImporter_1.Joi.number().positive().required(),
        origin: routeImporter_1.Joi.string().trim().required(),
        destination: routeImporter_1.Joi.string().trim().required(),
        pickup_date: routeImporter_1.Joi.date().iso().required(),
        delivery_date: routeImporter_1.Joi.date().iso().min(routeImporter_1.Joi.ref('pickup_date')).required(),
        is_hazmat: routeImporter_1.Joi.boolean().required()
    }))
        .min(1)
        .max(22)
        .required()
});
exports.payloadSchema = payloadSchema;
