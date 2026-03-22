export default function Filter({ setFilter }) {
  return (
    <div>
      <button onClick={() => setFilter("active")}>Active</button>
      <button onClick={() => setFilter("expired")}>Expired</button>
      <button onClick={() => setFilter("")}>All</button>
    </div>
  );
}