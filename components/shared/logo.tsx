type LogoProps = {
  withWordmark?: boolean;
  className?: string;
  // Taille du sceau en pixels
  size?: number;
};

// Sceau de la maison : disque vert forêt, anneau doré pointillé (effet couture),
// monogramme « 9 » en serif et un petit motif de trois points cousus dessous.
// Volontairement imparfait et épuré pour un rendu « fait main », pas plastique.
export function LogoMark({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      role="img"
      aria-label="Emblème 9boutiques"
      className={className}
    >
      <circle cx="24" cy="24" r="23" fill="#0d231b" />
      {/* anneau pointillé façon couture */}
      <circle
        cx="24"
        cy="24"
        r="20.5"
        fill="none"
        stroke="#c9a86b"
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeDasharray="0.6 2.4"
      />
      {/* monogramme 9 */}
      <text
        x="24"
        y="27.5"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="22"
        fontWeight="600"
        fill="#e6d6bf"
      >
        9
      </text>
      {/* trois points cousus sous le monogramme */}
      <g fill="#c9a86b">
        <circle cx="19.5" cy="34" r="0.85" />
        <circle cx="24" cy="34.4" r="0.85" />
        <circle cx="28.5" cy="34" r="0.85" />
      </g>
    </svg>
  );
}

export function Logo({ withWordmark = true, className, size = 40 }: LogoProps) {
  return (
    <span className={`flex items-center gap-3 ${className ?? ""}`}>
      <LogoMark size={size} />
      {withWordmark && (
        <span className="leading-none">
          <span className="block font-display text-[24px] tracking-[-0.05em] text-forest-900">
            9boutiques
          </span>
          {/* soulignement tracé à la main */}
          <span className="mt-1 block">
            <svg width="100%" height="7" viewBox="0 0 118 7" preserveAspectRatio="none" aria-hidden="true">
              <path
                d="M1 4.2 C 24 1.1, 46 6.3, 70 3.4 S 104 1.6, 117 4.4"
                fill="none"
                stroke="#b8904a"
                strokeWidth="1.1"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            <span className="mt-1 block whitespace-nowrap text-[9px] font-medium uppercase tracking-[0.28em] text-gold-500">
              Bouaké · Maison de mode
            </span>
          </span>
        </span>
      )}
    </span>
  );
}
