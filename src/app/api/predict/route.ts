import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Strict Server-Side Validation
    const errors: string[] = [];
    
    // Type checking & presence
    const requiredFields = [
      "age_years", "gender", "height", "weight", 
      "ap_hi", "ap_lo", "cholesterol", "gluc", 
      "smoke", "alco", "active"
    ];
    
    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null) {
        errors.push(`Missing required field: ${field}`);
      }
    }

    if (errors.length > 0) {
      return NextResponse.json({ error: "Validation Failed", details: errors }, { status: 400 });
    }

    // Range checks based on clinical boundaries (matching our Python schema)
    if (typeof body.age_years !== "number" || body.age_years < 1 || body.age_years > 100) {
      errors.push("age_years must be a number between 1 and 100.");
    }
    if (body.gender !== 1 && body.gender !== 2) {
      errors.push("gender must be 1 (Female) or 2 (Male).");
    }
    if (typeof body.height !== "number" || body.height < 130 || body.height > 220) {
      errors.push("height must be a number between 130 and 220.");
    }
    if (typeof body.weight !== "number" || body.weight < 40 || body.weight > 200) {
      errors.push("weight must be a number between 40 and 200.");
    }
    if (typeof body.ap_hi !== "number" || body.ap_hi < 60 || body.ap_hi > 250) {
      errors.push("ap_hi must be a number between 60 and 250.");
    }
    if (typeof body.ap_lo !== "number" || body.ap_lo < 40 || body.ap_lo > 200) {
      errors.push("ap_lo must be a number between 40 and 200.");
    }
    if (body.ap_hi <= body.ap_lo) {
      errors.push("ap_hi (Systolic BP) must be strictly greater than ap_lo (Diastolic BP).");
    }
    if (![1, 2, 3].includes(body.cholesterol)) {
      errors.push("cholesterol must be 1, 2, or 3.");
    }
    if (![1, 2, 3].includes(body.gluc)) {
      errors.push("gluc must be 1, 2, or 3.");
    }
    if (![0, 1].includes(body.smoke)) {
      errors.push("smoke must be 0 or 1.");
    }
    if (![0, 1].includes(body.alco)) {
      errors.push("alco must be 0 or 1.");
    }
    if (![0, 1].includes(body.active)) {
      errors.push("active must be 0 or 1.");
    }

    // 2. Return 400 if any validation fails
    if (errors.length > 0) {
      return NextResponse.json({ error: "Validation Failed", details: errors }, { status: 400 });
    }

    // 3. Proxy to the FastAPI Backend
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    
    // Pass along Authorization header if present
    const authHeader = req.headers.get("Authorization");
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    try {
      const response = await fetch(`${backendUrl}/api/v1/predict`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        // Forward the error from the backend
        const errorData = await response.json().catch(() => ({}));
        return NextResponse.json(
          { error: "Backend Prediction Failed", details: errorData },
          { status: response.status }
        );
      }

      const data = await response.json();
      
      // 4. Return the prediction response to the client
      return NextResponse.json(data, { status: 200 });

    } catch (networkError) {
      console.error("Fetch to Python backend failed:", networkError);
      return NextResponse.json(
        { error: "Service Unavailable. Python backend is unreachable." },
        { status: 503 }
      );
    }

  } catch (err: any) {
    return NextResponse.json({ error: "Invalid JSON body", details: err.message }, { status: 400 });
  }
}
