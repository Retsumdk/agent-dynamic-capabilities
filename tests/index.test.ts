import { describe, test, expect, beforeEach } from "bun:test";
import { CapabilityRegistry } from "../src/CapabilityRegistry";
import { Negotiator } from "../src/Negotiator";
import { ToolLoader } from "../src/ToolLoader";
import { Agent } from "../src/Agent";

describe("Agent Dynamic Capabilities Framework", () => {
  let registry: CapabilityRegistry;
  let negotiator: Negotiator;
  let toolLoader: ToolLoader;

  beforeEach(() => {
    registry = new CapabilityRegistry();
    negotiator = new Negotiator();
    toolLoader = new ToolLoader();
  });

  test("CapabilityRegistry should register and list capabilities", () => {
    registry.register({
      id: "test-tool",
      name: "Test Tool",
      type: "calculation",
      description: "A test tool",
      version: "1.0.0",
      provider: "test",
      cost: 10
    });

    const list = registry.list();
    expect(list.some(c => c.id === "test-tool")).toBe(true);
    expect(registry.get("test-tool")).toBeDefined();
  });

  test("Negotiator should respect reputation requirements", async () => {
    const highRepAgent = { id: "a1", name: "HighRep", capabilities: [], reputation: 90 };
    const lowRepAgent = { id: "a2", name: "LowRep", capabilities: [], reputation: 10 };
    
    const cap = { id: "p1", name: "Premium", type: "custom" as any, description: "P", version: "1", provider: "premium-tools", cost: 100 };

    const resultHigh = await negotiator.negotiate(highRepAgent, cap);
    expect(resultHigh.status).toBe("accepted");
    expect(resultHigh.agreedCost).toBe(90); // 10% discount

    const resultLow = await negotiator.negotiate(lowRepAgent, cap);
    expect(resultLow.status).toBe("rejected");
  });

  test("Agent should acquire and use tools", async () => {
    const agent = new Agent("TestAgent", "agt-test", 100, registry, negotiator, toolLoader);
    
    registry.register({
      id: "calc-tool",
      name: "Calculator",
      type: "calculation",
      description: "Math tool",
      version: "1.0.0",
      provider: "system",
      cost: 5
    });

    const success = await agent.acquireCapability("calc-tool");
    expect(success).toBe(true);
    expect(agent.listAcquiredCapabilities()).toContain("calc-tool");

    const result = await agent.useTool("calc-tool", { x: 1, y: 2 });
    expect(result.success).toBe(true);
    expect(result.data).toBe("Result from Calculator");
  });

  test("Agent should release capabilities", async () => {
    const agent = new Agent("TestAgent", "agt-test", 100, registry, negotiator, toolLoader);
    registry.register({ id: "t1", name: "T1", type: "custom" as any, description: "D", version: "1", provider: "P", cost: 0 });
    
    await agent.acquireCapability("t1");
    expect(agent.listAcquiredCapabilities()).toContain("t1");
    
    await agent.releaseCapability("t1");
    expect(agent.listAcquiredCapabilities()).not.toContain("t1");
    expect(toolLoader.isLoaded("t1")).toBe(false);
  });
});
