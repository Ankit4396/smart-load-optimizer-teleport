import { ServerRoute } from '@hapi/hapi';
import Joi from 'joi';
import * as controller from '../controllers/loadOptimize';
import {payloadSchema} from '../validators/optimizer'


const headerSchema = Joi.object({
    'x-api-key': Joi.string().required()
  }).unknown();

const routes: ServerRoute[] = [
  {
    method: 'POST',
    path: '/api/v1/load-optimizer/optimize',
    handler: controller.optimizeLoad,
    options: {
      tags: ['api'],
      description: 'Optimize truck load',
      validate: {
        headers: headerSchema,
        payload: payloadSchema,
        failAction: (request, h, err) => {
          throw err;
        }
      }
    }
  }
];

export default routes;