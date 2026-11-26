import { Cta } from '../components/Shared';
import { ABOUT } from '../content';

export default function About() {
  return (
    <main id="top">
      <section className="ghero ghero--short">
        <p className="eyebrow">(About us)</p>
        <h1 className="ghero__title" data-split>We build the best <em>experiences</em></h1>
        <p className="ghero__intro">{ABOUT.motto}</p>
      </section>

      <section className="about">
        <p className="eyebrow">(Effects Tech)</p>
        <div className="about__text">{ABOUT.story.map((p) => <p key={p}>{p}</p>)}</div>
        <div className="about__stats">
          {ABOUT.stats.map((s) => <p key={s.label}><strong>{s.value}</strong><span>{s.label}</span></p>)}
        </div>
      </section>

      <section className="about">
        <div className="about__side">
          <p className="eyebrow">(Meet the founder)</p>
          <img className="about__portrait" src="assets/img/sarosh-patel.png" alt="Sarosh Patel, founder of Effects Tech" width={400} height={400} loading="lazy" />
        </div>
        <div className="about__text">
          <h2 className="h2">Sarosh <em>Patel</em></h2>
          <p>{ABOUT.founder}</p>
        </div>
      </section>

      <Cta />
    </main>
  );
}
