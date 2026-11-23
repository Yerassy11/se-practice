import type {
  AvailabilityReasonCode,
  ExplanationAdapter,
  ExplanationInput,
  ExplanationResult,
} from "./types";
import { parseTime } from "./lib/time";

export const DEFAULT_EXPLANATION_TIMEOUT_MS = 1200;

const REASON_CODES: readonly AvailabilityReasonCode[] = [
  "available",
  "invalid_time",
  "past_time",
  "too_long",
  "room_blocked",
  "overlap",
];

const FALLBACKS: Record<AvailabilityReasonCode, string> = {
  available: "The checker found no rule that prevents this request.",
  invalid_time: "The checker could not validate this time interval.",
  past_time: "The requested start is not after the current time.",
  too_long: "The request exceeds the maximum allowed length.",
  room_blocked: "The selected room is blocked.",
  overlap: "The requested interval overlaps the room schedule.",
};

export function fallbackExplanation(reasonCode: AvailabilityReasonCode): string {
  return FALLBACKS[reasonCode];
}

function isReasonCode(value: unknown): value is AvailabilityReasonCode {
  return typeof value === "string" && REASON_CODES.includes(value as AvailabilityReasonCode);
}

function normalizeInput(input: ExplanationInput): ExplanationInput | null {
  if (!input || typeof input !== "object") return null;
  if (typeof input.roomLabel !== "string" || typeof input.start !== "string" || typeof input.end !== "string") {
    return null;
  }
  if (typeof input.isAvailable !== "boolean" || !isReasonCode(input.reasonCode)) return null;

  const roomLabel = input.roomLabel.trim();
  const start = input.start;
  const end = input.end;
  const startMin = parseTime(start);
  const endMin = parseTime(end);

  if (
    roomLabel.length < 1 ||
    roomLabel.length > 60 ||
    !/^\d{2}:\d{2}$/.test(start) ||
    !/^\d{2}:\d{2}$/.test(end) ||
    !Number.isFinite(startMin) ||
    !Number.isFinite(endMin) ||
    startMin >= 1440 ||
    (input.reasonCode === "available") !== input.isAvailable
  ) {
    return null;
  }

  return { roomLabel, start, end, isAvailable: input.isAvailable, reasonCode: input.reasonCode };
}

function hasAtMostTwoSentences(explanation: string): boolean {
  const sentences = explanation.split(/[.!?]+/).map((sentence) => sentence.trim()).filter(Boolean);
  return sentences.length >= 1 && sentences.length <= 2;
}

function matchesResult(explanation: string, input: ExplanationInput): boolean {
  const withoutNegatedAvailable = explanation.replace(/\bnot\s+available\b/gi, "");
  const hasAvailable = /\bavailable\b/i.test(withoutNegatedAvailable);
  const hasUnavailable = /\bunavailable\b/i.test(explanation);
  const hasInvalid = /\binvalid\b/i.test(explanation);

  if (input.isAvailable) {
    if (!hasAvailable || hasUnavailable || hasInvalid || /\bnot\s+available\b/i.test(explanation)) return false;
  } else if (input.reasonCode === "invalid_time" || input.reasonCode === "past_time") {
    if (!hasInvalid || hasAvailable || hasUnavailable) return false;
  } else if ((!hasUnavailable && !/\bnot\s+available\b/i.test(explanation)) || hasAvailable || hasInvalid) {
    return false;
  }

  const exclusiveReasons: Partial<Record<AvailabilityReasonCode, RegExp>> = {
    past_time: /\bpast\b/i,
    too_long: /\btoo long\b|\bmaximum allowed length\b/i,
    room_blocked: /\bblocked\b/i,
    overlap: /\boverlaps?\b|\bconflict\b/i,
  };
  for (const [reason, marker] of Object.entries(exclusiveReasons)) {
    if (reason !== input.reasonCode && marker.test(explanation)) return false;
  }

  const reasonPattern: Record<AvailabilityReasonCode, RegExp> = {
    available: /\bavailable\b/i,
    invalid_time: /\b(time|interval|valid|validate)\b/i,
    past_time: /\b(start|current|past|after)\b/i,
    too_long: /\b(length|long|maximum|allowed)\b/i,
    room_blocked: /\b(room|blocked)\b/i,
    overlap: /\b(overlap|schedule|conflict|booking)\b/i,
  };

  return reasonPattern[input.reasonCode].test(explanation);
}

function isValidExplanation(value: unknown, input: ExplanationInput): value is string {
  if (typeof value !== "string") return false;
  const explanation = value.trim();
  if (
    explanation.length === 0 ||
    explanation.length > 280 ||
    /\b\d{1,2}:\d{2}\b/.test(explanation) ||
    /\d/.test(explanation) ||
    !hasAtMostTwoSentences(explanation) ||
    !matchesResult(explanation, input)
  ) {
    return false;
  }
  return true;
}

export async function explainAvailability(
  input: ExplanationInput,
  mockAdapter: ExplanationAdapter,
  timeoutMs = DEFAULT_EXPLANATION_TIMEOUT_MS,
): Promise<ExplanationResult> {
  const normalizedInput = normalizeInput(input);
  if (!normalizedInput) {
    return {
      status: "rejected",
      message: "The explanation request contains invalid room or time information.",
    };
  }

  try {
    const timeout = Number.isFinite(timeoutMs) ? Math.max(0, timeoutMs) : DEFAULT_EXPLANATION_TIMEOUT_MS;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let output: unknown;
    try {
      output = await Promise.race([
        Promise.resolve().then(() => mockAdapter(normalizedInput)),
        new Promise<never>((_, reject) => {
          timer = setTimeout(() => reject(new Error("Explanation timed out")), timeout);
        }),
      ]);
    } finally {
      if (timer) clearTimeout(timer);
    }

    if (!isValidExplanation(output, normalizedInput)) {
      throw new Error("Explanation output was invalid");
    }

    return { status: "success", explanation: output.trim() };
  } catch {
    return {
      status: "fallback",
      explanation: fallbackExplanation(normalizedInput.reasonCode),
    };
  }
}
