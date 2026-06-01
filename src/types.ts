/**
 * Agent Dynamic Capabilities - Type Definitions
 * Built by Retsumdk
 */

export type CapabilityType = "search" | "calculation" | "storage" | "communication" | "custom";

export interface Capability {
  id: string;
  name: string;
  type: CapabilityType;
  description: string;
  version: string;
  provider: string;
  schema?: Record<string, any>;
  cost?: number;
}

export interface NegotiationResult {
  status: "accepted" | "rejected" | "countered";
  capabilityId: string;
  agreedCost?: number;
  reason?: string;
  terms?: string;
}

export interface AgentInfo {
  id: string;
  name: string;
  capabilities: string[];
  reputation: number;
}

export interface DynamicTool {
  id: string;
  name: string;
  execute: (args: any) => Promise<any>;
}
