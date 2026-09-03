import { AVATAR_SVGS } from "./avatarSvgs";

type AvatarKind = keyof typeof AVATAR_SVGS;

const EMOJI_TO_KIND: Record<string, AvatarKind> = {
  "👨🏽": "dad",
  "👨": "dad",
  "👩🏽": "mom",
  "👩": "mom",
  "👴🏽": "grandpa",
  "👴": "grandpa",
  "👵🏽": "grandma",
  "👵": "grandma",
  "👦🏽": "boy",
  "👦": "boy",
  "👧🏽": "girl",
  "👧": "girl",
  "🧑🏽": "person",
  "🧑": "person",
  "👶🏽": "baby",
  "👶": "baby",
};

const PHOTO_KINDS = new Set<AvatarKind>(["dad", "mom", "grandpa", "grandma", "boy", "girl"]);

export default function Avatar({
  emoji,
  color,
  size = 56,
  className = "",
}: {
  emoji: string;
  color: string;
  size?: number;
  className?: string;
}) {
  const kind = EMOJI_TO_KIND[emoji];
  return (
    <div
      className={`rounded-full flex items-center justify-center shrink-0 overflow-hidden [&_svg]:w-full [&_svg]:h-full [&_svg]:block ${className}`}
      style={{ width: size, height: size, background: `${color}22` }}
    >
      {kind && PHOTO_KINDS.has(kind) ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/avatars/${kind}.png`}
          alt=""
          className="w-full h-full object-cover"
          style={{ objectPosition: "50% 35%" }}
        />
      ) : kind ? (
        <div
          style={{ width: size * 0.86, height: size * 0.86 }}
          dangerouslySetInnerHTML={{ __html: AVATAR_SVGS[kind] }}
        />
      ) : (
        <span style={{ fontSize: size * 0.45, lineHeight: 1 }}>{emoji}</span>
      )}
    </div>
  );
}
