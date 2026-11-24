// The parts every page shares: the cursor, the shutters (page changes), the nav, the call to action, the footer
// and the enquiry drawer.
import { COLLECTIONS, ENQUIRY_EMAIL, SOCIAL } from '../content';

export type Page = 'home' | 'gallery';

const YEAR = new Date().getFullYear();

/* Links that leave this page go through the shutters (data-page-link); links within it scroll smoothly. */
const homeLink = (page: Page, hash: string) => (page === 'home' ? hash : `./${hash}`);

export const Marquee = ({ words, className = '', reverse = false }: { words: string[]; className?: string; reverse?: boolean }) => (
  <div className={`marquee ${className}`} data-marquee={reverse ? -1 : 1}>
    <div className="marquee__track">
      {[0, 1, 2].map((k) => (
        <span className="marquee__set" key={k} aria-hidden={k > 0}>
          {words.map((w) => <span className="marquee__item" key={w}>{w}<i>✦</i></span>)}
        </span>
      ))}
    </div>
  </div>
);

export const Chrome = () => (
  <>
    <div className="shutters" id="shutters" aria-hidden="true">{[0, 1, 2, 3, 4, 5].map((i) => <span key={i} />)}</div>
    <div className="cursor" id="cursor" aria-hidden="true"><span id="cursorLabel"></span></div>
  </>
);

export const Nav = ({ page }: { page: Page }) => {
  const pageLink = page === 'home' ? {} : { 'data-page-link': '' };
  return (
    <header className="nav" id="nav">
      <a className="nav__logo" href={page === 'home' ? '#top' : './'} {...pageLink}>Effects Tech<sup>Malta</sup></a>
      <nav className="nav__links" aria-label="Pages">
        <a href={homeLink(page, '#film')} {...pageLink}>The film</a>
        <a href={homeLink(page, '#stories')} {...pageLink}>Stories</a>
        <a href="gallery.html" className={page === 'gallery' ? 'is-current' : ''} aria-current={page === 'gallery' ? 'page' : undefined} {...(page === 'gallery' ? {} : { 'data-page-link': '' })}>Gallery</a>
        <a href={homeLink(page, '#collections')} {...pageLink}>Collections</a>
      </nav>
      <button className="nav__book" type="button" data-open-drawer>Book your date</button>
    </header>
  );
};

export const Cta = () => (
  <section className="cta">
    <p className="eyebrow">(Now booking weddings in Malta)</p>
    <h2 className="cta__title" data-split>Let’s make<br /><em>your</em> film</h2>
    <button className="magnet" type="button" data-open-drawer data-magnet><span>Book your date</span></button>
  </section>
);

export const Footer = ({ page }: { page: Page }) => {
  const away = page === 'home' ? {} : { 'data-page-link': '' };
  return (
    <footer className="footer">
      <div className="footer__grid">
        <div className="footer__brand">
          <p className="footer__logo">Effects Tech<em>.</em></p>
          <p className="footer__about">Wedding films and photography for destination weddings in Malta: Valletta, Mdina, Gozo and the coast between.</p>
          <button type="button" className="footer__book" data-open-drawer>Start your enquiry <span aria-hidden="true">→</span></button>
        </div>
        <nav className="footer__col" aria-label="Explore">
          <h3>Explore</h3>
          <a href={page === 'home' ? '#top' : './'} {...away}>Home</a>
          <a href={homeLink(page, '#film')} {...away}>The film</a>
          <a href={homeLink(page, '#stories')} {...away}>Love stories</a>
          <a href="gallery.html" {...(page === 'gallery' ? {} : { 'data-page-link': '' })}>Gallery</a>
          <a href={homeLink(page, '#collections')} {...away}>Collections</a>
        </nav>
        <div className="footer__col">
          <h3>Contact</h3>
          <a href={`mailto:${ENQUIRY_EMAIL}`}>{ENQUIRY_EMAIL}</a>
          <p>Malta, Europe</p>
          <p>Silver · Gold · Platinum</p>
        </div>
        <div className="footer__col">
          <h3>Follow</h3>
          {SOCIAL.map((s) => (s.url ? <a key={s.name} href={s.url} target="_blank" rel="noreferrer">{s.name} ↗</a> : <span key={s.name} className="footer__soon">{s.name}</span>))}
        </div>
      </div>
      <Marquee words={['Effects Tech', 'Malta', 'Wedding films', 'Photography']} className="marquee--huge" />
      <div className="footer__bottom">
        <p>© {YEAR} Effects Tech. All rights reserved.</p>
        <p>Destination Weddings &amp; Celebrations</p>
        <a href="#top" data-to-top>Back to the top ↑</a>
      </div>
    </footer>
  );
};

export const Drawer = () => (
  <div className="drawer" id="drawer" role="dialog" aria-modal="true" aria-labelledby="drawerTitle" hidden>
    <div className="drawer__veil" data-close-drawer />
    <div className="drawer__panel">
      <button className="drawer__close" type="button" data-close-drawer>Close</button>
      <p className="eyebrow">(Enquire)</p>
      <h2 className="drawer__title" id="drawerTitle">Tell us about <em>your day</em></h2>
      <form className="form" id="enquireForm" data-email={ENQUIRY_EMAIL}>
        <label><span>Your names</span><input name="names" required autoComplete="name" /></label>
        <label><span>Email</span><input name="email" type="email" required autoComplete="email" /></label>
        <label><span>Wedding date</span><input name="date" placeholder="Or the season you have in mind" /></label>
        <label><span>Guests</span>
          <select name="guests" defaultValue=""><option value="" disabled>Choose</option><option>Up to 50</option><option>50 – 150</option><option>150 – 300</option><option>300 +</option></select>
        </label>
        <label className="form__wide"><span>Venue or area</span><input name="venue" placeholder="Valletta, a palazzo, by the sea…" /></label>
        <label className="form__wide"><span>Collection</span>
          <select name="collection" defaultValue=""><option value="">Not sure yet</option>{COLLECTIONS.map((c) => <option key={c.name}>{c.name}</option>)}</select>
        </label>
        <label className="form__wide"><span>Your story</span><textarea name="message" rows={3} placeholder="How you met, what you dream of…" /></label>
        <button className="form__send" type="submit"><span>Send enquiry</span></button>
        <p className="form__done" id="formDone" hidden>Thank you. Your email app has opened with your enquiry ready to send.</p>
      </form>
    </div>
  </div>
);
