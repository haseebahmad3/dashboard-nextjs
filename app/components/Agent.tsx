export type AgentProps = {
  name: string;
  team: string;
  activeTickets: number;
  selected?: boolean;
};

export default function Agent({ name, team, activeTickets, selected = false }: AgentProps) {
  const overThreshold = activeTickets > 3;

  return (
    <div className="flex items-center justify-between px-3 py-2.5">
      <div>
        <p className={`text-sm font-medium ${selected ? "text-white" : "text-gray-900"}`}>
          {name}
        </p>
        <p className={`text-xs ${selected ? "text-gray-400" : "text-gray-400"}`}>{team}</p>
      </div>

      <div className="flex items-center gap-2">
        <span className={`text-sm font-semibold tabular-nums ${
          selected ? "text-white" : overThreshold ? "text-red-500" : "text-gray-600"
        }`}>
          {activeTickets}
        </span>
        <span className={`w-2 h-2 rounded-full ${overThreshold ? "bg-red-400" : "bg-emerald-400"}`} />
      </div>
    </div>
  );
}