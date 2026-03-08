"use client"
import Tickets from '@/app/data/tickets.json';
import TicketType from "./types/tickets";
import Ticket from "./components/Ticket";
import Agents from './data/agents.json';
import Agent, { AgentProps } from './components/Agent';
import React from "react";

type Filters = {
  status: string;
  customerTier: string;
  issueType: string;
  agentName: string;
};

// Maps a team name to the issueType value used in tickets
const teamToIssueType: Record<string, string> = {
  "Core Support":           "general",
  "Integrations":           "integration",
  "Billing Ops":            "billing",
  "General Support":        "general",
  "Technical Escalations":  "technical",
  "Customer Success":       "onboarding",
};

export default function Home() {
  const [filters, setFilters] = React.useState<Filters>({
    status: "",
    customerTier: "",
    issueType: "",
    agentName: "",
  });

  const handleFilter = (key: keyof Filters) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleAgentClick = (agent: AgentProps) => {
    setFilters((prev) => ({
      ...prev,
      agentName: prev.agentName === agent.name ? "" : agent.name,
    }));
  };

  // Resolve the issueType implied by the selected agent's team
  const selectedAgent = (Agents as AgentProps[]).find((a) => a.name === filters.agentName);
  const agentIssueType = selectedAgent ? teamToIssueType[selectedAgent.team] ?? "" : "";

  const filteredTickets = (Tickets as TicketType[]).filter((ticket) => {
    const issueTypeFilter = filters.agentName
      ? agentIssueType
      : filters.issueType;

    return (
      (!filters.status || ticket.status === filters.status) &&
      (!filters.customerTier || ticket.customerTier.toLowerCase().trim() === filters.customerTier) &&
      (!issueTypeFilter || ticket.issueType.toLowerCase().trim() === issueTypeFilter)
    );
  });

  const hasActiveFilter = filters.status || filters.customerTier || filters.issueType || filters.agentName;

  const selectClass =
    "border border-gray-200 rounded-md px-3 py-1.5 text-sm bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 cursor-pointer";

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Command Center</h1>
          <p className="text-xs text-gray-400 mt-0.5">Support Operations Dashboard</p>
        </div>
        <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
          {filteredTickets.length} ticket{filteredTickets.length !== 1 ? "s" : ""}
        </span>
      </header>

      <div className="flex h-[calc(100vh-73px)]">

        {/* Left sidebar — Agents */}
        <aside className="w-64 shrink-0 bg-white border-r border-gray-200 flex flex-col">
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Agents (Click name to filter)</p>
          </div>
          <div className="flex flex-col gap-1 p-3 overflow-y-auto">
            {(Agents as AgentProps[]).map((agent) => (
              <div
                key={agent.name}
                onClick={() => handleAgentClick(agent)}
                className={`cursor-pointer rounded-lg transition-colors ${
                  filters.agentName === agent.name
                    ? "bg-gray-900"
                    : "hover:bg-gray-50"
                }`}
              >
                <Agent
                  name={agent.name}
                  team={agent.team}
                  activeTickets={agent.activeTickets}
                  selected={filters.agentName === agent.name}
                />
              </div>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 flex flex-col overflow-hidden">

          {/* Filter bar */}
          <div className="bg-white border-b border-gray-200 px-6 py-3 flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 mr-1">Filters</span>

            <select className={selectClass} value={filters.status} onChange={handleFilter("status")}>
              <option value="">All Statuses</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
            </select>

            <select className={selectClass} value={filters.customerTier} onChange={handleFilter("customerTier")}>
              <option value="">All Tiers</option>
              <option value="basic">Basic</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </select>

            <select
              className={selectClass}
              value={filters.issueType}
              onChange={handleFilter("issueType")}
              disabled={!!filters.agentName}
              title={filters.agentName ? "Issue type is set by the selected agent" : ""}
            >
              <option value="">All Issue Types</option>
              <option value="technical">Technical</option>
              <option value="billing">Billing</option>
              <option value="onboarding">Onboarding</option>
              <option value="integration">Integration</option>
              <option value="general">General</option>
            </select>

            {filters.agentName && (
              <span className="text-xs bg-gray-900 text-white px-2.5 py-1 rounded-full flex items-center gap-1.5">
                {filters.agentName}
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, agentName: "" }))}
                  className="opacity-60 hover:opacity-100 leading-none"
                >
                  ✕
                </button>
              </span>
            )}

            {hasActiveFilter && (
              <button
                className="text-xs text-gray-400 hover:text-gray-700 underline ml-auto"
                onClick={() => setFilters({ status: "", customerTier: "", issueType: "", agentName: "" })}
              >
                Clear all
              </button>
            )}
          </div>

          {/* Tickets list */}
          <div className="flex-1 overflow-y-auto p-6">
            {filteredTickets.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <p className="text-sm">No tickets match the current filters.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {filteredTickets.map((ticket: TicketType) => (
                  <Ticket
                    key={ticket.id}
                    id={ticket.id}
                    title={ticket.title}
                    customerName={ticket.customerName}
                    customerTier={ticket.customerTier}
                    status={ticket.status}
                    priority={ticket.priority}
                    createdAt={ticket.createdAt}
                    lastUpdatedAt={ticket.lastUpdatedAt}
                    assignedTo={ticket.assignedTo as string}
                    channel={ticket.channel}
                    issueType={ticket.issueType}
                    description={ticket.description}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}