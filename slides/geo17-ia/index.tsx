// Rencontres Géo17 (13/11/2026) : portage open-slide de « Usages de l'IA au SIT — Rencontres Géo17.pptx » (11 slides).
// Charte SIT Pôle Marennes Oléron (design system du 18/09/2026) : bleu pétrole #003E50/#005267, cyan #08B8DC,
// sauge #8CC8A3, soleil #FFDE12 ; Libre Baskerville / Public Sans / JetBrains Mono, polices locales (hors ligne).
// Notes orateur reprises de presentation_slides.md (le .pptx final n'en contenait presque plus).
import { useId, useMemo, type ReactNode, type SVGProps } from 'react';
import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';
import { Step, Steps } from '@open-slide/core';
import phare from './assets/phare-chassiron.jpg';
import grille from './assets/grille-cover.png';
import logoPmo from './assets/logo-pmo.png';
import marais from './assets/marais-brouage.jpg';
import plantnetGeo from './assets/plantnet-geo-panoramax.png';
import gifPanoramax from './assets/geo-panoramax.gif';
import gifSwipe from './assets/geo-compare-swipe.gif';
import pampa1 from './assets/pampa-1.jpg';
import pampa2 from './assets/pampa-2.jpg';
import captureVeille from './assets/capture-veille.png';
import captureJusant from './assets/capture-jusant.png';
import tempsEnsemble from './assets/temps-ensemble.png';
import tempsTop from './assets/temps-top-projets.png';
import tempsComparatif from './assets/temps-comparatif.png';

// ---------------------------------------------------------------- polices locales (hors ligne)
// Fichiers @fontsource 5.3.0 (sous-ensemble latin) repris du deck GT Drone : embarqués par l'export HTML.
import lbRegular from './assets/fonts/libre-baskerville-latin-400-normal.woff2';
import lbBold from './assets/fonts/libre-baskerville-latin-700-normal.woff2';
import psRegular from './assets/fonts/public-sans-latin-400-normal.woff2';
import psSemibold from './assets/fonts/public-sans-latin-600-normal.woff2';
import psBold from './assets/fonts/public-sans-latin-700-normal.woff2';
import psItalic from './assets/fonts/public-sans-latin-400-italic.woff2';
import jbRegular from './assets/fonts/jetbrains-mono-latin-400-normal.woff2';

const face = (family: string, src: string, weight: number, style = 'normal') =>
  `@font-face{font-family:"${family}";src:url(${src}) format("woff2");font-weight:${weight};font-style:${style};font-display:swap}`;
const FONT_CSS = [
  face('Libre Baskerville', lbRegular, 400), face('Libre Baskerville', lbBold, 700),
  face('Public Sans', psRegular, 400), face('Public Sans', psSemibold, 600), face('Public Sans', psBold, 700),
  face('Public Sans', psItalic, 400, 'italic'),
  face('JetBrains Mono', jbRegular, 400),
].join('\n');
const FONT_STYLE_ID = 'osd-fonts-geo17-ia';
if (typeof document !== 'undefined') {
  // une seule balise <style>, mise à jour au rechargement à chaud
  let style = document.getElementById(FONT_STYLE_ID);
  if (!style) {
    style = document.createElement('style');
    style.id = FONT_STYLE_ID;
    document.head.appendChild(style);
  }
  if (style.textContent !== FONT_CSS) style.textContent = FONT_CSS;
}

// ---------------------------------------------------------------- charte
export const design: DesignSystem = {
  palette: { bg: '#FAFCFD', text: '#003E50', accent: '#0596B4' },
  fonts: {
    display: '"Libre Baskerville", Georgia, serif',
    body: '"Libre Baskerville", Georgia, serif',
  },
  typeScale: { hero: 84, body: 30 },
  radius: 16,
};

// Couleurs et polices hors DesignSystem (constantes simples, cf. slide-authoring)
const DEEP_800 = '#002B39';   // fonds sombres (bandeaux, page CTA)
const CYAN = '#08B8DC';
const SAGE = '#8CC8A3';
const GRIS = '#566268';       // texte secondaire
const GRIS_CLAIR = '#7B8A91'; // meta, dates
const BORD = '#E6EBEE';
const VERT = '#2E8B57';
const ORANGE = '#C97A0E';
const ROUGE = '#B43A2E';
const UI = '"Public Sans", Arial, sans-serif';
const MONO = '"JetBrains Mono", Consolas, monospace';
const PAD = 120;              // marge latérale unique du deck

const fill = {
  width: '100%',
  height: '100%',
  position: 'relative',
  fontFamily: 'var(--osd-font-body)',
  color: 'var(--osd-text)',
  background: 'var(--osd-bg)',
  boxSizing: 'border-box',
} as const;

/** Page de contenu : colonne flex avec marges du deck. */
const content = { ...fill, display: 'flex', flexDirection: 'column', padding: `100px ${PAD}px 90px` } as const;

// ---------------------------------------------------------------- éléments communs
/** Surtitre en capitales espacées, cyan. */
const Eyebrow = ({ children, color = 'var(--osd-accent)' }: { children: ReactNode; color?: string }) => (
  <div style={{ fontFamily: UI, fontSize: 24, fontWeight: 700, letterSpacing: '0.12em', color: color }}>{children}</div>
);

/** En-tête des pages de contenu : surtitre + titre serif (2 lignes max). */
const Header = ({ eyebrow, title }: { eyebrow: string; title: ReactNode }) => (
  <div>
    <Eyebrow>{eyebrow}</Eyebrow>
    <h2 style={{ fontFamily: 'var(--osd-font-display)', fontSize: '54px', fontWeight: 700, margin: '14px 0 0', lineHeight: 1.18 }}>
      {title}
    </h2>
  </div>
);

/** Carte blanche bordée, style design system. */
const card = { background: '#FFFFFF', border: `2px solid ${BORD}`, borderRadius: 'var(--osd-radius)', boxSizing: 'border-box' } as const;

/** Pastille arrondie (statut, catégorie). */
const Badge = ({ children, color, bg }: { children: ReactNode; color: string; bg: string }) => (
  <span style={{ fontFamily: UI, fontSize: 22, fontWeight: 700, color, background: bg, borderRadius: 999, padding: '6px 18px' }}>
    {children}
  </span>
);

/** Icône « validé » : cercle + coche. */
const Check = ({ size = 30, color = GRIS_CLAIR }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} style={{ flexShrink: 0 }}>
    <circle cx="12" cy="12" r="9.5" />
    <path d="M7.5 12.5l3 3 6-6.5" />
  </svg>
);

/** Icône « attention » : triangle. */
const Warn = ({ size = 30, color = ROUGE }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M12 3.5L21.5 20h-19z" />
    <path d="M12 10v4.5M12 17v.5" />
  </svg>
);

/** Icône « outil » (clé) pour les limites de paramétrage. */
const Tool = ({ size = 30, color = ORANGE }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" style={{ flexShrink: 0 }}>
    <path d="M14.5 4a4.5 4.5 0 0 0-4.3 5.8L4 16v4h4l6.2-6.2A4.5 4.5 0 1 0 14.5 4z" />
  </svg>
);

/** Icône « graphique » pour la note d'activité. */
const Chart = ({ size = 30, color = 'var(--osd-accent)' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <rect x="3" y="4.5" width="18" height="15" rx="2" />
    <path d="M6.5 15l3.5-4 3 2.5 4.5-5" />
  </svg>
);

/** Ligne d'une liste à puces iconographiées. */
const Item = ({ icon, children, size = 30 }: { icon: ReactNode; children: ReactNode; size?: number }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: size, lineHeight: 1.35 }}>
    {icon}
    <span>{children}</span>
  </div>
);

// ---------------------------------------------------------------- 1. Couverture
/** Coin de cadre « viseur » cyan (motif de la charte). */
const Corner = ({ pos }: { pos: 'tr' | 'bl' | 'br' }) => {
  const s = { position: 'absolute', width: 64, height: 64, borderColor: CYAN, borderStyle: 'solid', borderWidth: 0 } as const;
  const p = {
    tr: { top: 96, right: 96, borderTopWidth: 4, borderRightWidth: 4 },
    bl: { bottom: 96, left: 96, borderBottomWidth: 4, borderLeftWidth: 4 },
    br: { bottom: 96, right: 96, borderBottomWidth: 4, borderRightWidth: 4 },
  }[pos];
  return <div style={{ ...s, ...p }} />;
};

/**
 * Logo PMO qui se transforme en « IA ✦ » puis revient, en boucle (SMIL : aucune dépendance, natif dans les navigateurs).
 * Pictogramme redessiné en tracés depuis logo-pmo.png (repère 250 × 407 du PNG) ; chaque paire de tracés garde
 * la même suite de commandes pour que l'interpolation soit possible. Texte : voir `LogoTexte`.
 */
const PAUSE = 2.5; // s affichées sur chaque logo (PMO puis IA)
const MORPH = 1.75; // s de transformation, à l'aller comme au retour
const CYCLE = 2 * (PAUSE + MORPH);
const LOGO_CYCLE = `${CYCLE}s`;
/** keyTimes SMIL à partir d'instants en secondes. */
const instants = (...t: number[]) => t.map((s) => (s / CYCLE).toFixed(4)).join(';');
const LOGO_TIMES = instants(0, PAUSE, PAUSE + MORPH, 2 * PAUSE + MORPH, CYCLE);
// ponytail: pas de mouvement si l'utilisateur l'a désactivé au niveau du système (le logo reste en état PMO)
const reduceMotion = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Anime un attribut selon PMO → (pause) → IA → (pause) → PMO, ou selon `values`/`times` explicites. */
const Morph = ({ attr, pmo, ia, values, times = LOGO_TIMES }: {
  attr: string; pmo?: string | number; ia?: string | number; values?: string; times?: string;
}) =>
  reduceMotion ? null : (
    <animate attributeName={attr} dur={LOGO_CYCLE} repeatCount="indefinite" calcMode="spline"
      keyTimes={times} values={values ?? `${pmo};${pmo};${ia};${ia};${pmo}`}
      keySplines={Array(times.split(';').length - 1).fill('.65 0 .35 1').join(';')} />
  );

/** Tracé qui passe de la forme PMO `d` à la forme IA `ia` (mêmes commandes, dans le même ordre). */
const MorphPath = ({ d, ia, children, ...rest }: { d: string; ia: string } & SVGProps<SVGPathElement>) => (
  <path d={d} {...rest}><Morph attr="d" pmo={d} ia={ia} />{children}</path>
);

// Segment droit écrit en cubique, pour s'aligner sur les courbes de la forme PMO.
const seg = (x1: number, y1: number, x2: number, y2: number) =>
  `C${x1 + (x2 - x1) / 3},${y1 + (y2 - y1) / 3} ${x1 + (2 * (x2 - x1)) / 3},${y1 + (2 * (y2 - y1)) / 3} ${x2},${y2}`;

// Rayons du soleil : ils se rétractent au centre de l'étincelle et s'effacent.
const RAYONS = [[176, 3, 179, 22], [227, 18, 212, 34], [226, 65, 247, 68], [207, 98, 220, 115], [133, 28, 151, 40]];

// Texte du logo en DIN : Bahnschrift (DIN 1451 livrée avec Windows), DIN Alternate sur Mac. Polices système
// non embarquées (licence) : ailleurs, repli sur Public Sans.
const LOGO_FONT = `Bahnschrift, "DIN Alternate", ${UI}`;
type Ligne = { texte: string; y: number; poids: number; couleur: string };
type Glyphe = { ch: string; x: number; y: number; taille: number; poids: number; couleur: string };

/** Découpe des lignes en lettres positionnées (abscisse = largeur mesurée du préfixe, crénage compris). */
const placer = (lignes: Ligne[], taille: number, mesure: (t: string, poids: number) => number): Glyphe[] =>
  lignes.flatMap(({ texte, y, poids, couleur }) =>
    [...texte].map((ch, i) => ({ ch, x: (mesure(texte.slice(0, i), poids) * taille) / 100, y, taille, poids, couleur })));

// Filtre de fusion (« gooey ») : flou + seuil alpha au milieu du morph, neutre au repos pour garder des lettres nettes.
const FUSION_TIMES = instants(0, PAUSE, PAUSE + MORPH / 2, PAUSE + MORPH, 2 * PAUSE + MORPH, 2 * PAUSE + 1.5 * MORPH, CYCLE);
const NET = '1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0';
const GOO = '1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 20 -6'; // seuil bas : les lettres à demi fondues restent visibles

/** Lettre `ch` qui voyage de la position `de` à `vers`, son opacité passant de `opacites[0]` à `opacites[1]`. */
const Lettre = ({ ch, poids, de, vers, opacites: [a, b] }: {
  ch: string; poids: number; de: Glyphe; vers: Glyphe; opacites: [number, number];
}) => (
  <text x={de.x} y={de.y} fontSize={de.taille} fontWeight={poids} fill={de.couleur} opacity={a}>
    {ch}
    <Morph attr="x" pmo={de.x} ia={vers.x} />
    <Morph attr="y" pmo={de.y} ia={vers.y} />
    <Morph attr="font-size" pmo={de.taille} ia={vers.taille} />
    <Morph attr="fill" pmo={de.couleur} ia={vers.couleur} />
    {a !== b && <Morph attr="opacity" pmo={a} ia={b} />}
  </text>
);

/**
 * « Pôle Marennes Oléron » ↔ « Intelligence Artificielle » lettre à lettre. Chaque lettre IA part d'une lettre PMO :
 * la même si possible (n, e, l, r… glissent simplement), sinon la plus proche, et se fond en route (P → c…)
 * sous le filtre de fusion. IA ayant 24 lettres contre 18, les 6 dernières naissent d'une lettre déjà prise.
 */
const LogoTexte = ({ id }: { id: string }) => {
  const morphs = useMemo(() => {
    const ctx = document.createElement('canvas').getContext('2d')!;
    const mesure = (t: string, poids: number) => { ctx.font = `${poids} 100px ${LOGO_FONT}`; return ctx.measureText(t).width; };
    // tailles calées sur le PNG : « Marennes » y fait 181 de large ; « Intelligence » remplit les 246 disponibles
    const taillePmo = (181 * 100) / mesure('Marennes', 600);
    const tailleIa = Math.min(taillePmo, (246 * 100) / mesure('Intelligence', 700));
    const pmo = placer([
      { texte: 'Pôle', y: 330, poids: 700, couleur: '#005366' },
      { texte: 'Marennes', y: 368, poids: 600, couleur: '#9FC7A3' },
      { texte: 'Oléron', y: 405, poids: 600, couleur: '#68B7DA' },
    ], taillePmo, mesure);
    const ia = placer([
      { texte: 'Intelligence', y: 405 - tailleIa * 1.05, poids: 700, couleur: '#005366' },
      { texte: 'Artificielle', y: 405, poids: 600, couleur: '#68B7DA' },
    ], tailleIa, mesure);
    // appariement glouton en 3 passes : même lettre la plus proche, puis n'importe quelle lettre libre la plus
    // proche, puis (PMO épuisé) la plus proche déjà prise, dont la copie naît invisible.
    // ponytail: glouton, pas d'optimum global (algorithme hongrois) ; suffisant pour 24 lettres
    const libres = new Set(pmo.keys());
    const source = new Map<number, { i: number; copie: boolean }>(); // indice IA → lettre PMO de départ
    const dist = (a: Glyphe, b: Glyphe) => Math.hypot(a.x - b.x, a.y - b.y);
    const plusProche = (g: Glyphe, candidats: number[]) => candidats.sort((a, b) => dist(pmo[a], g) - dist(pmo[b], g))[0];
    for (const passe of ['meme', 'libre', 'copie'] as const) {
      ia.forEach((g, j) => {
        if (source.has(j)) return;
        const i = passe === 'copie' ? plusProche(g, [...pmo.keys()])
          : plusProche(g, [...libres].filter((k) => passe === 'libre' || pmo[k].ch === g.ch));
        if (i === undefined) return;
        libres.delete(i);
        source.set(j, { i, copie: passe === 'copie' });
      });
    }
    return ia.map((vers, j) => ({ de: pmo[source.get(j)!.i], vers, copie: source.get(j)!.copie }));
  }, []);
  return (
    <g fontFamily={LOGO_FONT}>
      <defs>
        <filter id={`${id}-fusion`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={0.01}>
            <Morph attr="stdDeviation" values="0.01;0.01;1.5;0.01;0.01;1.5;0.01" times={FUSION_TIMES} />
          </feGaussianBlur>
          <feColorMatrix type="matrix" values={NET}>
            <Morph attr="values" values={[NET, NET, GOO, NET, NET, GOO, NET].join(';')} times={FUSION_TIMES} />
          </feColorMatrix>
        </filter>
      </defs>
      {morphs.map(({ de, vers, copie }, k) => (
        // lettre de départ qui s'efface + lettre d'arrivée qui apparaît, sur le même trajet, fondues ensemble
        <g key={k} filter={`url(#${id}-fusion)`}>
          <Lettre ch={de.ch} poids={de.poids} de={de} vers={vers} opacites={[copie ? 0 : 1, 0]} />
          <Lettre ch={vers.ch} poids={vers.poids} de={de} vers={vers} opacites={[0, 1]} />
        </g>
      ))}
    </g>
  );
};

const LogoAnime = ({ width }: { width: number }) => {
  // ids propres à chaque instance : les miniatures du deck rendent aussi ce logo, chacune avec sa propre horloge SMIL
  const id = 'logo' + useId().replace(/\W/g, '');
  return (
  <svg width={width} viewBox="0 0 250 407" style={{ display: 'block' }} role="img" aria-label="Pôle Marennes Oléron">
    <defs>
      <linearGradient id={`${id}-degrade`} gradientUnits="userSpaceOnUse" x1="0" y1="51" x2="0" y2="280">
        <stop offset="0" stopColor="#68B7DA" />
        <stop offset="1" stopColor="#9BC6A8" />
      </linearGradient>
    </defs>
    <g fill="none" stroke={`url(#${id}-degrade)`} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round">
      {/* cadre haut + gauche → « I » */}
      <MorphPath d="M140,51 L7,51 L7,218" ia="M44,80 L44,80 L44,230" />
      {/* voile → jambages du « A » */}
      <MorphPath d="M8,218 C40,165 57,110 59,72 C120,110 175,180 180,247"
        ia={`M90,230 ${seg(90, 230, 140, 80)} ${seg(140, 80, 190, 230)}`} />
      {/* vagues → barre du « A » */}
      <MorphPath d="M7,235 C25,250 50,252 62,237 C80,245 100,250 112,248 C110,240 113,236 115,236 C135,245 160,252 180,247"
        ia={`M107,180 ${seg(107, 180, 124, 180)} ${seg(124, 180, 140, 180)} ${seg(140, 180, 157, 180)} ${seg(157, 180, 173, 180)}`} />
      {/* cadre bas → piste de circuit sous les lettres */}
      <MorphPath d="M7,235 L7,280 C50,270 90,272 120,278 C150,282 170,275 182,272 L182,300"
        ia={`M44,262 L44,262 ${seg(44, 262, 117, 262)} ${seg(117, 262, 190, 262)} L190,262`} />
      {/* montant droit : se résorbe dans le sommet du « A » */}
      <MorphPath d="M184,112 L184,191" ia="M140,80 L140,80" />
    </g>
    <g fill="none" stroke="#FFDE12" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round">
      {/* soleil → étincelle ✦ (4 arcs de cercle ↔ 4 courbes concaves) */}
      <MorphPath fill="#FFDE12" fillOpacity={0}
        d="M184,39 C198.36,39 210,50.64 210,65 C210,79.36 198.36,91 184,91 C169.64,91 158,79.36 158,65 C158,50.64 169.64,39 184,39 Z"
        ia="M205,28 C208,52 214,58 238,62 C214,66 208,72 205,96 C202,72 196,66 172,62 C196,58 202,52 205,28 Z">
        <Morph attr="fill-opacity" pmo={0} ia={1} />
      </MorphPath>
      {/* les rayons rétractés s'effacent (sinon le bout arrondi laisse un point) */}
      {RAYONS.map(([x1, y1, x2, y2], i) => (
        <MorphPath key={i} d={`M${x1},${y1} L${x2},${y2}`} ia="M205,62 L205,62">
          <Morph attr="stroke-opacity" pmo={1} ia={0} />
        </MorphPath>
      ))}
    </g>
    <LogoTexte id={id} />
  </svg>
  );
};

const Couverture: Page = () => (
  <div style={{ ...fill, background: DEEP_800, color: '#FFFFFF', overflow: 'hidden' }}>
    <img src={phare} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
    {/* voile sombre pour la lisibilité du titre, plus dense en bas à gauche */}
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,43,57,0.15) 0%, rgba(0,43,57,0.55) 45%, rgba(0,26,35,0.92) 100%)' }} />
    <img src={grille} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.25 }} />
    <Corner pos="tr" />
    <Corner pos="bl" />
    <Corner pos="br" />
    <div style={{ position: 'absolute', top: 96, left: PAD, background: '#FFFFFF', borderRadius: 14, padding: '22px 26px' }}>
      <LogoAnime width={110} />
    </div>
    <div style={{ position: 'absolute', left: PAD, right: 560, bottom: 150 }}>
      <Eyebrow color={SAGE}>SIT PÔLE MARENNES OLÉRON</Eyebrow>
      <h1 style={{ fontFamily: 'var(--osd-font-display)', fontSize: 'var(--osd-size-hero)', fontWeight: 700, lineHeight: 1.12, margin: '26px 0 40px' }}>
        Usages de l'IA au SIT : expérimentations en cours et questions ouvertes
      </h1>
      <div style={{ fontFamily: UI, fontSize: 30 }}>13 novembre 2026 — Journée Géo17</div>
    </div>
  </div>
);

// ---------------------------------------------------------------- 2. Le déclic
/** Étape du point de départ : numéro, mot-clé, précision factuelle. */
const Etape = ({ num, titre, detail }: { num: string; titre: string; detail: string }) => (
  <div style={{ ...card, flex: 1, height: 380, padding: '44px 40px', display: 'flex', flexDirection: 'column', gap: 22 }}>
    <div style={{ fontFamily: MONO, fontSize: 26, color: 'var(--osd-accent)' }}>{num}</div>
    <div style={{ fontFamily: 'var(--osd-font-display)', fontSize: 52, fontWeight: 700, lineHeight: 1.1, color: '#005267', whiteSpace: 'nowrap' }}>{titre}</div>
    <div style={{ fontSize: 30, lineHeight: 1.45, color: GRIS }}>{detail}</div>
  </div>
);

const Declic: Page = () => (
  <div style={{ ...content, justifyContent: 'center' }}>
    <Header eyebrow="POINT DE DÉPART" title="Comment on a commencé" />
    <div style={{ display: 'flex', alignItems: 'center', gap: 36, marginTop: 80 }}>
      <Etape num="01 · avril 2026" titre="Un stage" detail="Florian rejoint le SIT" />
      <Fleche />
      <Etape num="02 · 1re semaine" titre="Un cas concret" detail="Panoramax × Plantnet" />
      <Fleche />
      <Etape num="03" titre="Le déclic" detail="L'IA devient testable à notre échelle" />
    </div>
  </div>
);

// ---------------------------------------------------------------- 3. Ligne directrice
const Ligne: Page = () => (
  <div style={{ ...fill, display: 'flex', alignItems: 'center', padding: `0 ${PAD}px`, gap: 100 }}>
    <div style={{ flex: 1 }}>
      <Eyebrow>NOTRE LIGNE DIRECTRICE</Eyebrow>
      <h2 style={{ fontFamily: 'var(--osd-font-display)', fontSize: 76, fontWeight: 700, lineHeight: 1.15, margin: '20px 0 56px', whiteSpace: 'nowrap' }}>
        Augmenter, pas dépendre
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
        <Item icon={<Check size={36} />} size={36}>Tester à petite échelle</Item>
        <Item icon={<Check size={36} />} size={36}>Apprendre de chaque expérimentation</Item>
        <Item icon={<Check size={36} />} size={36}>Garder la maîtrise — pas de dépendance cachée</Item>
        <Item icon={<Check size={36} />} size={36}>Rester réversible — pouvoir changer d'outil</Item>
      </div>
    </div>
    <img src={marais} style={{ width: 560, height: 820, objectFit: 'cover', flexShrink: 0 }} />
  </div>
);

// ---------------------------------------------------------------- 4. Cas 1 : Panoramax × Plantnet
/** Bloc libellé + texte (problème / solution / résultat). */
const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <div>
    <Eyebrow color={GRIS_CLAIR}>{label}</Eyebrow>
    <div style={{ fontSize: 32, lineHeight: 1.4, marginTop: 8 }}>{children}</div>
  </div>
);

/** Étape du schéma Plantnet : `bout` = début ou fin de chaîne (forme ronde), sinon un service. */
const Noeud = ({ children, bout }: { children: ReactNode; bout?: boolean }) => (
  <div style={{
    ...card, width: 348, height: 96, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
    fontFamily: UI, fontSize: 26, lineHeight: 1.2, padding: '0 20px',
    borderRadius: bout ? 999 : 'var(--osd-radius)',
    background: bout ? '#F2F5F7' : '#FFFFFF', fontWeight: bout ? 400 : 700, color: bout ? 'var(--osd-text)' : '#005267',
  }}>{children}</div>
);

/** Flèche + étape révélées ensemble dans la chaîne Plantnet. */
const Etape3 = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>{children}</div>
);

const Cas1: Page = () => (
  <div style={content}>
    <Header eyebrow="LE DÉCLIC" title="Panoramax × Plantnet — reconnaissance d'espèces végétales" />
    <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 40 }}>
      <Steps>
        <Noeud bout>Emprise de recherche</Noeud>
        <Step><Etape3><Fleche /><Noeud>API Panoramax</Noeud></Etape3></Step>
        <Step><Etape3><Fleche /><Noeud>API Pl@ntNet</Noeud></Etape3></Step>
        <Step><Etape3><Fleche /><Noeud bout>Mise en base de données</Noeud></Etape3></Step>
      </Steps>
    </div>
    <Steps>
    <Step>
    <div style={{ display: 'flex', gap: 60, marginTop: 40, minHeight: 0 }}>
      <div style={{ width: 700, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 30 }}>
        <Field label="PROBLÈME">Comment identifier des espèces sur des vues 360° ?</Field>
        <Field label="SOLUTION">Plantnet (IA tierce) appliqué sur les images Panoramax</Field>
        <Field label="RÉSULTAT">Identifications exploitables, même si Plantnet disparaît</Field>
        <div style={{ display: 'flex', gap: 16 }}>
          <Badge color="#03728B" bg="#E6F9FD">IA tierce consommée</Badge>
          <Badge color={VERT} bg="#E8F5EC">Usage ponctuel</Badge>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <img src={plantnetGeo} style={{ width: '100%', borderRadius: 'var(--osd-radius)', border: `2px solid ${BORD}` }} />
      </div>
    </div>
    </Step>
    </Steps>
  </div>
);

// ---------------------------------------------------------------- 7. Type 2 : herbe de la pampa
const Fleche = () => <div style={{ fontSize: 48, color: CYAN, fontFamily: UI }}>→</div>;

/** Découpage Panoramax 512 × 594 avec la boîte trouvée par OWLv2 (coordonnées en px du découpage). */
const Detection = ({ src, boite, score }: { src: string; boite: [number, number, number, number]; score: number }) => {
  const [x1, y1, x2, y2] = boite;
  const pct = (v: number, total: number) => `${(100 * v) / total}%`;
  return (
    <div style={{ position: 'relative', width: 400, flexShrink: 0 }}>
      <img src={src} style={{ display: 'block', width: '100%', borderRadius: 'var(--osd-radius)' }} />
      <div style={{ position: 'absolute', left: pct(x1, 512), top: pct(y1, 594), width: pct(x2 - x1, 512), height: pct(y2 - y1, 594), border: `4px solid ${SUN_BOITE}`, boxSizing: 'border-box' }}>
        <span style={{ position: 'absolute', top: -38, left: -4, background: SUN_BOITE, color: DEEP_800, fontFamily: UI, fontSize: 20, fontWeight: 700, padding: '4px 10px', whiteSpace: 'nowrap' }}>
          herbe de la pampa · {score.toFixed(2)}
        </span>
      </div>
    </div>
  );
};
const SUN_BOITE = '#FFDE12';

const Cas2: Page = () => (
  <div style={content}>
    <Header eyebrow="TYPE 2 · VISION PAR ORDINATEUR" title="Herbe de la pampa : la repérer sur les photos Panoramax" />
    <div style={{ flex: 1, display: 'flex', gap: 60, marginTop: 50, minHeight: 0 }}>
      <div style={{ width: 760, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 36 }}>
        <Field label="CE QU'ON A FAIT">Retrouver l'herbe de la pampa sur nos vues 360° : 9 plants connus sur 10</Field>
        <Field label="RÔLE DE L'IA">OWLv2 cherche « pampas grass » sans entraînement, je valide chaque cadre</Field>
        <Field label="MAINTENABLE SANS">Modèle ouvert qui tourne chez nous, détections validées gardées</Field>
        <div style={{ display: 'flex', gap: 16 }}>
          <Badge color="#03728B" bg="#E6F9FD">Vision par IA</Badge>
          <Badge color={VERT} bg="#E8F5EC">Modèle ouvert, en local</Badge>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
        <Detection src={pampa1} boite={[123, 129, 505, 537]} score={0.84} />
        <Detection src={pampa2} boite={[112, 186, 393, 508]} score={0.71} />
      </div>
    </div>
  </div>
);

// ---------------------------------------------------------------- 5. La carte : 4 types d'usage
/** Petite boîte d'un projet. `zoom` : détaillé plus loin ; `abandon` : arrêté ou abandonné. */
const Projet = ({ children, zoom, abandon }: { children: ReactNode; zoom?: boolean; abandon?: boolean }) => (
  <div style={{
    fontFamily: UI, fontSize: 21, lineHeight: 1.25, padding: '8px 14px', borderRadius: 8,
    background: zoom ? 'var(--osd-accent)' : abandon ? 'transparent' : '#F2F5F7',
    color: zoom ? '#FFFFFF' : abandon ? GRIS_CLAIR : 'var(--osd-text)',
    border: abandon ? `2px dashed ${GRIS_CLAIR}` : '2px solid transparent',
    fontWeight: zoom ? 700 : 400,
  }}>{children}</div>
);

/** Grande boîte d'un type d'usage : titre, rapport à la dépendance, projets. */
const Type = ({ num, titre, rapport, width, children }: { num: string; titre: string; rapport: string; width: number; children: ReactNode }) => (
  <div style={{ ...card, width, padding: '26px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
      <span style={{ fontFamily: MONO, fontSize: 22, color: 'var(--osd-accent)' }}>{num}</span>
      <span style={{ fontFamily: 'var(--osd-font-display)', fontSize: 30, fontWeight: 700, color: '#005267' }}>{titre}</span>
      <span style={{ fontFamily: UI, fontSize: 20, fontWeight: 700, color: VERT, marginLeft: 'auto' }}>{rapport}</span>
    </div>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>{children}</div>
  </div>
);

const Carte: Page = () => (
  <div style={{ ...content, paddingTop: 80, paddingBottom: 60 }}>
    <Header eyebrow="VUE D'ENSEMBLE" title="≈ 40 projets depuis mai 2026, 4 types d'usage" />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 36, marginTop: 30 }}>
      <div style={{ display: 'flex', gap: 36 }}>
        <Steps>
        <Step><Type num="01" titre="Code et carto web" rapport="Construit avec, maintenable sans" width={1088}>
          <Projet zoom>Slider et loupe GEO</Projet>
          <Projet zoom>Module Panoramax</Projet>
          <Projet zoom>Filiation DFI</Projet>
          <Projet>Annonces GEO</Projet>
          <Projet>Portail des modules GEO</Projet>
          <Projet>À portée de vélo PMO</Projet>
          <Projet>À portée de vélo France</Projet>
          <Projet>Flux WMS MapServer</Projet>
          <Projet>cogify-server</Projet>
          <Projet>Rampes de couleur</Projet>
          <Projet>784 photos 2011 géoréf.</Projet>
          <Projet>Panoramax vs Street View</Projet>
          <Projet>panoramax2pg</Projet>
          <Projet abandon>Pipeline ortho Metashape</Projet>
        </Type></Step>
        <Step><Type num="02" titre="Vision" rapport="Modèles locaux" width={556}>
          <Projet>Lutrins CCBM</Projet>
          <Projet zoom>Panoramax × Plantnet</Projet>
          <Projet>Panneaux de signalisation</Projet>
          <Projet zoom>Herbe de la pampa</Projet>
          <Projet abandon>Segmentation Panoramax</Projet>
        </Type></Step>
        </Steps>
      </div>
      <div style={{ display: 'flex', gap: 36 }}>
        <Steps>
        <Step><Type num="03" titre="Routines locales" rapport="Rien ne sort" width={556}>
          <Projet zoom>Veille SIT</Projet>
          <Projet zoom>Jusant</Projet>
          <Projet>Versement Panoramax</Projet>
          <Projet>IA dans PostgreSQL</Projet>
          <Projet abandon>Factures vers Notion</Projet>
          <Projet abandon>Auto-veille n8n</Projet>
        </Type></Step>
        <Step><Type num="04" titre="Rédaction et administratif" rapport="Cloud assumé, un humain relit" width={1088}>
          <Projet zoom>Suivi du temps SIT</Projet>
          <Projet>Étude du BP 2027</Projet>
          <Projet>Note d'intention SyMONT</Projet>
          <Projet>Relecture de convention</Projet>
          <Projet>Prévisionnel en ETP</Projet>
          <Projet>Posts LinkedIn, newsletter</Projet>
          <Projet>Tutos et actus GEO</Projet>
          <Projet>Diaporama GT Drone</Projet>
          <Projet>Vidéo À portée de vélo</Projet>
          <Projet>Cette présentation</Projet>
        </Type></Step>
        </Steps>
      </div>
    </div>
    <div style={{ display: 'flex', gap: 24, alignItems: 'center', justifyContent: 'center', marginTop: 32, fontFamily: UI, fontSize: 20, color: GRIS }}>
      <Projet zoom>détaillé</Projet>
      <Projet>autre projet</Projet>
      <Projet abandon>arrêté ou abandonné</Projet>
    </div>
  </div>
);

// ---------------------------------------------------------------- 6. Type 1 : modules GEO
// ponytail: GIF 480 × 361 agrandis 1,5× (un peu flous), à remplacer par des vidéos ≥ 1280 px
const DEMO_W = 720;
const DEMO_H = 542;

/** Démo animée d'un module GEO, avec son nom au-dessus. Couche absolue pour pouvoir s'empiler. */
const Demo = ({ src, nom }: { src: string; nom: string }) => (
  <div style={{ position: 'absolute', inset: 0, background: 'var(--osd-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
    <Eyebrow color={GRIS_CLAIR}>{nom}</Eyebrow>
    <img src={src} style={{ width: DEMO_W, height: DEMO_H, borderRadius: 'var(--osd-radius)', border: `2px solid ${BORD}` }} />
  </div>
);
const CasGeo: Page = () => (
  <div style={content}>
    <Header eyebrow="TYPE 1 · CODE ET CARTO WEB" title="Modules GEO : construits avec l'IA, maintenables sans" />
    <div style={{ flex: 1, display: 'flex', gap: 80, marginTop: 50, minHeight: 0 }}>
      <div style={{ width: 760, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 40 }}>
        <Field label="CE QU'ON A FAIT">Slider et loupe de comparaison, module Panoramax, filiation DFI</Field>
        <Field label="RÔLE DE L'IA">Claude Code écrit le code, je l'essaie dans un vrai GEO, je valide</Field>
        <Field label="MAINTENABLE SANS">Code commenté, dépôt public, relu par le mainteneur de la communauté</Field>
        <div style={{ display: 'flex', gap: 16 }}>
          <Badge color="#03728B" bg="#E6F9FD">IA générative cloud</Badge>
          <Badge color={VERT} bg="#E8F5EC">Code à nous</Badge>
        </div>
      </div>
      {/* le 2e module recouvre le 1er au clic : même emplacement, fond opaque */}
      <div style={{ position: 'relative', flex: 1, alignSelf: 'center', height: DEMO_H + 50 }}>
        <Demo src={gifPanoramax} nom="Module Panoramax" />
        <Steps>
          <Step><Demo src={gifSwipe} nom="Slider et loupe de comparaison" /></Step>
        </Steps>
      </div>
    </div>
  </div>
);

// ---------------------------------------------------------------- 8. Type 3 : routines locales
/** Étape d'un schéma de routine. `modele` : l'étape tenue par le modèle local (mise en avant). */
const Bloc = ({ children, modele }: { children: ReactNode; modele?: boolean }) => (
  <div style={{
    ...card, flex: 1, height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
    fontFamily: UI, fontSize: 22, lineHeight: 1.25, padding: '0 10px',
    background: modele ? 'var(--osd-accent)' : '#FFFFFF', color: modele ? '#FFFFFF' : 'var(--osd-text)', fontWeight: modele ? 700 : 400,
  }}>{children}</div>
);

/** Schéma de fonctionnement d'une routine : titre, chaîne sur une ligne, légende. */
const Schema = ({ titre, legende, children }: { titre: string; legende: string; children: ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
    <Eyebrow color={GRIS_CLAIR}>{titre}</Eyebrow>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>{children}</div>
    <div style={{ fontFamily: UI, fontSize: 26, color: GRIS_CLAIR }}>{legende}</div>
  </div>
);

const Petite = () => <div style={{ fontSize: 36, color: CYAN, fontFamily: UI }}>→</div>;

/** Page d'une routine sur le modèle de la page 6 : 3 rubriques à gauche, son schéma à droite. */
const Routine = ({ titre, fait, role, sans, schema, capture }: { titre: string; fait: string; role: string; sans: string; schema: ReactNode; capture: string }) => (
  <div style={content}>
    <Header eyebrow="TYPE 3 · ROUTINES LOCALES" title={titre} />
    <div style={{ flex: 1, display: 'flex', gap: 60, marginTop: 50, minHeight: 0 }}>
      <div style={{ width: 760, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 36 }}>
        <Field label="CE QU'ON A FAIT">{fait}</Field>
        <Field label="RÔLE DE L'IA">{role}</Field>
        <Field label="MAINTENABLE SANS">{sans}</Field>
        <div style={{ display: 'flex', gap: 16 }}>
          <Badge color="#03728B" bg="#E6F9FD">IA générative locale</Badge>
          <Badge color={VERT} bg="#E8F5EC">Rien ne sort</Badge>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 36 }}>
        {schema}
        {/* capture du message reçu dans Discord */}
        <img src={capture} style={{ width: '100%', borderRadius: 'var(--osd-radius)', border: `2px solid ${BORD}` }} />
      </div>
    </div>
  </div>
);

const CasVeille: Page = () => (
  <Routine
    titre="Veille SIT : un modèle local qui note, sans filtrer"
    fait="Une veille quotidienne, en production depuis le 1er octobre"
    role="mistral-small note chaque article, il ne jette jamais rien"
    sans="Python collecte et publie : sans modèle, on perd la note, pas la veille"
    capture={captureVeille}
    schema={
      <Schema titre="FONCTIONNEMENT" legende="Tout tourne sur le serveur de Marennes">
        <Bloc>Flux RSS</Bloc>
        <Petite />
        <Bloc>Python collecte</Bloc>
        <Petite />
        <Bloc modele>mistral-small note</Bloc>
        <Petite />
        <Bloc>Salon Discord</Bloc>
      </Schema>
    }
  />
);

const CasJusant: Page = () => (
  <Routine
    titre="Jusant : le point du soir, rédigé par Python"
    fait="Chaque soir, prévu, fait et reports. En test avec un collègue"
    role="gemma ne fait que recopier ce que Python a rédigé"
    sans="Au début, gemma inventait dates et statuts : Python rédige tout"
    capture={captureJusant}
    schema={
      <Schema titre="FONCTIONNEMENT" legende="Le modèle n'a jamais le dernier mot">
        <Bloc>Notion : tâches, temps</Bloc>
        <Petite />
        <Bloc>Python rédige</Bloc>
        <Petite />
        <Bloc modele>gemma recopie</Bloc>
        <Petite />
        <Bloc>Point du soir</Bloc>
      </Schema>
    }
  />
);

// ---------------------------------------------------------------- 9. Type 4 : rédaction et admin
// Rotation : chaque vue est visible ~1/3 du cycle, avec un fondu qui chevauche la suivante
const ROTATION_S = 5; // secondes par vue (réglable)
const ROTATION_CSS = `
@keyframes geo17-rotation { 0% { opacity: 0 } 3% { opacity: 1 } 33.3% { opacity: 1 } 36.3% { opacity: 0 } 100% { opacity: 0 } }
@media (prefers-reduced-motion: reduce) { .geo17-ecran { animation: none !important; } }
`;

/** Capture avec son titre, en couche absolue ; `decalage` = rang dans la rotation (0, 1, 2). Noms masqués en amont. */
const Ecran = ({ src, nom, decalage }: { src: string; nom: string; decalage: number }) => (
  <div className="geo17-ecran" style={{
    position: 'absolute', inset: 0, background: 'var(--osd-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
    // sans animation (miniatures, mouvement réduit) : seule la 1re vue reste visible
    opacity: decalage === 0 ? 1 : 0,
    // délai négatif : la vue n démarre déjà à sa place dans le cycle, rien ne clignote au chargement
    animation: `geo17-rotation ${3 * ROTATION_S}s linear infinite`, animationDelay: `${-(3 - decalage) % 3 * ROTATION_S}s`,
  }}>
    <Eyebrow color={GRIS_CLAIR}>{nom}</Eyebrow>
    <img src={src} style={{ maxWidth: '100%', maxHeight: 500, borderRadius: 'var(--osd-radius)', border: `2px solid ${BORD}` }} />
  </div>
);
const CasAdmin: Page = () => (
  <div style={content}>
    <Header eyebrow="TYPE 4 · RÉDACTION ET ADMINISTRATIF" title="Suivi du temps passé au SIT" />
    <div style={{ flex: 1, display: 'flex', gap: 80, marginTop: 50, minHeight: 0 }}>
      <div style={{ width: 760, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 40 }}>
        <Field label="CE QU'ON A FAIT">Le temps passé par projet et par structure, en ETP, depuis 2024</Field>
        <Field label="RÔLE DE L'IA">Claude transforme l'export Notion en rapport interactif</Field>
        <Field label="MAINTENABLE SANS">Un seul fichier HTML, sans serveur, lisible par tous</Field>
        <div style={{ display: 'flex', gap: 16 }}>
          <Badge color="#03728B" bg="#E6F9FD">IA générative cloud</Badge>
          <Badge color={VERT} bg="#E8F5EC">Un fichier qui reste</Badge>
        </div>
      </div>
      {/* 3 vues du rapport en rotation automatique (fondu enchaîné, boucle) */}
      <div style={{ position: 'relative', flex: 1, alignSelf: 'center', height: 560 }}>
        <style>{ROTATION_CSS}</style>
        <Ecran src={tempsEnsemble} nom="Vue d'ensemble" decalage={0} />
        <Ecran src={tempsTop} nom="Projets les plus chronophages" decalage={1} />
        <Ecran src={tempsComparatif} nom="Comparaison 2025 / 2026" decalage={2} />
      </div>
    </div>
  </div>
);

// ---------------------------------------------------------------- 8. Lucidité
/** Ligne de limite : icône + sujet en gras + constat. */
const Limite = ({ icon, sujet, children }: { icon: ReactNode; sujet: string; children: ReactNode }) => (
  <div style={{ ...card, display: 'flex', alignItems: 'center', gap: 24, padding: '24px 34px', fontSize: 30 }}>
    {icon}
    <span><b>{sujet}</b> : {children}</span>
  </div>
);

const Lucidite: Page = () => (
  <div style={{ ...content, justifyContent: 'center' }}>
    <Header eyebrow="LIMITES" title="L'IA, ce n'est pas magique… et c'est normal" />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 50 }}>
      <Limite icon={<Tool />} sujet="Hermès / Ollama">pas encore prêt pour remplacer Claude au quotidien</Limite>
      <Limite icon={<Chart />} sujet="Note d'activité">restée à l'état de test, rien de déployé pour l'instant</Limite>
      <Limite icon={<Warn />} sujet="Segmentation Panoramax">testée, abandonnée</Limite>
    </div>
    <div style={{ marginTop: 30, background: DEEP_800, color: '#FFFFFF', borderRadius: 'var(--osd-radius)', padding: '34px 44px', fontSize: 36, fontStyle: 'italic', translate: '0px 45.56px', textAlign: 'center' }}>
      L'IA est un outil, pas une solution miracle.
    </div>
  </div>
);

// ---------------------------------------------------------------- 8 bis. Organisation (choix IA générative du 02/11/2026)
const Organisation: Page = () => (
  <div style={{ ...content, justifyContent: 'center' }}>
    <Header eyebrow="ORGANISATION" title="Comment on s'organise maintenant" />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 50 }}>
      <Limite icon={<Tool />} sujet="Un outil d'équipe">Claude Team : le chat pour les 3, Claude Code quand un vrai besoin de script arrive</Limite>
      <Limite icon={<Chart />} sujet="Un contexte commun">un dépôt partagé que lisent tous nos assistants : service, stack, règles</Limite>
      <Limite icon={<Warn />} sujet="Des règles sur les données">le nominatif ne part jamais dans le cloud, il reste en local (Ollama)</Limite>
      <Limite icon={<Chart />} sujet="Un forfait, pas d'API">aucune dépense à la consommation</Limite>
      <Limite icon={<Tool />} sujet="Un humain a le dernier mot">le code décide, le modèle reformule, on relit</Limite>
    </div>
    <div style={{ marginTop: 30, background: DEEP_800, color: '#FFFFFF', borderRadius: 'var(--osd-radius)', padding: '34px 44px', fontSize: 36, fontStyle: 'italic', textAlign: 'center' }}>
      Le contexte est à nous, l'outil reste remplaçable.
    </div>
  </div>
);

// ---------------------------------------------------------------- 12 bis. Au quotidien : terminal + Claude Code, démo live
/** Ligne du terminal factice : `invite` en cyan (commande tapée), sinon sortie grisée. */
const Ligne_ = ({ invite, children }: { invite?: string; children: ReactNode }) => (
  <div style={{ color: invite ? '#FFFFFF' : '#9FB3BB' }}>
    {invite && <span style={{ color: CYAN }}>{invite} </span>}{children}
  </div>
);

const Quotidien: Page = () => (
  <div style={content}>
    <Header eyebrow="AU QUOTIDIEN" title="Concrètement : un terminal et un assistant qui connaît le service" />
    <div style={{ flex: 1, display: 'flex', gap: 70, marginTop: 50, minHeight: 0 }}>
      <div style={{ width: 760, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 34 }}>
        <Field label="1. JE DÉCRIS">En français, dans le terminal, comme à un collègue</Field>
        <Field label="2. IL LIT LE CONTEXTE">Le dépôt commun : service, stack, règles sur les données</Field>
        <Field label="3. IL PROPOSE, J'ESSAIE">Il écrit le code ou le texte, je teste dans le vrai outil</Field>
        <Field label="4. JE VALIDE">Rien n'est publié ni écrit en base sans moi</Field>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 28 }}>
        {/* ponytail: terminal factice en HTML, sert aussi de plan B si pas de réseau pour la démo */}
        <div style={{ background: DEEP_800, borderRadius: 'var(--osd-radius)', padding: '26px 34px', fontFamily: MONO, fontSize: 23, lineHeight: 1.6 }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
            {[ROUGE, '#FFDE12', SAGE].map((c) => <span key={c} style={{ width: 16, height: 16, borderRadius: 8, background: c }} />)}
          </div>
          <Ligne_ invite="PS>">claude</Ligne_>
          {/* échange réel : issue #29 du module DFI de VCA → PR #30 (04/11/2026) */}
          <Ligne_ invite="›">traite l'issue #29 du module DFI</Ligne_>
          <Ligne_>● lit les règles de contribution des modules GEO</Ligne_>
          <Ligne_>● crée une branche, modifie le module</Ligne_>
          <Ligne_ invite="›">testé dans GEO 4.3.2, ça marche</Ligne_>
          <Ligne_ invite="›">garde aussi les contours sur la carte</Ligne_>
          <Ligne_>● ajuste, je reteste</Ligne_>
          <Ligne_>✓ PR #30 ouverte chez Vienne Condrieu</Ligne_>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <Badge color="#03728B" bg="#E6F9FD">Terminal + Claude Code</Badge>
          <Badge color="#03728B" bg="#E6F9FD">Skills maison</Badge>
          <Badge color={VERT} bg="#E8F5EC">Git / GitHub</Badge>
          <Badge color={VERT} bg="#E8F5EC">Notion</Badge>
          <Badge color={VERT} bg="#E8F5EC">Ollama local</Badge>
        </div>
      </div>
    </div>
  </div>
);

// ---------------------------------------------------------------- 12. Questions ouvertes
const Questions: Page = () => (
  <div style={{ ...content, justifyContent: 'center' }}>
    <Header eyebrow="QUESTIONS OUVERTES" title="Ce qui nous pose question" />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 50 }}>
      <Limite icon={<Chart />} sujet="Quels outils en 2027 ?">souverains, performants, ou un mélange des deux</Limite>
      <Limite icon={<Chart />} sujet="Où vit la mémoire ?">entre les outils, nos notes et le dépôt partagé</Limite>
      <Limite icon={<Chart />} sujet="L'IA dans notre base ?">en lecture seule, en liste blanche, encore en conception</Limite>
      <Limite icon={<Warn />} sujet="Quel coût environnemental ?">énergie et eau des centres de données mal connues, et le local consomme aussi</Limite>
    </div>
    <div style={{ marginTop: 30, background: DEEP_800, color: '#FFFFFF', borderRadius: 'var(--osd-radius)', padding: '34px 44px', fontSize: 36, fontStyle: 'italic', textAlign: 'center' }}>Une seule certitude : rester réversibles</div>
  </div>
);

// ---------------------------------------------------------------- 13. Suite : un GT IA ?
const GtIa: Page = () => (
  <div style={{ ...fill, background: DEEP_800, color: '#FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: `0 ${PAD + 140}px` }}>
    <Eyebrow color={SAGE} style={{ fontSize: '40px' }}>ET LA SUITE ?</Eyebrow>
    <h2 style={{ fontFamily: 'var(--osd-font-display)', fontSize: '80px', fontWeight: 700, margin: '30px 0 0', lineHeight: 1.15, minWidth: '0px', minHeight: '0px', maxWidth: 'none', maxHeight: 'none', flexShrink: '0', flexGrow: '0', flexBasis: 'auto', width: '1448.45px', height: '184px', translate: '0px 36.77px' }}>
      Un GT IA dans le cadre de Géo17 ?
    </h2>
  </div>
);

// ---------------------------------------------------------------- 14. Merci
const Merci: Page = () => (
  <div style={{ ...fill, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
    <h2 style={{ fontFamily: 'var(--osd-font-display)', fontSize: 140, fontWeight: 700, margin: 0, lineHeight: 1.1 }}>Merci !</h2>
    <div style={{ fontSize: 40, marginTop: 20, color: GRIS }}>Des questions ?</div>
    <div style={{ fontFamily: UI, fontSize: 32, fontWeight: 700, marginTop: 90 }}>Aurélien Chaumet — SIT Pôle Marennes Oléron</div>
    <div style={{ fontFamily: UI, fontSize: 28, marginTop: 14, color: GRIS_CLAIR, lineHeight: 1.5 }}>
      a.chaumet@marennes-oleron.com
    </div>
    <img src={logoPmo} style={{ width: 130, marginTop: 70 }} />
  </div>
);

// ---------------------------------------------------------------- deck
export const meta: SlideMeta = {
  title: 'Usages de l\'IA au SIT — Rencontres Géo17 - 13 novembre 2026',
  createdAt: '2026-10-20T14:26:24.548Z',
};

export default [Couverture, Declic, Cas1, Ligne, Carte, CasGeo, Cas2, CasVeille, CasJusant, CasAdmin, Lucidite, Organisation, Quotidien, Questions, GtIa, Merci] satisfies Page[];

export const notes: (string | undefined)[] = [
  `En préambule : « Ce n'est pas un cours sur l'IA générative. Tout le monde n'est pas à l'aise avec tous les concepts, alors je vais vulgariser. Si je dis un gros mot, n'hésitez pas à m'interrompre. »

Question pour la salle : « Combien d'entre vous utilisent déjà l'IA, générative ou autre, dans le cadre pro ? »`,
  `Il y a 6 mois, je ne voyais pas comment l'IA pouvait nous accompagner en géomatique. 
Florian arrive en stage en avril ; dès sa première semaine, il propose Panoramax × Plantnet.
`,
  `Plantnet est un outil externe, mais on l'utilise de manière ponctuelle.
« Le résultat reste exploitable même sans Plantnet demain. »
« C'est le premier essai, tout petit. C'est lui qui a tout déclenché. »`,
  `« C'est le fil conducteur de notre approche au SIT. »
Insister sur la réversibilité : ce qu'on construit doit survivre si on change d'outil, ou si l'outil disparaît.`,
  `« Depuis mai, environ 40 projets menés avec un assistant IA. On les range en 4 types. »
Chaque type a un rapport différent à la dépendance : c'est ce qu'on va voir avec un exemple par type.`,
  `Modules GEO : slider et loupe pour comparer des orthos, module Panoramax, filiation des parcelles (DFI) développés en collaboration avec Vienne Condrieu.
Claude Code écrit, j'essaie dans un vrai GEO, je valide. Rien n'est poussé sans essai.
Code commenté, dépôt public, relu par le mainteneur : quelqu'un d'autre peut le reprendre sans IA.
Sans IA : pas ce projet et on attendrait encore les modules de la part de BG`,
  `L'herbe de la pampa est une espèce invasive. On avait des points connus, on voulait savoir si l'IA les retrouvait sur nos vues Panoramax.
OWLv2 : un modèle ouvert, à qui on décrit ce qu'on cherche en mots (« pampas grass »), sans lui montrer d'exemples. Il tourne chez nous.
Python récupère les photos qui regardent chaque point, l'IA propose des cadres, on les valide un par un dans une petite page web.
Chiffres : 271 photos relues, 9 plants connus sur 10 retrouvés. Les fausses alertes : roseaux, palmiers, haies.
Prochaine étape : en attente avant de généraliser tant que les images Panoramax ne sont pas mieux calées géographiquement.
Mais on a les outils et on peut bosser sans IAGen`,
  `Première routine, sur notre serveur de Marennes, avec un modèle local : rien ne sort.
Python collecte les articles des flux RSS, mistral-small leur donne une note, il ne jette rien. Le résultat arrive dans un salon Discord.
Si le modèle tombe, on perd la note, pas la veille.`,
  `Deuxième routine : Jusant, le point du soir.
Leçon : au début, gemma rédigeait, il se trompait de jour et inventait des statuts. Depuis, Python rédige et le modèle ne fait que recopier.
C'est la règle de toutes nos routines : le modèle n'a jamais le dernier mot.`,
  `Le cas le plus « administratif » : le suivi du temps passé au SIT.
Un export Notion devient un rapport HTML, un seul fichier, sans serveur.
Ici on assume le cloud : données internes, pas nominatives au sens sensible. Et un humain relit les chiffres.
Autres exemples du même type : l'étude du BP 2027, la note d'intention du SyMONT, cette présentation.
Sans l'IA: je faisais des analyses de ce type mais avec çame permet d'avoir un format similaire d'un trimestre à l'autre et de le rendre partageable facilement`,
  `« On capitalise sur nos échecs, c'est comme ça qu'on progresse. »
Hermès + Ollama : l'IA générative 100 % locale, testée, pas encore prête pour le quotidien.
Transition : « Alors, pour ne pas se perdre, on commence à s'organiser. »`,
  `Choix d'équipe de début novembre 2026.
- Claude Team, 3 sièges au forfait : plus de comptes gratuits perso pour le travail. Claude Code pour moi d'abord, pour les collègues quand le besoin viendra.
- Le contexte commun : un dépôt git privé, lu par Claude Code comme par les autres outils. On ne réexplique plus le service à chaque conversation.
- Rouge / orange / vert : fichiers fonciers, DV3F, déchets → jamais dans le cloud, uniquement Ollama sur notre serveur.
- Pas d'API : pas de facture surprise, crédits hors forfait désactivés.
- Routines : Python collecte et décide, le modèle classe ou reformule, un humain relit.
Message : « Si demain on change d'outil, on garde notre contexte. C'est ça, augmenter sans dépendre. »`,
  `Concrètement, comment je travaille : un terminal Windows (PowerShell) et Claude Code dedans.
Je décris en français, il lit d'abord notre dépôt commun (service, stack, règles rouge / orange / vert), il propose, j'essaie dans le vrai outil, je valide.
Exemple réel à l'écran : l'issue #29 du module de filiation des parcelles (DFI) de Vienne Condrieu. Retrouver la dernière filiation après une interrogation au clic.
Claude lit d'abord nos règles de contribution, crée une branche, code. J'essaie dans GEO 4.3.2. Après essai, je lui demande de garder aussi les contours sur la carte. Il ajuste, je reteste, la PR #30 part chez le mainteneur, qui relit avant de fusionner.
Les skills maison : des consignes écrites une fois, réutilisées (ex. Jusant, créer une tâche Notion).
[EN SUSPENS, pas décidé] Démo en direct (3-4 min, seulement si le réseau tient) : « Donnez-moi 3 communes où vous travaillez. »
Prompt (préparé dans un fichier texte, à copier-coller) : « Fais-moi une carte web en un seul fichier HTML avec les contours des communes X, Y, Z (API Géo, geo.api.gouv.fr). Au clic sur une commune, affiche la photo Panoramax la plus proche du centre (api.panoramax.xyz). Ouvre-la dans le navigateur. »
Message : « Ça, je ne sais pas le coder seul. Données publiques, sans clé, un fichier qu'on garde : c'est réversible. »
Plan B sans réseau : la carte générée en répétition, ouverte en local, et le terminal affiché sur la diapo.`,
  `« On n'est sûrs de rien. » Quatre questions qu'on se pose encore, rapidement.
Coût environnemental : les fournisseurs publient peu de chiffres fiables sur l'énergie et l'eau. Notre serveur GPU de Marennes consomme aussi. On ne sait pas encore mesurer notre propre empreinte : c'est une question ouverte, pas une excuse.
Finir sur : « La seule chose dont on est sûrs, c'est qu'on veut pouvoir faire marche arrière. »`,
];
