import { setDataInRedis } from "../../functions/utility/redis/set-data-in-redis.mjs";
import { defaultColors } from "../../functions/colors/default-colors.mjs";
import { dataKeys } from "../../functions/utility/redis/data-keys.mjs";

export const config = {
  runtime: "edge",
  regions: ["fra1"],
};

export default async function handler(request) {
  try {
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await request.json().catch(() => null);

    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body) ||
      Object.keys(body).length === 0
    ) {
      return new Response(
        JSON.stringify({
          error: "Invalid Colorsbody: must be a non-empty object",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await setDataInRedis(dataKeys.colors, defaultColors);

    return new Response(JSON.stringify({ defaultColors }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Server error", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
