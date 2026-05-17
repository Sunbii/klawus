const ALPHA = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // 헷갈리는 0/O/1/I 제외

export function generateInviteCode() {
  const part = () => {
    let s = "";
    for (let i = 0; i < 4; i++) {
      s += ALPHA[Math.floor(Math.random() * ALPHA.length)];
    }
    return s;
  };
  return `KL-${part()}-${part()}`;
}

export function slugify(input, fallback = "item") {
  if (!input) return `${fallback}-${Date.now().toString(36)}`;
  const base = String(input)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  if (!base) return `${fallback}-${Date.now().toString(36)}`;
  return `${base}-${Math.random().toString(36).slice(2, 7)}`;
}
