import { NextResponse } from "next/server";
import { db } from "@/lib/store";

export async function GET() {
  const dmLogs = db.getDmLogs();
  const publishJobs = db.getPublishJobs();
  return NextResponse.json({ dmLogs, publishJobs });
}
