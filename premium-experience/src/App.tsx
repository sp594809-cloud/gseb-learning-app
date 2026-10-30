import { useState } from 'react'
import './index.css'
import { chapters, student, achievements, dailyChallenge } from './data/mockData'

type Tab = 'home' | 'chapters' | 'practice' | 'progress' | 'profile'

function ProgressRing({ progress, size = 64, stroke = 6, color = '#3B82F6' }: { progress: number; size?: number; stroke?: number; color?: string }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (progress / 100) * c
  return (
    <svg width={size} height={size} className="progress-ring">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#E2E8F0" strokeWidth={stroke} />
      <circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeDasharray={c} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.22,1,0.36,1)' }}
      />
    </svg>
  )
}

function HomeScreen({ onContinue }: { onContinue: () => void }) {
  const current = chapters.find(c => c.status === 'in-progress') || chapters[0]
  const unlockedAchievements = achievements.filter(a => a.unlocked)

  return (
    <div style={{ padding: '16px 16px 100px', maxWidth: 480, margin: '0 auto' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <p className="gujarati" style={{ margin: 0, fontSize: 14, color: 'var(--color-muted)' }}>નમસ્તે,</p>
          <h1 className="gujarati" style={{ margin: '2px 0 0', fontSize: 26, fontWeight: 700 }}>{student.name} 👋</h1>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>Level {student.level}</div>
          <div style={{ fontWeight: 700, color: 'var(--color-saffron)' }}>{student.xp} XP</div>
        </div>
      </header>

      {/* Continue Learning Card */}
      <div className="card-elevated" style={{ padding: 20, marginBottom: 20, background: 'linear-gradient(135deg, #1E3A5F 0%, #3B82F6 100%)', color: 'white', border: 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ margin: 0, fontSize: 13, opacity: 0.85 }}>ચાલુ રાખો</p>
            <h2 className="gujarati" style={{ margin: '6px 0 4px', fontSize: 20, fontWeight: 700 }}>{current.nameGu}</h2>
            <p style={{ margin: 0, fontSize: 13, opacity: 0.8 }}>{current.world}</p>
          </div>
          <ProgressRing progress={current.progress} size={56} stroke={5} color="#FBBF24" />
        </div>
        <div style={{ marginTop: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
          <button
            onClick={onContinue}
            style={{
              flex: 1, background: 'white', color: '#1E3A5F', border: 'none',
              borderRadius: 12, padding: '14px 20px', fontWeight: 600, fontSize: 15,
              cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            Continue Learning →
          </button>
        </div>
        <div style={{ marginTop: 12, fontSize: 12, opacity: 0.75 }}>
          {current.questionsDone}/{current.questionsTotal} પ્રશ્નો · {current.progress}% પૂર્ણ
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
        {[
          { label: 'આજે', value: student.questionsToday, sub: 'પ્રશ્નો' },
          { label: 'સ્ટ્રીક', value: student.streak, sub: 'દિવસ' },
          { label: 'સચોટતા', value: student.accuracy + '%', sub: 'સાચા' },
        ].map((s, i) => (
          <div key={i} className="card-elevated" style={{ padding: '14px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{s.value}</div>
            <div className="gujarati" style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Daily Challenge */}
      <div className="card-elevated" style={{ padding: 16, marginBottom: 20, borderLeft: '4px solid var(--color-saffron)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="gujarati" style={{ fontWeight: 600, fontSize: 15 }}>{dailyChallenge.titleGu}</div>
            <div style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 2 }}>{dailyChallenge.description}</div>
          </div>
          <div style={{ background: '#FEF3C7', color: '#B45309', padding: '6px 10px', borderRadius: 8, fontWeight: 600, fontSize: 13 }}>
            +{dailyChallenge.xpReward} XP
          </div>
        </div>
        <button style={{
          marginTop: 12, width: '100%', padding: '10px', borderRadius: 10,
          border: '1px solid #F59E0B', background: 'transparent', color: '#B45309',
          fontWeight: 600, cursor: 'pointer'
        }}>
          પડકાર શરૂ કરો
        </button>
      </div>

      {/* Recent Achievements */}
      <h3 className="gujarati" style={{ fontSize: 16, marginBottom: 12 }}>તાજેતરના સિદ્ધિઓ</h3>
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8 }}>
        {unlockedAchievements.slice(0, 5).map(a => (
          <div key={a.id} className="card-elevated" style={{ minWidth: 110, padding: 12, textAlign: 'center', flexShrink: 0 }}>
            <div style={{ fontSize: 28 }}>{a.icon}</div>
            <div className="gujarati" style={{ fontSize: 12, fontWeight: 600, marginTop: 6 }}>{a.titleGu}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ChaptersScreen() {
  return (
    <div style={{ padding: '16px 16px 100px', maxWidth: 480, margin: '0 auto' }}>
      <h1 className="gujarati" style={{ fontSize: 24, marginBottom: 8 }}>પ્રકરણો</h1>
      <p style={{ color: 'var(--color-muted)', marginBottom: 20, fontSize: 14 }}>તમારી ગણિતની યાત્રા</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {chapters.map(ch => (
          <div
            key={ch.id}
            className="card-elevated"
            style={{
              padding: 16,
              opacity: ch.status === 'locked' ? 0.55 : 1,
              borderLeft: `4px solid ${ch.color}`,
              cursor: ch.status === 'locked' ? 'not-allowed' : 'pointer'
            }}
          >
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: ch.color + '18', display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: 22
              }}>
                {ch.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div className="gujarati" style={{ fontWeight: 600, fontSize: 16 }}>{ch.nameGu}</div>
                <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>{ch.world}</div>
                {ch.status !== 'locked' && (
                  <div style={{ marginTop: 8, height: 6, background: '#E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${ch.progress}%`, height: '100%', background: ch.color, borderRadius: 3, transition: 'width 0.5s ease' }} />
                  </div>
                )}
              </div>
              <div style={{ textAlign: 'right', fontSize: 13 }}>
                {ch.status === 'locked' ? '🔒' : `${ch.progress}%`}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function BottomNav({ active, setActive }: { active: Tab; setActive: (t: Tab) => void }) {
  const items: { id: Tab; label: string; icon: string }[] = [
    { id: 'home', label: 'હોમ', icon: '🏠' },
    { id: 'chapters', label: 'પ્રકરણ', icon: '📚' },
    { id: 'practice', label: 'પ્રેક્ટિસ', icon: '✏️' },
    { id: 'progress', label: 'પ્રગતિ', icon: '📊' },
    { id: 'profile', label: 'પ્રોફાઇલ', icon: '👤' },
  ]
  return (
    <nav className="safe-bottom" style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: 'white', borderTop: '1px solid #E2E8F0',
      display: 'flex', justifyContent: 'space-around',
      padding: '8px 0 10px', zIndex: 50, maxWidth: 480, margin: '0 auto'
    }}>
      {items.map(item => (
        <button
          key={item.id}
          onClick={() => setActive(item.id)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 2, padding: '6px 10px', minWidth: 56,
            color: active === item.id ? 'var(--color-indigo)' : 'var(--color-muted)',
            fontWeight: active === item.id ? 600 : 400
          }}
        >
          <span style={{ fontSize: 22 }}>{item.icon}</span>
          <span className="gujarati" style={{ fontSize: 11 }}>{item.label}</span>
        </button>
      ))}
    </nav>
  )
}

export default function App() {
  const [tab, setTab] = useState<Tab>('home')

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--color-canvas)' }}>
      {tab === 'home' && <HomeScreen onContinue={() => setTab('chapters')} />}
      {tab === 'chapters' && <ChaptersScreen />}
      {tab === 'practice' && (
        <div style={{ padding: 40, textAlign: 'center' }}>
          <h2 className="gujarati">પ્રેક્ટિસ ઇન્ટરફેસ</h2>
          <p style={{ color: 'var(--color-muted)' }}>Coming in next phase — question solving UI with rewarding feedback</p>
        </div>
      )}
      {tab === 'progress' && (
        <div style={{ padding: 40, textAlign: 'center' }}>
          <h2 className="gujarati">પ્રગતિ ડેશબોર્ડ</h2>
          <p style={{ color: 'var(--color-muted)' }}>Analytics, accuracy trends & revision topics</p>
        </div>
      )}
      {tab === 'profile' && (
        <div style={{ padding: 40, textAlign: 'center' }}>
          <h2 className="gujarati">પ્રોફાઇલ</h2>
          <p style={{ color: 'var(--color-muted)' }}>XP, achievements, settings & reduce-motion toggle</p>
        </div>
      )}
      <BottomNav active={tab} setActive={setTab} />
    </div>
  )
}
