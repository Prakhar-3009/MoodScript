import arcjet, { tokenBucket } from "@arcjet/next";

// Optional but good: check if the key exists
const arcjetKey = process.env.ARCJET_KEY;
if (!arcjetKey) {
  throw new Error("Missing ARCJET_KEY in environment variables.");
}

const aj = arcjet({
  key: arcjetKey,
  characteristics: ["userId"], // Track by Clerk userId
  rules: [
    tokenBucket({
      mode: "LIVE",
      refillRate: 10, // 10 tokens per interval
      interval: 3600, // per hour
      capacity: 10,   // max burst
    }),
  ],
});

export default aj;
