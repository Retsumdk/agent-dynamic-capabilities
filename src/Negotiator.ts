import { AgentInfo, Capability, NegotiationResult } from "./types";

/**
 * Negotiator handles the logic for agents to acquire capabilities from providers.
 */
export class Negotiator {
  private static readonly MAX_REPUTATION = 100;
  private static readonly MIN_REPUTATION_FOR_DISCOUNT = 80;

  async negotiate(
    requester: AgentInfo,
    capability: Capability
  ): Promise<NegotiationResult> {
    console.log(`[Negotiator] Agent ${requester.name} is negotiating for ${capability.name}`);

    const baseCost = capability.cost || 0;
    
    // Simple negotiation logic based on reputation
    if (requester.reputation < 20) {
      return {
        status: "rejected",
        capabilityId: capability.id,
        reason: "Reputation too low for this capability."
      };
    }

    let agreedCost = baseCost;

    if (requester.reputation >= Negotiator.MIN_REPUTATION_FOR_DISCOUNT) {
      agreedCost = baseCost * 0.9; // 10% discount for high reputation
      console.log(`[Negotiator] High reputation discount applied: ${agreedCost}`);
    }

    // Simulate some logic where certain providers reject certain agents
    if (capability.provider === "premium-tools" && requester.reputation < 50) {
      return {
        status: "rejected",
        capabilityId: capability.id,
        reason: "Premium provider requires higher reputation."
      };
    }

    return {
      status: "accepted",
      capabilityId: capability.id,
      agreedCost: agreedCost,
      terms: "Standard usage license applies."
    };
  }

  async counterOffer(
    currentResult: NegotiationResult,
    targetCost: number
  ): Promise<NegotiationResult> {
    if (currentResult.status !== "accepted") {
      return currentResult;
    }

    const currentCost = currentResult.agreedCost || 0;
    
    // Accept counter-offer if it's within 15% of current cost
    if (targetCost >= currentCost * 0.85) {
      return {
        ...currentResult,
        status: "accepted",
        agreedCost: targetCost,
        reason: "Counter-offer accepted."
      };
    }

    return {
      ...currentResult,
      status: "countered",
      agreedCost: currentCost * 0.95,
      reason: "Proposed cost too low. Best offer provided."
    };
  }
}
