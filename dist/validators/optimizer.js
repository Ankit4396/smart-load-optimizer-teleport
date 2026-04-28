"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.payloadSchema = void 0;
const routeImporter_1 = require("../config/routeImporter");
const payloadSchema = routeImporter_1.Joi.object({
    truck: routeImporter_1.Joi.object({
        id: routeImporter_1.Joi.string().required(),
        max_weight_lbs: routeImporter_1.Joi.number().positive().required(),
        max_volume_cuft: routeImporter_1.Joi.number().positive().required()
    }).required(),
    orders: routeImporter_1.Joi.array()
        .items(routeImporter_1.Joi.object({
        id: routeImporter_1.Joi.string().required(),
        payout_cents: routeImporter_1.Joi.number().integer().min(0).required(),
        weight_lbs: routeImporter_1.Joi.number().positive().required(),
        volume_cuft: routeImporter_1.Joi.number().positive().required(),
        origin: routeImporter_1.Joi.string().required(),
        destination: routeImporter_1.Joi.string().required(),
        pickup_date: routeImporter_1.Joi.string().required(),
        delivery_date: routeImporter_1.Joi.string().required(),
        is_hazmat: routeImporter_1.Joi.boolean().required()
    }))
        .min(1)
        .required()
});
exports.payloadSchema = payloadSchema;
