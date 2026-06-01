import { Capability, CapabilityType } from "./types";

/**
 * CapabilityRegistry handles the storage and discovery of agent capabilities.
 */
export class CapabilityRegistry {
  private capabilities: Map<string, Capability> = new Map();

  constructor() {
    this.initializeDefaultCapabilities();
  }

  private initializeDefaultCapabilities() {
    this.register({
      id: "base-search",
      name: "Basic Search",
      type: "search",
      description: "Allows basic web searching",
      version: "1.0.0",
      provider: "system",
      cost: 0
    });
  }

  register(capability: Capability): void {
    if (this.capabilities.has(capability.id)) {
      throw new Error(`Capability with id ${capability.id} is already registered.`);
    }
    this.capabilities.set(capability.id, capability);
    console.log(`[Registry] Registered capability: ${capability.name} (${capability.id})`);
  }

  unregister(id: string): boolean {
    return this.capabilities.delete(id);
  }

  get(id: string): Capability | undefined {
    return this.capabilities.get(id);
  }

  list(type?: CapabilityType): Capability[] {
    const list = Array.from(this.capabilities.values());
    return type ? list.filter(c => c.type === type) : list;
  }

  search(query: string): Capability[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.capabilities.values()).filter(c => 
      c.name.toLowerCase().includes(lowerQuery) || 
      c.description.toLowerCase().includes(lowerQuery)
    );
  }

  clear(): void {
    this.capabilities.clear();
  }
}
