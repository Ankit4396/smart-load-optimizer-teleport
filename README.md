# SmartLoad Optimization API

A high-performance, stateless microservice that selects the optimal set of shipment orders for a truck, maximizing revenue while respecting operational constraints like capacity, hazmat compatibility, route, and time windows.



##  Problem Overview

Given:
- A truck with weight and volume limits
- A list of shipment orders

The system selects the **best combination of orders** such that:

 - Total payout is maximized  
 - Weight & volume limits are respected  
 - Orders are route-compatible (same origin → destination)  
 - Hazmat and non-hazmat loads are not mixed  
 - Time windows are compatible  



## ⚙️ Tech Stack

- **Node.js (TypeScript)**
- **Hapi.js**
- **Joi (validation)**
- **Swagger (API documentation)**

---

##  How to Run

### 1. Clone repository

```bash
git clone https://github.com/Ankit4396/smart-load-optimizer-teleport.git
cd smart-load-optimizer-teleport
````

### 2. Install dependencies

```bash
npm install
npm run build
```

### 3. Run service

```bash
npm start
```

Service will be available at:

```bash
http://localhost:8080
```

---

## 📘 API Documentation

Swagger UI available at:

```bash
http://localhost:8080/documentation
```

---

## 🔐 Authentication

All APIs require an API key:

```
x-api-key: <your-api-key>
```

Set in `.env`:

```env
API_KEY=supersecret123
```

---

## 📥 API Endpoint

### POST `/api/v1/load-optimizer/optimize`

#### Request

```json
{
  "truck": {
    "id": "truck-123",
    "max_weight_lbs": 44000,
    "max_volume_cuft": 3000
  },
  "orders": [
    {
      "id": "ord-001",
      "payout_cents": 250000,
      "weight_lbs": 18000,
      "volume_cuft": 1200,
      "origin": "Los Angeles, CA",
      "destination": "Dallas, TX",
      "pickup_date": "2025-12-05",
      "delivery_date": "2025-12-09",
      "is_hazmat": false
    }
  ]
}
```

---

#### Response

```json
{
  "truck_id": "truck-123",
  "selected_order_ids": ["ord-001"],
  "total_payout_cents": 250000,
  "total_weight_lbs": 18000,
  "total_volume_cuft": 1200,
  "utilization_weight_percent": 40.91,
  "utilization_volume_percent": 40.0
}
```

---

##  Core Approach

###  Dynamic Programming with Bitmasking

* Each subset of orders is represented using a bitmask
* Time complexity: **O(2^n)** (n ≤ 22)
* Efficient for problem constraints

---

##  Optimizations Applied

*  Early pruning (capacity, hazmat, time conflicts)
*  Precomputed timestamps (avoids repeated Date parsing)
*  Lane grouping (reduces search space)
*  Bitmask DP memoization

---

## 📏 Constraints Handled

| Constraint   | Handling                      |
| ------------ | ----------------------------- |
| Weight       | Hard limit                    |
| Volume       | Hard limit                    |
| Hazmat       | No mixing                     |
| Route        | Grouped by origin-destination |
| Time windows | Overlap validation            |

---

## ⏱️ Performance

* Handles up to **22 orders**
* Worst-case: ~4 million states
* Optimized execution: **< 800 ms**

---

##  Edge Cases Covered

* Empty orders
* No feasible combination
* Oversized orders
* Invalid time windows
* Mixed hazmat loads

---

## 💡 Design Decisions

* Stateless service (no DB)
* Money handled in **integer cents (no floating point errors)**
* Clean separation: Controller → Service → Optimizer
* Validation using Joi

---

##  Bonus Considerations

* Can be extended to return **Pareto-optimal solutions**
* Scoring function can be customized (e.g., revenue vs utilization)
* Caching/memoization can be added per lane

---

##  Docker 

```bash
docker compose up --build
```

---

## CURL
1.  For Load Optimizer (POST)
```bash
curl -X POST http://localhost:8080/api/v1/load-optimizer/optimize \
-H "Content-Type: application/json" \
-H "x-api-key: supersecret123" \
-d '{
  "truck": {
    "id": "truck-123",
    "max_weight_lbs": 44000,
    "max_volume_cuft": 3000
  },
  "orders": [
    {
      "id": "ord-001",
      "payout_cents": 250000,
      "weight_lbs": 10000,
      "volume_cuft": 1000,
      "origin": "LA",
      "destination": "Dallas",
      "pickup_date": "2025-12-05",
      "delivery_date": "2025-12-09",
      "is_hazmat": false
    }
  ]
}'
```

2. For Health Check 
```bash
curl http://localhost:8080/health
```



## 👨‍💻 Author

ANKIT JAISWAL

---



