type Truck = {
    id: string;
    max_weight_lbs: number;
    max_volume_cuft: number;
  };
  
  type Order = {
    id: string;
    payout_cents: number;
    weight_lbs: number;
    volume_cuft: number;
    is_hazmat: boolean;
    pickup_date: string;
    delivery_date: string;
  };
  
  export const runOptimizer = (truck: Truck, orders: Order[]) => {
    const n = orders.length;
  
    let bestPayout = 0;
    let bestMask = 0;
  
    const dpWeight = new Array(1 << n).fill(0);
    const dpVolume = new Array(1 << n).fill(0);
    const dpPayout = new Array(1 << n).fill(0);
    const dpHazmat = new Array(1 << n).fill(0);
  
    // NEW: time tracking
    const dpMaxPickup = new Array(1 << n).fill(null);
    const dpMinDelivery = new Array(1 << n).fill(null);
  
    for (let mask = 1; mask < (1 << n); mask++) {
      const lsb = mask & -mask;
      const idx = Math.log2(lsb);
      const prev = mask ^ lsb;
  
      const order = orders[idx];
  
      dpWeight[mask] = dpWeight[prev] + order.weight_lbs;
      dpVolume[mask] = dpVolume[prev] + order.volume_cuft;
      dpPayout[mask] = dpPayout[prev] + order.payout_cents;
      dpHazmat[mask] = dpHazmat[prev] | (order.is_hazmat ? 1 : 2);
  
      // Reject mixed hazmat + non-hazmat
      if (dpHazmat[mask] === 3) {
        continue;
      }
  
      // NEW: time logic
      const currentPickup = new Date(order.pickup_date);
      const currentDelivery = new Date(order.delivery_date);
  
      if (dpMaxPickup[prev] === null) {
        dpMaxPickup[mask] = currentPickup;
        dpMinDelivery[mask] = currentDelivery;
      } else {
        dpMaxPickup[mask] =
          currentPickup > dpMaxPickup[prev]
            ? currentPickup
            : dpMaxPickup[prev];
  
        dpMinDelivery[mask] =
          currentDelivery < dpMinDelivery[prev]
            ? currentDelivery
            : dpMinDelivery[prev];
      }
  
      // Reject time conflicts
      if (dpMaxPickup[mask] > dpMinDelivery[mask]) {
        continue;
      }
  
      // Constraint check (weight/volume)
      if (
        dpWeight[mask] > truck.max_weight_lbs ||
        dpVolume[mask] > truck.max_volume_cuft
      ) {
        continue;
      }
  
      // Maximize payout
      if (dpPayout[mask] > bestPayout) {
        bestPayout = dpPayout[mask];
        bestMask = mask;
      }
    }
  
    // Extract selected orders
    const selectedOrders: string[] = [];
    let totalWeight = 0;
    let totalVolume = 0;
  
    for (let i = 0; i < n; i++) {
      if (bestMask & (1 << i)) {
        selectedOrders.push(orders[i].id);
        totalWeight += orders[i].weight_lbs;
        totalVolume += orders[i].volume_cuft;
      }
    }
  
    return {
      truck_id: truck.id,
      selected_order_ids: selectedOrders,
      total_payout_cents: bestPayout,
      total_weight_lbs: totalWeight,
      total_volume_cuft: totalVolume,
      utilization_weight_percent:
        (totalWeight / truck.max_weight_lbs) * 100,
      utilization_volume_percent:
        (totalVolume / truck.max_volume_cuft) * 100
    };
  };