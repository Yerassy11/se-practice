import type { ExplanationAdapter, ExplanationInput } from "./types";

const MOCK_EXPLANATIONS: Record<ExplanationInput["reasonCode"], string> = {
  available: "The checker found no rule that prevents this request. The confirmed result is Available.",
  invalid_time: "The checker could not validate this time interval. The confirmed decision remains invalid.",
  past_time: "The requested start is not after the current time. The confirmed decision remains invalid.",
  too_long: "The request exceeds the maximum allowed length. The confirmed result is Unavailable.",
  room_blocked: "The selected room is blocked. The confirmed result is Unavailable.",
  overlap: "The requested interval overlaps the room schedule. The confirmed result is Unavailable.",
};

export function createMockExplanationAdapter(shouldFail = false): ExplanationAdapter {
  return async (input) => {
    if (shouldFail) throw new Error("Simulated explanation failure");
    return MOCK_EXPLANATIONS[input.reasonCode];
  };
}
