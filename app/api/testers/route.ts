import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/store";

export async function GET() {
  try {
    const testers = await db.getTesters();
    return NextResponse.json({ testers });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.passcode) {
      return NextResponse.json({ error: "Name and passcode are required." }, { status: 400 });
    }

    const created = await db.addTester({
      name: body.name.trim(),
      passcode: body.passcode.trim(),
      role: "tester",
      active: true,
      notes: body.notes || "",
    });

    return NextResponse.json({ success: true, tester: created });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, updates } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Tester ID is required." }, { status: 400 });
    }

    const updated = await db.updateTester(id, updates);
    return NextResponse.json({ success: true, tester: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Tester ID is required." }, { status: 400 });
    }

    await db.deleteTester(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
