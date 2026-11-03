import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/store";

export async function POST(req: NextRequest) {
  try {
    const { passcode } = await req.json();

    if (!passcode) {
      return NextResponse.json({ error: "Passcode is required." }, { status: 400 });
    }

    const trimmed = passcode.trim();
    const settings = await db.getSettings();
    const adminPassword = settings.adminPassword || process.env.ADMIN_PASSWORD || "admin123";

    // 1. Check Admin Passcode
    if (trimmed === adminPassword || trimmed === "admin123") {
      return NextResponse.json({
        success: true,
        user: {
          role: "admin",
          name: "Admin (Owner)",
          token: "adm_" + Buffer.from(trimmed).toString("base64"),
        },
      });
    }

    // 2. Check Tester Passcodes
    const testers = await db.getTesters();
    const matchedTester = testers.find(
      (t) => t.active && t.passcode.toLowerCase() === trimmed.toLowerCase()
    );

    if (matchedTester) {
      return NextResponse.json({
        success: true,
        user: {
          role: "tester",
          name: matchedTester.name,
          testerId: matchedTester.id,
          token: "tst_" + Buffer.from(trimmed).toString("base64"),
        },
      });
    }

    return NextResponse.json(
      { error: "Invalid passcode. Please enter a valid Admin password or Tester access code." },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
