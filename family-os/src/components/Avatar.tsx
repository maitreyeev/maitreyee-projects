type AvatarKind = "dad" | "mom" | "grandpa" | "grandma" | "boy" | "girl" | "person" | "baby";

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

const SKIN = "#F0C19A";
const HAIR_DARK = "#2B2118";
const HAIR_GREY = "#C9C9C2";
const MOUTH = "#5A3A22";
const BLUSH = "#EFA895";
const TORSO = "M12,64 Q12,40 24,38 L40,38 Q52,40 52,64 Z";

function Blush() {
  return (
    <>
      <ellipse cx="23.5" cy="30" rx="2.6" ry="1.8" fill={BLUSH} opacity="0.55" />
      <ellipse cx="40.5" cy="30" rx="2.6" ry="1.8" fill={BLUSH} opacity="0.55" />
    </>
  );
}

function Illustration({ kind }: { kind: AvatarKind }) {
  switch (kind) {
    case "dad":
      return (
        <>
          <path d={TORSO} fill="#3F6B4F" />
          <rect x="29" y="46" width="6" height="7" rx="1.2" fill="#345C41" />
          <circle cx="32" cy="26" r="13" fill={SKIN} />
          <path
            d="M19,22 Q19,11 32,11 Q45,11 45,22 Q45,16 32,16 Q19,16 19,22 Z"
            fill={HAIR_DARK}
          />
          <Blush />
          <circle cx="27" cy="25" r="1.7" fill={HAIR_DARK} />
          <circle cx="37" cy="25" r="1.7" fill={HAIR_DARK} />
          <path d="M26,32 Q32,36 38,32" stroke={MOUTH} strokeWidth="2" fill="none" strokeLinecap="round" />
        </>
      );
    case "mom":
      return (
        <>
          <path
            d="M14,26 Q14,13 32,12 Q50,13 50,26 L50,46 Q50,49 44,49 L44,30 Q44,18 32,18 Q20,18 20,30 L20,49 Q14,49 14,46 Z"
            fill="#3B2A20"
          />
          <path d={TORSO} fill="#EDE6D6" />
          <circle cx="32" cy="26" r="13" fill={SKIN} />
          <Blush />
          <circle cx="27" cy="25" r="1.7" fill={HAIR_DARK} />
          <circle cx="37" cy="25" r="1.7" fill={HAIR_DARK} />
          <path d="M26,32 Q32,36 38,32" stroke={MOUTH} strokeWidth="2" fill="none" strokeLinecap="round" />
          <circle cx="19.5" cy="31" r="1.1" fill="#D9A441" />
          <circle cx="44.5" cy="31" r="1.1" fill="#D9A441" />
        </>
      );
    case "grandpa":
      return (
        <>
          <path d={TORSO} fill="#C9AD8F" />
          <rect x="29" y="46" width="6" height="7" rx="1.2" fill="#B99B7C" />
          <path d="M17,27 Q16,15 24,13 Q22,20 22,27 Z" fill={HAIR_GREY} />
          <path d="M47,27 Q48,15 40,13 Q42,20 42,27 Z" fill={HAIR_GREY} />
          <circle cx="32" cy="26" r="13" fill={SKIN} />
          <path d="M27,29.5 Q32,32 37,29.5 Q32,31.5 27,29.5 Z" fill="#8B8B85" />
          <Blush />
          <circle cx="27" cy="25" r="4.3" fill="none" stroke="#4A4A46" strokeWidth="1.3" />
          <circle cx="37" cy="25" r="4.3" fill="none" stroke="#4A4A46" strokeWidth="1.3" />
          <line x1="31.3" y1="25" x2="32.7" y2="25" stroke="#4A4A46" strokeWidth="1.3" />
          <circle cx="27" cy="25" r="1.5" fill={HAIR_DARK} />
          <circle cx="37" cy="25" r="1.5" fill={HAIR_DARK} />
          <path d="M26,32 Q32,35 38,32" stroke={MOUTH} strokeWidth="2" fill="none" strokeLinecap="round" />
        </>
      );
    case "grandma":
      return (
        <>
          <path d={TORSO} fill="#8FA187" />
          <path d="M30,39 L53,58 L47,63 L25,43 Z" fill="#7C8E75" />
          <circle cx="49" cy="52" r="1" fill="#EDE6D6" />
          <circle cx="43" cy="47" r="1" fill="#EDE6D6" />
          <circle cx="32" cy="26" r="13" fill={SKIN} />
          <path
            d="M18.5,25 Q18,13 32,12 Q46,13 45.5,25 Q45,19 32,18 Q19,19 18.5,25 Z"
            fill={HAIR_GREY}
          />
          <circle cx="32" cy="11.5" r="3.6" fill={HAIR_GREY} />
          <circle cx="32" cy="17" r="1.3" fill="#A3273D" />
          <circle cx="19.5" cy="31" r="1.1" fill="#D9A441" />
          <circle cx="44.5" cy="31" r="1.1" fill="#D9A441" />
          <Blush />
          <circle cx="27" cy="25" r="4.3" fill="none" stroke="#4A4A46" strokeWidth="1.3" />
          <circle cx="37" cy="25" r="4.3" fill="none" stroke="#4A4A46" strokeWidth="1.3" />
          <line x1="31.3" y1="25" x2="32.7" y2="25" stroke="#4A4A46" strokeWidth="1.3" />
          <circle cx="27" cy="25" r="1.5" fill={HAIR_DARK} />
          <circle cx="37" cy="25" r="1.5" fill={HAIR_DARK} />
          <path d="M26,32 Q32,35 38,32" stroke={MOUTH} strokeWidth="2" fill="none" strokeLinecap="round" />
        </>
      );
    case "boy":
      return (
        <>
          <path d={TORSO} fill="#D9A441" />
          <rect x="29" y="46" width="6" height="7" rx="1.2" fill="#C79333" />
          <circle cx="32" cy="26" r="13" fill={SKIN} />
          <path
            d="M19,22 Q19,11 32,11 Q45,11 45,22 Q45,16 32,16 Q19,16 19,22 Z"
            fill={HAIR_DARK}
          />
          <Blush />
          <circle cx="27" cy="25" r="1.8" fill={HAIR_DARK} />
          <circle cx="37" cy="25" r="1.8" fill={HAIR_DARK} />
          <path d="M25,31 Q32,37 39,31" stroke={MOUTH} strokeWidth="2" fill="none" strokeLinecap="round" />
        </>
      );
    case "girl":
      return (
        <>
          <path
            d="M17,20 Q17,10 32,9.5 Q47,10 47,20 L47,34 Q47,37 43,39 L43,26 Q43,17 32,16.5 Q21,17 21,26 L21,39 Q17,37 17,34 Z"
            fill="#3B2A20"
          />
          <path d={TORSO} fill="#E8A0AC" />
          <circle cx="32" cy="26" r="13" fill={SKIN} />
          <path d="M20,15 Q32,10 44,15 L43,18 Q32,14 21,18 Z" fill="#E0678F" />
          <Blush />
          <circle cx="27" cy="25" r="1.8" fill={HAIR_DARK} />
          <circle cx="37" cy="25" r="1.8" fill={HAIR_DARK} />
          <path d="M25,31 Q32,37 39,31" stroke={MOUTH} strokeWidth="2" fill="none" strokeLinecap="round" />
        </>
      );
    case "person":
      return (
        <>
          <path d={TORSO} fill="#4F9D8B" />
          <circle cx="32" cy="26" r="13" fill={SKIN} />
          <path
            d="M19,22 Q19,12 32,12 Q45,12 45,22 Q45,17 32,17 Q19,17 19,22 Z"
            fill={HAIR_DARK}
          />
          <Blush />
          <circle cx="27" cy="25" r="1.7" fill={HAIR_DARK} />
          <circle cx="37" cy="25" r="1.7" fill={HAIR_DARK} />
          <path d="M26,32 Q32,35.5 38,32" stroke={MOUTH} strokeWidth="2" fill="none" strokeLinecap="round" />
        </>
      );
    case "baby":
      return (
        <>
          <path d="M14,64 Q14,46 24,45 L40,45 Q50,46 50,64 Z" fill="#8FC9B4" />
          <circle cx="32" cy="30" r="15" fill={SKIN} />
          <path d="M30,15 Q32,8 36,13 Q34,16 30,15 Z" fill={HAIR_DARK} />
          <ellipse cx="22" cy="34" rx="3" ry="2.1" fill={BLUSH} opacity="0.6" />
          <ellipse cx="42" cy="34" rx="3" ry="2.1" fill={BLUSH} opacity="0.6" />
          <circle cx="26" cy="29" r="1.9" fill={HAIR_DARK} />
          <circle cx="38" cy="29" r="1.9" fill={HAIR_DARK} />
          <path d="M27,37 Q32,41 37,37" stroke={MOUTH} strokeWidth="2" fill="none" strokeLinecap="round" />
        </>
      );
  }
}

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
      className={`rounded-full flex items-center justify-center shrink-0 overflow-hidden ${className}`}
      style={{ width: size, height: size, background: `${color}22` }}
    >
      {kind ? (
        <svg viewBox="0 0 64 64" style={{ width: size * 0.82, height: size * 0.82 }}>
          <Illustration kind={kind} />
        </svg>
      ) : (
        <span style={{ fontSize: size * 0.45, lineHeight: 1 }}>{emoji}</span>
      )}
    </div>
  );
}
