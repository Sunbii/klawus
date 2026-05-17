import { prisma } from "../lib/db";
import { getSessionState } from "../lib/auth";
import HomeClient from "./HomeClient.jsx";

export const dynamic = "force-dynamic";

function mapColumn(c) {
  return {
    cat: c.cat,
    field: c.field,
    title: c.title,
    excerpt: c.excerpt,
    author: `${c.author.name} 변호사`,
    detail: [c.author.firm, c.author.state, c.author.field]
      .filter(Boolean)
      .join(" · "),
    sponsor: {
      label: c.sponsorLabel || c.field,
      who: c.sponsorWho || "—",
      contact: c.sponsorContact || "",
    },
  };
}

function mapScammer(s) {
  return {
    cat: s.cat,
    name: s.name,
    type: s.type,
    location: s.location,
    aliases: s.aliases || "—",
    cases: s.cases,
    status: String(s.status || "PENDING").toLowerCase(),
    brief: s.brief,
    overview: s.overview,
    patterns: s.patterns || [],
    progress: s.progress,
    damage: s.damage || "—",
    firstReport: s.firstReport || "—",
    lastUpdate:
      s.lastUpdate || new Date(s.updatedAt).toISOString().slice(0, 10),
  };
}

async function loadData() {
  let dbColumns = [];
  let dbScammers = [];
  try {
    const cols = await prisma.column.findMany({
      where: { published: true },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: 4,
      include: {
        author: {
          select: { name: true, firm: true, state: true, field: true },
        },
      },
    });
    dbColumns = cols.map(mapColumn);
  } catch (e) {
    console.error("home: column load failed", e?.message);
  }
  try {
    const items = await prisma.scammer.findMany({
      where: { published: true },
      orderBy: { updatedAt: "desc" },
    });
    dbScammers = items.map(mapScammer);
  } catch (e) {
    console.error("home: scammer load failed", e?.message);
  }
  return { dbColumns, dbScammers };
}

export default async function HomePage() {
  const [{ dbColumns, dbScammers }, session] = await Promise.all([
    loadData(),
    getSessionState(),
  ]);
  return <HomeClient dbColumns={dbColumns} dbScammers={dbScammers} session={session} />;
}
