import ROModules from "./ROmodules";

export default function ROModulesContainer() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <ROModules key={i} count={i + 1} />
      ))}
    </div>
  );
}