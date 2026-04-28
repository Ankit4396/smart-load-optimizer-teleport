import { runOptimizer } from '../optimizer/bitmaskOptimiser';

export const optimize = async (payload: any) => {
  const { truck, orders } = payload;

  // Invalid payload
  if (!truck || !orders || !Array.isArray(orders)) {
    throw new Error('Invalid payload');
  }

  //Handle empty orders
  if (orders.length === 0) {
    return emptyResponse(truck);
  }

  // Basic time validation
  const validOrders = orders.filter((o: any) => {
    return o.pickup_date <= o.delivery_date;
  });

  if (validOrders.length === 0) {
    return emptyResponse(truck);
  }

  // Group by lane
  const laneMap: Record<string, any[]> = {};

  for (const order of validOrders) {
    const key = `${order.origin}__${order.destination}`;
    if (!laneMap[key]) laneMap[key] = [];
    laneMap[key].push(order);
  }

  let bestResult: any = null;

  //Run optimizer per lane
  for (const key in laneMap) {
    const result = runOptimizer(truck, laneMap[key]);

    if (
      !bestResult ||
      result.total_payout_cents > bestResult.total_payout_cents
    ) {
      bestResult = result;
    }
  }

  // If nothing valid found
  if (!bestResult) {
    return emptyResponse(truck);
  }

  // Round percentages
  return {
    ...bestResult,
    utilization_weight_percent: Number(
      bestResult.utilization_weight_percent.toFixed(2)
    ),
    utilization_volume_percent: Number(
      bestResult.utilization_volume_percent.toFixed(2)
    )
  };
};

//Helper for empty response
const emptyResponse = (truck: any) => ({
  truck_id: truck.id,
  selected_order_ids: [],
  total_payout_cents: 0,
  total_weight_lbs: 0,
  total_volume_cuft: 0,
  utilization_weight_percent: 0,
  utilization_volume_percent: 0
});