'use client';

import Link from 'next/link';

const LABS = [
  {
    id: 'relations',
    href: '/lab/relations',
    titleGu: 'સંબંધ અને વિધેય',
    titleEn: 'Relations & Functions',
    world: 'Connections World',
    color: '#3B82F6',
    icon: '🔗',
    status: 'ready' as const,
    description: 'સેટ બનાવો, જોડી ઉમેરો, સ્વવાચક / સમિત / પરંપરિત ચકાસો, વિધેયના ગુણધર્મો જુઓ.',
  },
  {
    id: 'inverse-trig',
    href: '/lab/inverse-trig',
    titleGu: 'વિકોણમિતીય પ્રતિવિધેયો',
    titleEn: 'Inverse Trigonometry',
    world: 'Angles World',
    color: '#8B5CF6',
    icon: '📐',
    status: 'coming' as const,
    description: 'યુનિટ સર્કલ, મુખ્ય કિંમતો, arcsin / arccos / arctan.',
  },
  {
    id: 'matrices',
    href: '/lab/matrices',
    titleGu: 'શ્રેણિકો',
    titleEn: 'Matrices',
    world: 'Matrix Lab',
    color: '#10B981',
    icon: '⊞',
    status: 'coming' as const,
    description: 'સરવાળો, ગુણાકાર, વ્યુત્ક્રમ, ભૌમિતિક રૂપાંતરણ.',
  },
  {
    id: 'determinants',
    href: '/lab/determinants',
    titleGu: 'નિર્ધારકો',
    titleEn: 'Determinants',
    world: 'Logic Grid',
    color: '#F59E0B',
    icon: '⊟',
    status: 'coming' as const,
    description: '2×2 / 3×3 નિર્ધારક, માઇનર, કોફેક્ટર, એડજોઇન્ટ.',
  },
  {
    id: 'continuity',
    href: '/lab/continuity',
    titleGu: 'સાતત્ય અને વિકલનીયતા',
    titleEn: 'Continuity & Differentiability',
    world: 'Calculus World',
    color: '#EC4899',
    icon: '∫',
    status: 'coming' as const,
    description: 'લિમિટ, અસાતત્ય, વિકલનીયતા, સેકન્ટથી ટેન્જેન્ટ.',
  },
  {
    id: 'derivatives',
    href: '/lab/derivatives',
    titleGu: 'વિકલનના ઉપયોગો',
    titleEn: 'Applications of Derivatives',
    world: 'Motion & Change',
    color: '#06B6D4',
    icon: '📈',
    status: 'coming' as const,
    description: 'ટેન્જેન્ટ, મહત્તમ-લઘુત્તમ, વધતા-ઘટતા અંતરાલ.',
  },
];

export default function LabHomePage() {
  return (
    <div
      style={{
        minHeight: '100dvh',
        background: '#F8FAFC',
        color: '#1E3A5F',
        fontFamily: "'Inter', 'Noto Sans Gujarati', system-ui, sans-serif",
      }}
    >
      <header
        style={{
          background: 'linear-gradient(135deg, #1E3A5F 0%, #3B82F6 100%)',
          color: 'white',
          padding: '28px 16px 32px',
        }}
      >
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <Link
            href="/"
            style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, textDecoration: 'none' }}
          >
            ← મુખ્ય એપ
          </Link>
          <h1
            style={{
              margin: '12px 0 6px',
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            ગણિત પ્રયોગશાળા
          </h1>
          <p style={{ margin: 0, opacity: 0.9, fontSize: 15 }}>
            GANIT Interactive Mathematics Lab · Std. 12
          </p>
          <p style={{ margin: '8px 0 0', opacity: 0.75, fontSize: 14 }}>
            મૂલ્યો બદલો, આલેખ જુઓ, ગુણધર્મો ચકાસો — પ્રયોગ દ્વારા શીખો.
          </p>
        </div>
      </header>

      <main style={{ maxWidth: 720, margin: '0 auto', padding: '20px 16px 60px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {LABS.map(lab => (
            <div
              key={lab.id}
              style={{
                background: 'white',
                borderRadius: 16,
                border: '1px solid #E2E8F0',
                borderLeft: `4px solid ${lab.color}`,
                padding: 16,
                opacity: lab.status === 'coming' ? 0.7 : 1,
              }}
            >
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: lab.color + '18',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    flexShrink: 0,
                  }}
                >
                  {lab.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 17 }}>{lab.titleGu}</div>
                  <div style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>
                    {lab.world}
                  </div>
                  <p style={{ margin: '8px 0 0', fontSize: 14, color: '#475569' }}>
                    {lab.description}
                  </p>
                  {lab.status === 'ready' ? (
                    <Link
                      href={lab.href}
                      style={{
                        display: 'inline-block',
                        marginTop: 12,
                        padding: '10px 18px',
                        borderRadius: 10,
                        background: lab.color,
                        color: 'white',
                        fontWeight: 600,
                        fontSize: 14,
                        textDecoration: 'none',
                      }}
                    >
                      લેબ ખોલો →
                    </Link>
                  ) : (
                    <span
                      style={{
                        display: 'inline-block',
                        marginTop: 12,
                        padding: '8px 14px',
                        borderRadius: 8,
                        background: '#F1F5F9',
                        color: '#64748B',
                        fontSize: 13,
                        fontWeight: 500,
                      }}
                    >
                      ટૂંક સમયમાં…
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <p
          style={{
            marginTop: 28,
            fontSize: 13,
            color: '#94A3B8',
            textAlign: 'center',
          }}
        >
          Phase 1 (Relations & Functions) is fully interactive.
          <br />
          Remaining labs will be added sequentially with full mathematical verification.
        </p>
      </main>
    </div>
  );
}
