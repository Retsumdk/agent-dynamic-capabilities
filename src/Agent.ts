import { AgentInfo, Capability, NegotiationResult, DynamicTool } from "./types";
import { CapabilityRegistry } from "./CapabilityRegistry";
import { Negotiator } from "./Negotiator";
import { ToolLoader } from "./ToolLoader";

/**
 * Base Agent class that utilizes the dynamic capabilities framework.
 */
export class Agent {
  public info: AgentInfo;
  private registry: CapabilityRegistry;
  private negotiator: Negotiator;
  private toolLoader: ToolLoader;
  private acquiredTools: Map<string, DynamicTool> = new Map();

  constructor(
    name: string,
    id: string,
    reputation: number = 50,
    registry: CapabilityRegistry,
    negotiator: Negotiator,
    toolLoader: ToolLoader
  ) {
    this.info = {
      id,
      name,
      capabilities: [],
      reputation
    };
    this.registry = registry;
    this.negotiator = negotiator;
    this.toolLoader = toolLoader;
  }

  async acquireCapability(capabilityId: string): Promise<boolean> {
    console.log(`[Agent:${this.info.name}] Attempting to acquire: ${capabilityId}`);
    
    const capability = this.registry.get(capabilityId);
    if (!capability) {
      console.error(`[Agent:${this.info.name}] Capability ${capabilityId} not found in registry.`);
      return false;
    }

    const result = await this.negotiator.negotiate(this.info, capability);
    
    if (result.status === "accepted") {
      console.log(`[Agent:${this.info.name}] Negotiation successful! Agreed cost: ${result.agreedCost}`);
      
      const tool = await this.toolLoader.loadTool(capability);
      this.acquiredTools.set(capabilityId, tool);
      this.info.capabilities.push(capabilityId);
      
      console.log(`[Agent:${this.info.name}] Successfully acquired and loaded: ${capability.name}`);
      return true;
    }

    console.warn(`[Agent:${this.info.name}] Negotiation failed: ${result.reason}`);
    return false;
  }

  async useTool(capabilityId: string, args: any): Promise<any> {
    const tool = this.acquiredTools.get(capabilityId);
    if (!tool) {
      throw new Error(`Tool for ${capabilityId} not acquired or loaded.`);
    }

    return await tool.execute(args);
  }

  listAcquiredCapabilities(): string[] {
    return this.info.capabilities;
  }

  async releaseCapability(capabilityId: string): Promise<boolean> {
    if (this.acquiredTools.has(capabilityId)) {
      await this.toolLoader.unloadTool(capabilityId);
      this.acquiredTools.delete(capabilityId);
      this.info.capabilities = this.info.capabilities.filter(id => id !== capabilityId);
      console.log(`[Agent:${this.info.name}] Released capability: ${capabilityId}`);
      return true;
    }
    return false;
  }
}
