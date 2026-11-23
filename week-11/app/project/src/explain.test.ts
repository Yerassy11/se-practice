import { expect, test } from "vitest";
import { explainAvailability } from "./explain";
import { createMockExplanationAdapter } from "./mockExplanationAdapter";
import type { ExplanationInput } from "./types";

const base: ExplanationInput = {
  roomLabel: "Study room",
  start: "10:00",
  end: "11:00",
  isAvailable: true,
  reasonCode: "available",
};
const mock = createMockExplanationAdapter();

test("E1 F2: available request gets a matching generated explanation", async () => {
  const result = await explainAvailability(base, mock);
  expect(result.status).toBe("success");
  expect(result.explanation).toContain("Available");
});

test("E2 F2: overlap gets an unavailable explanation", async () => {
  const result = await explainAvailability({ ...base, isAvailable: false, reasonCode: "overlap" }, mock);
  expect(result.status).toBe("success");
  expect(result.explanation).toContain("Unavailable");
});

test("E3 F2: blocked room gets an unavailable explanation", async () => {
  const result = await explainAvailability({ ...base, isAvailable: false, reasonCode: "room_blocked" }, mock);
  expect(result.status).toBe("success");
  expect(result.explanation).toContain("blocked");
});

test("E4 F3: malformed time is rejected before the adapter", async () => {
  let called = false;
  const result = await explainAvailability({ ...base, start: "bad" }, () => { called = true; return "Available."; });
  expect(result.status).toBe("rejected");
  expect(called).toBe(false);
});

test("E5 F2: past time gets an invalid explanation", async () => {
  const result = await explainAvailability({ ...base, isAvailable: false, reasonCode: "past_time" }, mock);
  expect(result.status).toBe("success");
  expect(result.explanation).toContain("invalid");
});

test("E6 F3: blank room is rejected", async () => {
  const result = await explainAvailability({ ...base, roomLabel: "  " }, mock);
  expect(result.status).toBe("rejected");
});

test("E7 F3: long room label is rejected", async () => {
  const result = await explainAvailability({ ...base, roomLabel: "x".repeat(61) }, mock);
  expect(result.status).toBe("rejected");
});

test("E8 F4: an adapter that never answers times out into fallback", async () => {
  const result = await explainAvailability(base, () => new Promise(() => {}), 10);
  expect(result.status).toBe("fallback");
  expect(result.explanation).toContain("checker");
});

test("E9 F4: a throwing adapter returns fallback", async () => {
  const result = await explainAvailability(base, createMockExplanationAdapter(true));
  expect(result.status).toBe("fallback");
});

test("F2: a contradictory explanation is rejected", async () => {
  const input: ExplanationInput = { ...base, isAvailable: false, reasonCode: "overlap" };
  const result = await explainAvailability(input, () => "The room is Unavailable due to overlap. It is Available.");
  expect(result.status).toBe("fallback");
});
