function MetricCard({ title, value }) {
  return (
    <div style={{ border: "1px solid #ccc", padding: 20, borderRadius: 8, flex: 1 }}>
      <h3>{title}</h3>
      <p style={{ fontSize: 24, fontWeight: "bold" }}>{value}</p>
    </div>
  );
}

export default MetricCard;
