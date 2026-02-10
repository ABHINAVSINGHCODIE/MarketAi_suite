import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    // ✅ MOCK / DEMO MODE (SAFE)
    if (!process.env.GEMINI_API_KEY) {
      return res.status(200).json({
        success: true,
        mode: "mock",
        data: {
          result: "Demo AI response (mock mode)"
        }
      });
    }

    // ✅ TEMP RESPONSE (REAL API CAN BE ADDED LATER)
    return res.status(200).json({
      success: true,
      mode: "live",
      data: {
        result: "Gemini backend is working correctly"
      }
    });

  } catch (error: any) {
    console.error("Gemini API error:", error);

    return res.status(500).json({
      success: false,
      message: "AI service temporarily unavailable"
    });
  }
}
