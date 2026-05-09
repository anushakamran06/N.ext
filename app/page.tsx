export default function Home() {
  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)' }}>

      {/* ── Nav ───────────────────────────────────────────────────────── */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 40px', borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, background: 'rgba(10,10,10,0.92)',
        backdropFilter: 'blur(8px)', zIndex: 100,
      }}>
        <span style={{ fontWeight: 800, fontSize: 20, letterSpacing: '-0.5px' }}>
          N<span style={{ color: 'var(--nus-blue-light)' }}>.</span>ext
        </span>
        <a
          href="#install"
          style={{
            background: 'var(--nus-blue)', color: '#fff', padding: '8px 18px',
            borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none',
          }}
        >
          Install free
        </a>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', padding: '96px 24px 80px',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{
          display: 'inline-block', background: 'rgba(0,87,176,0.12)',
          border: '1px solid rgba(0,87,176,0.3)', color: 'var(--nus-blue-light)',
          padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
          letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 28,
        }}>
          Chrome Extension · Free · No login
        </div>

        <h1 style={{
          fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 800,
          lineHeight: 1.1, letterSpacing: '-1.5px', maxWidth: 720,
          marginBottom: 24,
        }}>
          You won&apos;t miss another<br />
          <span style={{ color: 'var(--nus-blue-light)' }}>opportunity at NUS.</span>
        </h1>

        <p style={{
          fontSize: 18, color: 'var(--text-muted)', maxWidth: 520,
          lineHeight: 1.65, marginBottom: 40,
        }}>
          Canvas deadlines, TalentConnect internships, NUS scholarships, Reddit posts,
          and hackathons — all in one notification feed, deduplicated and smart.
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <a
            id="install"
            href="https://chrome.google.com/webstore"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: 'var(--nus-blue)', color: '#fff',
              padding: '14px 28px', borderRadius: 10, fontSize: 15,
              fontWeight: 700, textDecoration: 'none', letterSpacing: '-0.2px',
            }}
          >
            Add to Chrome — it&apos;s free
          </a>
          <a
            href="https://github.com/anushakamran06/n.ext"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: 'var(--surface)', color: 'var(--text)',
              padding: '14px 28px', borderRadius: 10, fontSize: 15,
              fontWeight: 600, textDecoration: 'none',
              border: '1px solid var(--border)',
            }}
          >
            View on GitHub
          </a>
        </div>

        {/* Preview pill */}
        <div style={{
          marginTop: 60, background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 12, padding: '16px 20px', maxWidth: 400, width: '100%',
          textAlign: 'left',
        }}>
          {[
            { source: 'TalentConnect', title: 'Software Engineer Intern — Google', deadline: '31 May 2025', color: 'var(--nus-blue)' },
            { source: 'Reddit r/NUS', title: 'ASEAN Scholarship 2025 applications open', deadline: null, color: '#5865f2' },
            { source: 'Canvas', title: '[Due] CS3230 Assignment 3', deadline: '28 May 2025', color: '#2d7d46' },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', flexDirection: 'column', gap: 4,
              padding: '10px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  background: item.color, color: '#fff', fontSize: 10,
                  fontWeight: 700, padding: '2px 6px', borderRadius: 4,
                  textTransform: 'uppercase', letterSpacing: 0.4, whiteSpace: 'nowrap',
                }}>
                  {item.source}
                </span>
                <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)' }}>{item.title}</span>
              </div>
              {item.deadline && (
                <span style={{ fontSize: 11, color: '#e8a317', paddingLeft: 0 }}>⏰ {item.deadline}</span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── What it monitors ──────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.8px', marginBottom: 8, textAlign: 'center' }}>
            What it monitors
          </h2>
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: 48, fontSize: 15 }}>
            Six sources. One feed. No noise.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 16,
          }}>
            {[
              {
                icon: '📚',
                title: 'Canvas LMS',
                desc: 'Announcements, upcoming deadlines, and unread notification counts — scraped when you visit.',
              },
              {
                icon: '💼',
                title: 'TalentConnect',
                desc: 'Internship and full-time listings from nus-csm.symplicity.com, with role, company, and deadline.',
              },
              {
                icon: '🏆',
                title: 'NUS Scholarships',
                desc: 'New scholarship listings from scholarships.nus.edu.sg, checked every 12 hours.',
              },
              {
                icon: '📰',
                title: 'NUS News',
                desc: 'Official university announcements from news.nus.edu.sg, polled every 6 hours.',
              },
              {
                icon: '🔴',
                title: 'Reddit r/NUS',
                desc: 'Posts mentioning internship, scholarship, bursary, SEP, exchange, or application deadlines.',
              },
              {
                icon: '⚡',
                title: 'Devpost Hackathons',
                desc: 'Singapore-tagged open hackathons, so you never miss a weekend project opportunity.',
              },
            ].map((item) => (
              <div key={item.title} style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 12, padding: '24px',
              }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{item.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.8px', marginBottom: 8 }}>
            How it works
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 56, fontSize: 15 }}>Three steps, no setup required.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              {
                step: '01',
                title: 'Install & pick your preset',
                desc: 'Choose Freshman, Internship Hunter, or Scholarship Focused. N.ext activates the right sources for you instantly.',
              },
              {
                step: '02',
                title: 'Browse normally',
                desc: 'The extension runs quietly in the background. When you visit Canvas or TalentConnect, it scrapes new items automatically. Public sources are polled every 6 hours.',
              },
              {
                step: '03',
                title: 'Get notified — only for new things',
                desc: 'Each item is fingerprinted. You\'ll never see the same alert twice. Dismiss items, or click "Don\'t show like this" to suppress similar ones permanently.',
              },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', gap: 24, textAlign: 'left',
                padding: '32px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none',
                alignItems: 'flex-start',
              }}>
                <span style={{
                  fontWeight: 800, fontSize: 13, color: 'var(--nus-blue-light)',
                  letterSpacing: 1, flexShrink: 0, marginTop: 2, minWidth: 28,
                }}>
                  {item.step}
                </span>
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{item.title}</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.65 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Install CTA ───────────────────────────────────────────────── */}
      <section style={{ padding: '96px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-1px', marginBottom: 16 }}>
          Ready to stop missing out?
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 16, marginBottom: 36, maxWidth: 400, margin: '0 auto 36px' }}>
          Free forever. No account needed. Works with your existing NUS login on each site.
        </p>
        <a
          href="https://chrome.google.com/webstore"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block', background: 'var(--nus-blue)', color: '#fff',
            padding: '16px 36px', borderRadius: 10, fontSize: 16,
            fontWeight: 700, textDecoration: 'none', letterSpacing: '-0.3px',
          }}
        >
          Add to Chrome — it&apos;s free
        </a>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer style={{
        borderTop: '1px solid var(--border)', padding: '24px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12,
      }}>
        <span style={{ fontWeight: 700, fontSize: 15 }}>
          N<span style={{ color: 'var(--nus-blue-light)' }}>.</span>ext
        </span>
        <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>
          Built for NUS students · Open source ·{' '}
          <a
            href="https://github.com/anushakamran06/n.ext"
            style={{ color: 'var(--text-muted)', textDecoration: 'underline' }}
            target="_blank" rel="noopener noreferrer"
          >
            GitHub
          </a>
        </span>
      </footer>

    </main>
  );
}
