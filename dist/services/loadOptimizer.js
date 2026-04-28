"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optimize = void 0;
const bitmaskOptimiser_1 = require("../optimizer/bitmaskOptimiser");
const optimize = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { truck, orders } = payload;
    // ❌ Invalid payload
    if (!truck || !orders || !Array.isArray(orders)) {
        throw new Error('Invalid payload');
    }
    // ✅ Step 6: Handle empty orders
    if (orders.length === 0) {
        return emptyResponse(truck);
    }
    // ✅ Step 7: Basic time validation
    const validOrders = orders.filter((o) => {
        return o.pickup_date <= o.delivery_date;
    });
    if (validOrders.length === 0) {
        return emptyResponse(truck);
    }
    // ✅ Step 5 (improved): Group by lane
    const laneMap = {};
    for (const order of validOrders) {
        const key = `${order.origin}__${order.destination}`;
        if (!laneMap[key])
            laneMap[key] = [];
        laneMap[key].push(order);
    }
    let bestResult = null;
    // 🚀 Run optimizer per lane
    for (const key in laneMap) {
        const result = (0, bitmaskOptimiser_1.runOptimizer)(truck, laneMap[key]);
        if (!bestResult ||
            result.total_payout_cents > bestResult.total_payout_cents) {
            bestResult = result;
        }
    }
    // ✅ Step 6: If nothing valid found
    if (!bestResult) {
        return emptyResponse(truck);
    }
    // ✅ Step 8: Round percentages
    return Object.assign(Object.assign({}, bestResult), { utilization_weight_percent: Number(bestResult.utilization_weight_percent.toFixed(2)), utilization_volume_percent: Number(bestResult.utilization_volume_percent.toFixed(2)) });
});
exports.optimize = optimize;
// 🔧 Helper for empty response
const emptyResponse = (truck) => ({
    truck_id: truck.id,
    selected_order_ids: [],
    total_payout_cents: 0,
    total_weight_lbs: 0,
    total_volume_cuft: 0,
    utilization_weight_percent: 0,
    utilization_volume_percent: 0
});
