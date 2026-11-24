import { GALLERY, GALLERY_FILTERS } from '../content';
import { Cta } from '../components/Shared';

export default function Gallery() {
  const strip = GALLERY.slice(0, 12);
  return (
    <>
      <main id="top">
        {/* Page heading */}
        <section className="ghero">
          <p className="eyebrow">(Gallery — {GALLERY.length} photographs)</p>
          <h1 className="ghero__title" data-split>The <em>photographs</em></h1>
          <p className="ghero__intro">Ceremonies on the bastions, portraits at golden hour, receptions in baroque salons. A few of the moments we have kept for couples in Malta.</p>
          <a className="ghero__down" href="#wall" aria-label="Go to the photographs">↓</a>
        </section>

        {/* A strip of photographs, drifting with the scroll */}
        <div className="gstrip" data-marquee="1" aria-hidden="true">
          <div className="marquee__track">
            {[0, 1, 2].map((k) => (
              <span className="marquee__set" key={k}>
                {strip.map((p) => <span className="gstrip__pic" key={p.src}><img src={p.src} alt="" loading="lazy" /></span>)}
              </span>
            ))}
          </div>
        </div>

        {/* The wall */}
        <section className="gallery" id="wall">
          <div className="gallery__head">
            <p className="eyebrow">(Filter by moment)</p>
            <div className="gallery__filters" role="tablist" aria-label="Filter photographs">
              {GALLERY_FILTERS.map((f, i) => (
                <button key={f} type="button" role="tab" className={`chip${i === 0 ? ' is-on' : ''}`} aria-selected={i === 0} data-filter={f}>
                  {f}<sup>{f === 'All' ? GALLERY.length : GALLERY.filter((p) => p.cat === f).length}</sup>
                </button>
              ))}
            </div>
          </div>
          <ul className="gallery__grid" id="galleryGrid">
            {GALLERY.map((p, i) => (
              <li className="gallery__item" key={p.src} data-cat={p.cat}>
                <button type="button" className="gallery__btn" data-gallery={i} data-cursor="View" aria-label={`View: ${p.alt}`}>
                  <img src={p.src} alt={p.alt} loading="lazy" decoding="async" />
                  <span className="gallery__cap"><em>{p.cat}</em><span>{String(i + 1).padStart(2, '0')}</span></span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <Cta />
      </main>

      {/* Photograph viewer */}
      <div className="viewer" id="viewer" role="dialog" aria-modal="true" aria-label="Photograph" hidden>
        <button className="viewer__close" type="button" id="viewerClose">Close</button>
        <figure className="viewer__fig"><img id="viewerImg" alt="" /></figure>
        <p className="viewer__cap"><em id="viewerCat"></em><span id="viewerAlt"></span><span id="viewerCount"></span></p>
        <button className="viewer__nav viewer__nav--prev" type="button" id="viewerPrev" aria-label="Previous photograph">←</button>
        <button className="viewer__nav viewer__nav--next" type="button" id="viewerNext" aria-label="Next photograph">→</button>
      </div>
    </>
  );
}
