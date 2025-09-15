import { useEffect, useState } from "react";
import api from "../services/api";
import MetricCard from "./components/Metrics";
import SalesChart from "./components/SalesChart";

function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const tenantId = localStorage.getItem("tenantId");

  useEffect(() => {
    api.get(`/api/metrics/${tenantId}`).then((res) => setMetrics(res.data));
  }, [tenantId]);

  if (!metrics) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Tenant Dashboard</h1>
      <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
        <MetricCard title="Total Products" value={metrics.totalProducts} />
        <MetricCard title="Total Orders" value={metrics.totalOrders} />
        <MetricCard title="Revenue (30d)" value={`$${metrics.revenue}`} />
      </div>

      <SalesChart data={metrics.salesLast30Days} />

      <h2>Top 5 Customers</h2>
      <ol>
        {metrics.topCustomers.map((c) => (
          <li key={c.id}>
            {c.email} — ${c.totalSpent}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default Dashboard;
