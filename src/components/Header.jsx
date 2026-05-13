import Link from "next/link";

export default function Header() {
  return (
    <header className="site-header" style={{padding: '20px 24px', borderBottom: '1px solid rgba(0,0,0,0.06)'}}>
      <div style={{maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <Link href="/">
          <a style={{color: 'var(--foreground)', textDecoration: 'none', fontWeight: 700, fontSize: 18}}>Missing Piece Invites</a>
        </Link>
        <nav style={{display: 'flex', gap: 16}}>
          <a href="#our-story" style={{color: 'var(--foreground)', textDecoration: 'none'}}>Our Story</a>
          <a href="#rsvp" style={{color: 'var(--foreground)', textDecoration: 'none'}}>RSVP</a>
        </nav>
      </div>
    </header>
  );
}
