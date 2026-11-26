import { COLLECTIONS, FILM, GALLERY, GALLERY_TEASER, MARQUEE, STORIES, TRAIL, ZOOM } from '../content';
import { Cta, Marquee } from '../components/Shared';

export default function Home() {
  return (
    <>
      {/* Loader: a counter, then the shutters lift onto the film (first visit only) */}
      <div className="loader" id="loader" aria-hidden="true">
        <p className="loader__brand">Effects Tech</p>
        <p className="loader__line">Wedding films &amp; photography — Malta</p>
        <p className="loader__count"><span id="loaderCount">0</span><em>%</em></p>
      </div>

      <main>
        {/* Hero: the film plays through the letters, then the camera falls through them into it */}
        <section className="hero" id="top">
          <div className="hero__stick">
            <video className="hero__video" id="heroVideo" src={FILM.src} poster={FILM.poster} muted loop playsInline autoPlay preload="auto" />
            <div className="hero__tint" />
            <div className="hero__dim" />
            {/* wine, with MALTA cut out of it (drawn by motion.ts) */}
            <canvas className="hero__mask" id="heroMask" aria-hidden="true" />
            <div className="hero__ui" id="heroUi">
              <p className="hero__kicker"><span>Wedding films</span><span>&amp; photography</span></p>
              <p className="hero__place">Valletta · Mdina · Gozo</p>
              <p className="hero__scroll"><span>Scroll</span> to step into the film</p>
            </div>
            <div className="hero__after" id="heroAfter">
              <h1 className="hero__title"><span className="line"><span>Your wedding,</span></span><span className="line"><em>as a film.</em></span></h1>
              <button className="play" type="button" data-play data-cursor="Play"><span className="play__ring" /><span className="play__text">Watch<br />the film</span></button>
            </div>
          </div>
        </section>

        <section className="band" aria-label="Places">
          <Marquee words={MARQUEE} />
          <Marquee words={['Photography', 'Film', 'Drone', 'Albums', 'Same-day edits', 'Destination weddings']} className="marquee--small" reverse />
        </section>

        {/* Manifesto */}
        <section className="manifesto">
          <p className="eyebrow">(Who we are)</p>
          <p className="manifesto__text" data-blur>
            We don’t just take pictures at weddings. We make the film you will watch on every anniversary, and the photographs
            your grandchildren will ask about. <em>Malta does the rest.</em>
          </p>
          <div className="manifesto__stats">
            <p><strong>Photo <em>&amp;</em> film</strong><span>one team, start to finish</span></p>
            <p><strong>∞</strong><span>replays of your first dance</span></p>
            <p><strong>Malta</strong><span>the island we know by heart</span></p>
          </div>
        </section>

        {/* The film, growing to fill the screen */}
        <section className="reel" id="film">
          <div className="reel__stick">
            <p className="reel__side reel__side--l" id="reelL">The</p>
            <div className="reel__card" id="reelCard" data-cursor="Play" data-play>
              <video id="reelVideo" src={FILM.src} poster="assets/img/still-embrace.jpg" muted loop playsInline preload="metadata" />
            </div>
            <p className="reel__side reel__side--r" id="reelR"><em>film</em></p>
            <p className="reel__note">A Malta wedding, in three minutes</p>
          </div>
        </section>

        {/* Love stories: cards that stack as you scroll */}
        <section className="stories" id="stories">
          <div className="stories__head">
            <p className="eyebrow">(Love stories)</p>
            <h2 className="h2" data-split>Weddings we <em>filmed</em></h2>
          </div>
          {STORIES.map((s, i) => (
            <article className="story" key={s.n} style={{ ['--i' as string]: i }}>
              <div className="story__inner">
                <div className="story__media"><img src={s.src} alt={s.title} loading="lazy" /></div>
                <div className="story__body">
                  <p className="story__n">{s.n} / 0{STORIES.length}</p>
                  <h3 className="story__title">{s.title}</h3>
                  <p className="story__place">{s.place}</p>
                  <p className="story__text">{s.text}</p>
                  <ul className="story__tags">{s.tags.map((t) => <li key={t}>{t}</li>)}</ul>
                  <img className="story__side" src={s.side} alt="" loading="lazy" />
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* Image trail */}
        <section className="trail" id="trail" data-cursor-hide>
          <div className="trail__imgs" id="trailImgs">{TRAIL.map((src) => <img key={src} src={src} alt="" loading="lazy" />)}</div>
          <p className="trail__kicker">(Move your cursor)</p>
          <h2 className="trail__title" data-split>Every frame,<br /><em>a memory</em></h2>
        </section>

        {/* Zoom gallery */}
        <section className="zoom" id="zoom">
          <div className="zoom__stick">
            {ZOOM.map((src, i) => <div className={`zoom__el zoom__el--${i}`} key={src}><div className="zoom__img"><img src={src} alt="" loading="lazy" /></div></div>)}
          </div>
        </section>

        {/* A look into the gallery page */}
        <section className="teaser">
          <div className="teaser__head">
            <p className="eyebrow">(Gallery)</p>
            <h2 className="h2" data-split>{GALLERY.length} <em>photographs</em></h2>
          </div>
          <a className="teaser__row" href="gallery.html" data-page-link data-cursor="Open">
            {GALLERY_TEASER.map((src, i) => <span className={`teaser__pic teaser__pic--${i}`} key={src}><img src={src} alt="" loading="lazy" /></span>)}
          </a>
          <a className="teaser__link" href="gallery.html" data-page-link>Open the full gallery <span aria-hidden="true">→</span></a>
        </section>

        {/* Collections */}
        <section className="collections" id="collections">
          <div className="collections__head">
            <p className="eyebrow">(Collections)</p>
            <h2 className="h2" data-split>Choose how you<br /><em>remember it</em></h2>
          </div>
          <ul className="collections__list">
            {COLLECTIONS.map((c, i) => (
              <li className="col" key={c.name} data-img={c.src}>
                <div className="col__row">
                  <span className="col__n">0{i + 1}</span>
                  <h3 className="col__name">{c.name}</h3>
                  <p className="col__line">{c.line}</p>
                  <span className="col__plus" aria-hidden="true" />
                </div>
                <div className="col__more"><div>
                  <ul>{c.items.map((it) => <li key={it}>{it}</li>)}</ul>
                  <a className="link" href={`book.html?collection=${c.name}`} data-page-link>Ask about {c.name}</a>
                </div></div>
              </li>
            ))}
          </ul>
          <div className="collections__float" id="colFloat" aria-hidden="true"><img alt="" /></div>
        </section>

        <Cta />
      </main>

      {/* The film, with sound */}
      <div className="player" id="player" role="dialog" aria-modal="true" aria-label="Wedding film" hidden>
        <button className="player__close" type="button" id="playerClose">Close</button>
        <video id="playerVideo" src={FILM.src} poster={FILM.poster} controls playsInline preload="none" />
      </div>
    </>
  );
}
