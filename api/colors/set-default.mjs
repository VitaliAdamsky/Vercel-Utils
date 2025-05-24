import { defaultColors } from "../../functions/colors/default-colors.mjs";
import { dataKeys } from "../../functions/utility/redis/data-keys.mjs";

export const config = {
  runtime: "edge",
  regions: ["fra1"],
};

export default async function handler(request) {
  try {
    await setDataInRedis(dataKeys.colors, defaultColors);

    return new Response(JSON.stringify({ colors }), {
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
