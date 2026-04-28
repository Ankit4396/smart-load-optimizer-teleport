import Hapi from "@hapi/hapi";
import { getHealthStatus } from "../services/healthCheck";

const status = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  try {
    const data = getHealthStatus();

    return h.response({
      message: "Server running",
      responseData: data
    }).code(200);

  } catch (error: any) {
    return h.response({
      message: error.message || 'Internal Server Error'
    }).code(500);
  }
};

export {
  status
};