import { Request, ResponseToolkit } from '@hapi/hapi';
import * as service from '../services/loadOptimizer';

export const optimizeLoad = async (request: Request, h: ResponseToolkit) => {
  try {
    const result = await service.optimize(request.payload as any);
    return h.response(result).code(200);
  } catch (error: any) {
    return h.response({
      message: error.message || 'Internal Server Error'
    }).code(500);
  }
};