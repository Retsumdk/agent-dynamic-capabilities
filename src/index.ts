#!/usr/bin/env bun
/**
 * Agent Dynamic Capabilities - Main Entry Point
 * Built by Retsumdk
 */

import { CapabilityRegistry } from "./CapabilityRegistry";
import { Negotiator } from "./Negotiator";
import { ToolLoader } from "./ToolLoader";
import { Agent } from "./Agent";
import { Command } from "commander";

async function runSimulation() {
  console.log("=== Agent Dynamic Capabilities Simulation ===\n");

  const registry = new CapabilityRegistry();
  const negotiator = new Negotiator();
  const toolLoader = new ToolLoader();

  // Register some premium capabilities
  registry.register({
    id: "gpt-4-executor",
    name: "GPT-4 Code Execution",
    type: "calculation",
    description: "Advanced code execution using GPT-4",
    version: "2.1.0",
    provider: "premium-tools",
    cost: 50
  });

  registry.register({
    id: "secure-vault",
    name: "Secure Data Vault",
    type: "storage",
    description: "Encrypted storage for sensitive agent data",
    version: "1.2.0",
    provider: "system",
    cost: 20
  });

  // Create agents
  const agentAlpha = new Agent("AlphaBot", "agt-001", 90, registry, negotiator, toolLoader);
  const agentBeta = new Agent("BetaBot", "agt-002", 30, registry, negotiator, toolLoader);

  console.log("\n--- Simulation Step 1: AlphaBot (High Reputation) ---");
  await agentAlpha.acquireCapability("gpt-4-executor");
  await agentAlpha.useTool("gpt-4-executor", { code: "console.log('Hello World')" });

  console.log("\n--- Simulation Step 2: BetaBot (Low Reputation) ---");
  await agentBeta.acquireCapability("gpt-4-executor"); // Should fail due to reputation

  console.log("\n--- Simulation Step 3: BetaBot acquiring standard tool ---");
  await agentBeta.acquireCapability("secure-vault"); // Should succeed

  console.log("\n--- Simulation Summary ---");
  console.log(`AlphaBot Capabilities: ${agentAlpha.listAcquiredCapabilities().join(", ")}`);
  console.log(`BetaBot Capabilities: ${agentBeta.listAcquiredCapabilities().join(", ")}`);
  
  console.log("\n=== Simulation Complete ===");
}

const program = new Command();
program
  .name("agent-dynamic-capabilities")
  .description("Framework for agents to negotiate and acquire new tool capabilities at runtime")
  .version("1.0.0");

program
  .command("simulate")
  .description("Run a simulation of agent capability negotiation")
  .action(async () => {
    try {
      await runSimulation();
    } catch (error) {
      console.error("Simulation failed:", error);
    }
  });

program
  .command("list")
  .description("List available capabilities in the registry")
  .action(() => {
    const registry = new CapabilityRegistry();
    console.log("Available Capabilities:");
    registry.list().forEach(c => {
      console.log(`- ${c.name} (${c.id}) | Provider: ${c.provider} | Cost: ${c.cost}`);
    });
  });

program.parse(process.argv);

if (process.argv.length === 2) {
  runSimulation();
}
