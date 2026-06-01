import { DynamicTool, Capability } from "./types";

/**
 * ToolLoader simulates the dynamic loading of tools associated with capabilities.
 */
export class ToolLoader {
  private loadedTools: Map<string, DynamicTool> = new Map();

  async loadTool(capability: Capability): Promise<DynamicTool> {
    console.log(`[ToolLoader] Loading tool for ${capability.id}...`);

    // In a real system, this might fetch a WASM module or a JS script.
    // For this simulation, we'll create a mock tool.
    const tool: DynamicTool = {
      id: capability.id,
      name: capability.name,
      execute: async (args: any) => {
        console.log(`[Tool:${capability.id}] Executing with:`, args);
        return {
          success: true,
          data: `Result from ${capability.name}`,
          timestamp: new Date().toISOString()
        };
      }
    };

    this.loadedTools.set(capability.id, tool);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading delay
    
    console.log(`[ToolLoader] Tool ${capability.id} loaded successfully.`);
    return tool;
  }

  getTool(id: string): DynamicTool | undefined {
    return this.loadedTools.get(id);
  }

  isLoaded(id: string): boolean {
    return this.loadedTools.has(id);
  }

  async unloadTool(id: string): Promise<boolean> {
    console.log(`[ToolLoader] Unloading tool ${id}...`);
    return this.loadedTools.delete(id);
  }

  listLoaded(): string[] {
    return Array.from(this.loadedTools.keys());
  }
}
