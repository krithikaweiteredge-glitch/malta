import { COLLECTIONS, ENQUIRY_EMAIL } from '../content';

export default function Book() {
  return (
    <main className="book" id="top">
      <section className="book__intro">
        <p className="eyebrow">(Enquire)</p>
        <h1 className="book__title" data-split>Tell us about <em>your day</em></h1>
        <p className="book__lead">A few details are enough. We will come back to you about your date.</p>
        <p className="book__mail">Prefer to write? <a className="link" href={`mailto:${ENQUIRY_EMAIL}`}>{ENQUIRY_EMAIL}</a></p>
        <img className="book__photo" src="assets/img/still-embrace.jpg" alt="The couple embrace under a floral arch" />
      </section>

      <section className="book__panel" aria-label="Enquiry form">
        <form className="form" id="enquireForm" data-email={ENQUIRY_EMAIL}>
          <label><span>Your names</span><input name="names" required autoComplete="name" /></label>
          <label><span>Email</span><input name="email" type="email" required autoComplete="email" /></label>
          <label><span>Wedding date</span><input name="date" placeholder="Date or season" /></label>
          <label><span>Guests</span>
            <select name="guests" defaultValue=""><option value="">Not sure yet</option><option>Up to 50</option><option>50 – 150</option><option>150 – 300</option><option>300 +</option></select>
          </label>
          <label className="form__wide"><span>Venue or area</span><input name="venue" placeholder="Valletta, a palazzo, by the sea…" /></label>
          <label className="form__wide"><span>Collection</span>
            <select name="collection" defaultValue=""><option value="">Not sure yet</option>{COLLECTIONS.map((c) => <option key={c.name}>{c.name}</option>)}</select>
          </label>
          <label className="form__wide"><span>Your story</span><textarea name="message" rows={4} placeholder="How you met, what you dream of…" /></label>
          <button className="form__send" type="submit">Send enquiry</button>
          <p className="form__done" id="formDone" role="status" hidden>Thank you. Your email app should open with your enquiry ready to send.</p>
        </form>
      </section>
    </main>
  );
}
