import { prisma } from "./db";

const BUREAUS = [
  ["reportExperian",   "Experian"],
  ["reportTransUnion", "TransUnion"],
  ["reportEquifax",    "Equifax"],
];

function pad(label, value, width = 28) {
  const v = value == null ? "" : String(value);
  return `${(label + ":").padEnd(width, " ")} ${v}`;
}

function divider(label) {
  return `\n${"=".repeat(72)}\n${label}\n${"=".repeat(72)}`;
}

function maskSsn4(s) {
  if (!s) return "";
  const last4 = String(s).replace(/\D/g, "").slice(-4);
  return last4 ? `XXX-XX-${last4}` : "";
}

function fmtMoney(cents) {
  if (cents == null) return "";
  return `$${(cents / 100).toFixed(2)}`;
}

/**
 * Build a debt-reporting handoff text for a ServiceRequest of type
 * DEBT_CREDIT_REPORTING. The output is a structured, human-readable
 * text export intended to be fed into the user's licensed Metro 2
 * conversion service or hand-keyed into each bureau's furnisher portal.
 * This is NOT a Metro 2 compliant binary file.
 */
export function buildDebtHandoff(sr, user) {
  const reporter = {
    name: process.env.REPORTER_NAME || "K-lawus",
    subscriberCode: process.env.REPORTER_SUBSCRIBER_CODE || "(미설정)",
    programId: process.env.REPORTER_PROGRAM_ID || "(미설정)",
    phone: process.env.REPORTER_PHONE || "(미설정)",
    address: process.env.REPORTER_ADDRESS || "(미설정)",
  };

  const selectedBureaus = BUREAUS
    .filter(([key]) => sr[key])
    .map(([, label]) => label);

  const lines = [];
  lines.push("# K-lawus · 채권 보고 핸드오프 EXPORT (draft)");
  lines.push("# This text is a structured handoff document.");
  lines.push("# It is NOT a Metro 2 compliant binary file. Pass the");
  lines.push("# fields below to your licensed Metro 2 conversion service");
  lines.push("# or use them when filling each bureau furnisher form.");
  lines.push("");
  lines.push(pad("Request ID", sr.id));
  lines.push(pad("Generated At", new Date().toISOString()));
  lines.push(pad("Requested By", user ? `${user.name} <${user.email}>` : "(unknown)"));
  lines.push(pad("Request Created", new Date(sr.requestedAt).toISOString()));

  lines.push(divider("REPORTER (Data Furnisher)"));
  lines.push(pad("Reporter Name", reporter.name));
  lines.push(pad("Subscriber Code", reporter.subscriberCode));
  lines.push(pad("Program Identifier", reporter.programId));
  lines.push(pad("Reporter Phone", reporter.phone));
  lines.push(pad("Reporter Address", reporter.address));

  lines.push(divider("CREDITOR (Debt Holder)"));
  lines.push(pad("Creditor Name", sr.creditorName || "(미입력)"));

  lines.push(divider("CONSUMER (Debtor)"));
  lines.push(pad("Consumer Name", sr.subjectName));
  lines.push(pad("Phone", sr.subjectPhone));
  lines.push(pad("Email", sr.subjectEmail));
  lines.push(pad("Address", sr.subjectAddress));
  lines.push(pad("Date of Birth", sr.subjectDob));
  lines.push(pad("SSN (last 4)", maskSsn4(sr.subjectSsn4)));

  lines.push(divider("DEBT / ACCOUNT"));
  lines.push(pad("Debt Amount", fmtMoney(sr.debtAmountCents)));
  lines.push(pad("Delinquent Since", sr.debtSince));
  lines.push(pad("Account Status", "DELINQUENT (suggested) — review before submit"));
  lines.push(pad("Account Type", "COLLECTION ACCOUNT (suggested) — review before submit"));

  lines.push(divider("BUREAU DISTRIBUTION"));
  if (selectedBureaus.length === 0) {
    lines.push("(no bureau selected — set in admin form before submitting)");
  } else {
    for (const b of selectedBureaus) lines.push(pad("Target Bureau", b));
  }
  lines.push(pad("Bureau Status (system)", sr.bureauStatus || "NONE"));

  lines.push(divider("ADMIN NOTES"));
  lines.push(sr.adminNote || "(admin 노트 없음)");

  lines.push("");
  lines.push("# END OF EXPORT");
  lines.push("");

  return lines.join("\n");
}

/**
 * Generate the handoff file for the given request id, persist it as an
 * UploadedFile, link it from the ServiceRequest, and transition
 * bureauStatus to EXPORTED. Returns the updated record.
 */
export async function exportDebtReportFor(serviceRequestId, adminUserId = null) {
  const sr = await prisma.serviceRequest.findUnique({
    where: { id: serviceRequestId },
    include: { user: { select: { name: true, email: true } } },
  });
  if (!sr) throw new Error("not_found");
  if (sr.type !== "DEBT_CREDIT_REPORTING") throw new Error("wrong_type");

  const text = buildDebtHandoff(sr, sr.user);
  const buf = Buffer.from(text, "utf8");

  const file = await prisma.uploadedFile.create({
    data: {
      filename: `debt-report-${sr.id}-${Date.now()}.txt`,
      mimeType: "text/plain",
      size: buf.length,
      bytes: buf,
      uploaderId: adminUserId,
    },
  });

  const updated = await prisma.serviceRequest.update({
    where: { id: serviceRequestId },
    data: {
      metroExportUrl: `/api/files/${file.id}`,
      bureauStatus: "EXPORTED",
    },
  });

  return updated;
}
