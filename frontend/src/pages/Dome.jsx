import DomeCalculator from "../components/dome/DomeCalculator";

export default function Dome() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "calc(100vh - 64px)" }}>
      {/* Page container */}
      <div style={{ flex: 1, maxWidth: 1280, margin: "0 auto", width: "100%", padding: "1.5rem 2rem" }}>
        <DomeCalculator />
      </div>
    </div>
  );
}
