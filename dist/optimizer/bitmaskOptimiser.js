"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runOptimizer = void 0;
const runOptimizer = (truck, orders) => {
    const n = orders.length;
    let bestPayout = 0;
    let bestMask = 0;
    const dpWeight = new Array(1 << n).fill(0);
    const dpVolume = new Array(1 << n).fill(0);
    const dpPayout = new Array(1 << n).fill(0);
    const dpHazmat = new Array(1 << n).fill(0);
    for (let mask = 1; mask < (1 << n); mask++) {
        const lsb = mask & -mask;
        const idx = Math.log2(lsb);
        const prev = mask ^ lsb;
        dpWeight[mask] = dpWeight[prev] + orders[idx].weight_lbs;
        dpVolume[mask] = dpVolume[prev] + orders[idx].volume_cuft;
        dpPayout[mask] = dpPayout[prev] + orders[idx].payout_cents;
        dpHazmat[mask] = dpHazmat[prev] | (orders[idx].is_hazmat ? 1 : 2);
        // 🚫 Reject mixed hazmat + non-hazmat
        if (dpHazmat[mask] === 3) {
            continue;
        }
        // 🚫 Constraint check
        if (dpWeight[mask] > truck.max_weight_lbs ||
            dpVolume[mask] > truck.max_volume_cuft) {
            continue;
        }
        // ✅ Maximize payout
        if (dpPayout[mask] > bestPayout) {
            bestPayout = dpPayout[mask];
            bestMask = mask;
        }
    }
    // 🔍 Extract selected orders
    const selectedOrders = [];
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
        utilization_weight_percent: (totalWeight / truck.max_weight_lbs) * 100,
        utilization_volume_percent: (totalVolume / truck.max_volume_cuft) * 100
    };
};
exports.runOptimizer = runOptimizer;
