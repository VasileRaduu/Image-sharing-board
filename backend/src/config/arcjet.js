import arcjet, { tokenBucket, shield, detectBot } from "@arcjet/node";
import { ENV } from "./env.js";

//Initialize Arcjet with security rules
export const aj = arcjet({
	key: ENV.ARCJET_KEY,
	characteristics: ["ip.src"],
	rules: [
		shield({ mode: "LIVE" }),
		detectBot({
			mode: "LIVE",
			allow: [
				"CATEGORY:SEARCH_ENGINE",
			],
		}),

		tokenBucket({
			mode: "LIVE",
			refillRate: 20,
			interval: 10,
			capacity: 30,
		}),
	],
});