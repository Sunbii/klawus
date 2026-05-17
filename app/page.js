import { prisma } from "../lib/db";
import { getSessionState } from "../lib/auth";
import HomeClient from "./HomeClient.jsx";

export const dynamic = "force-dynamic";

function mapColumn(c) {
  return {
    slug: c.slug,
    coverImageId: c.coverImageId,
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
    photoFileId: s.photoFileId || null,
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

function mapScamType(t) {
  const n = (t.order || 0).toString().padStart(2, "0");
  return {
    num: n,
    title: t.title,
    sign: t.sign,
    flag: t.flag,
    act: t.act,
    iconFileId: t.iconFileId || null,
  };
}

async function loadData() {
  let dbColumns = [];
  let dbScammers = [];
  let dbScamTypes = [];
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
  try {
    const types = await prisma.scamType.findMany({
      where: { published: true },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
    dbScamTypes = types.map(mapScamType);
  } catch (e) {
    console.error("home: scamType load failed", e?.message);
  }
  return { dbColumns, dbScammers, dbScamTypes };
}

export default async function HomePage() {
  const [{ dbColumns, dbScammers, dbScamTypes }, session] = await Promise.all([
    loadData(),
    getSessionState(),
  ]);
  return (
    <HomeClient
      dbColumns={dbColumns}
      dbScammers={dbScammers}
      dbScamTypes={dbScamTypes}
      session={session}
    />
  );
}
