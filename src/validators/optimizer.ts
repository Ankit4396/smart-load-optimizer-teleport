import { Joi } from "../config/routeImporter";

const payloadSchema = Joi.object({
  truck: Joi.object({
    id: Joi.string().trim().required(),
    max_weight_lbs: Joi.number().positive().required(),
    max_volume_cuft: Joi.number().positive().required()
  }).required(),

  orders: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().trim().required(),
        payout_cents: Joi.number().integer().min(0).required(),
        weight_lbs: Joi.number().positive().required(),
        volume_cuft: Joi.number().positive().required(),

        origin: Joi.string().trim().required(),
        destination: Joi.string().trim().required(),

        pickup_date: Joi.date().iso().required(),
        delivery_date: Joi.date().iso().min(Joi.ref('pickup_date')).required(),

        is_hazmat: Joi.boolean().required()
      })
    )
    .min(1)
    .max(22)
    .required()
});

export { payloadSchema };