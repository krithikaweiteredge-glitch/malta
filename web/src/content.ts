/* Every word, photograph and film on the page. Edit here; the layout follows. */
const img = (f: string) => `assets/img/${f}.jpg`;

/** Where enquiries go. Placeholder: replace with the studio's real address. */
export const ENQUIRY_EMAIL = 'hello@effectstech.example';

export const FILM = { src: 'assets/video/malta-wedding-film.mp4', poster: img('still-portrait'), loopFrom: 32 };

export const MARQUEE = ['Valletta', 'Mdina', 'Gozo', 'The Grand Harbour', 'Golden hour', 'First dance', 'Palazzo Parisio', 'The bastions'];

/* Love stories: stacked cards. Couples' names are left out until the studio confirms what may be published;
   the descriptions are placeholder copy to be checked against the real weddings. */
export const STORIES = [
  {
    n: '01', title: 'The Grand Harbour wedding', place: 'Valletta', tags: ['Baraat', 'Bastions'],
    text: 'A procession through the old city, the harbour behind every frame, and a family that danced from the first beat.',
    src: img('still-baraat'), side: img('p07_003'),
  },
  {
    n: '02', title: 'Pheras by the sea', place: 'A seafront terrace', tags: ['Ceremony', 'Golden hour'],
    text: 'Seven rounds of the fire as the sun went down over the Mediterranean, with every grandparent in the front row.',
    src: img('still-pheras'), side: img('p27_021'),
  },
  {
    n: '03', title: 'Wonderland at Palazzo Parisio', place: 'Naxxar', tags: ['Reception', 'Baroque salons'],
    text: 'Living statues, gilded mirrors and a garden lit for one night only. A reception that felt like a film set.',
    src: img('p46_038'), side: img('p50_041'),
  },
  {
    n: '04', title: 'The last dance', place: 'After midnight', tags: ['Sangeet', 'Party'],
    text: 'When the speeches end and the music starts, we stop directing and just keep the camera rolling.',
    src: img('still-dance'), side: img('p41_033'),
  },
];

/* The image trail: photographs left behind by the cursor. */
export const TRAIL = ['still-embrace', 'p34_028', 'still-bride', 'p26_020', 'still-portrait', 'p48_039', 'still-guests', 'p15_010', 'p33_027', 'still-pheras', 'p13_008', 'p39_031'].map(img);

/* The zoom gallery: the middle one fills the screen as the others fall away. */
export const ZOOM = [img('still-embrace'), img('p07_003'), img('p34_028'), img('still-bride'), img('p46_038'), img('p26_020'), img('still-music')];

/* The three collections from the Effects Tech brief. Inclusions are placeholders to confirm. */
export const COLLECTIONS = [
  { name: 'Silver', line: 'The wedding day, beautifully kept.', items: ['Photography of the wedding day', 'An edited online gallery', 'A three-minute highlight film'], src: img('still-portrait') },
  { name: 'Gold', line: 'The whole celebration, in photographs and film.', items: ['Two days of coverage', 'Photography and film team', 'Highlight film and full gallery', 'A printed album'], src: img('still-embrace') },
  { name: 'Platinum', line: 'Every moment, arrival to farewell.', items: ['Every event of the celebration', 'Full photography and film team', 'A documentary-length film', 'Heirloom albums for the families'], src: img('still-aerial') },
];

/* The gallery: every photograph, with the filter it belongs to. */
export const GALLERY_FILTERS = ['All', 'Ceremony', 'Celebration', 'Portraits', 'Venues'] as const;
type Cat = Exclude<(typeof GALLERY_FILTERS)[number], 'All'>;
const g = (f: string, cat: Cat, alt: string) => ({ src: img(f), cat, alt });
export const GALLERY = [
  g('still-embrace', 'Portraits', 'The couple embrace under a floral arch'),
  g('p10_006', 'Ceremony', 'Guests line the aisle as the bride arrives'),
  g('p07_003', 'Celebration', 'A floral stage on the bastions above the Grand Harbour'),
  g('p34_028', 'Portraits', 'A couple beside a golden-lit baroque façade'),
  g('still-pheras', 'Ceremony', 'The pheras, surrounded by family'),
  g('p46_038', 'Celebration', 'Living statues in the gilded salon of Palazzo Parisio'),
  g('p05_001', 'Venues', 'Valletta and the Grand Harbour from the air'),
  g('still-bride', 'Portraits', 'The bride laughing with her guests'),
  g('p26_020', 'Ceremony', 'Floral mandaps lit beneath a full moon'),
  g('p41_033', 'Celebration', 'Guests in lehengas dancing under amber lights'),
  g('p15_010', 'Venues', 'A seafront amphitheatre dressed in pink at sunset'),
  g('still-portrait', 'Portraits', 'The couple at night, the harbour lights behind them'),
  g('p27_021', 'Ceremony', 'White floral mandaps on a seafront pool terrace'),
  g('p48_039', 'Celebration', 'A feathered masquerade mask among red roses'),
  g('p50_041', 'Venues', 'Guests in the gilded baroque salon of Palazzo Parisio'),
  g('still-baraat', 'Ceremony', 'The baraat through the old city'),
  g('p33_027', 'Portraits', 'Friends in festive dress pose at night'),
  g('p39_031', 'Celebration', 'A ceremonial cannon fires over the Grand Harbour'),
  g('p12_007', 'Venues', 'Dining tables on a terrace opposite the Three Cities'),
  g('p13_008', 'Ceremony', 'Coral florals on a sunlit terrace'),
  g('still-dance', 'Celebration', 'The dance floor at the sangeet'),
  g('p52_043', 'Venues', 'A candlelit vaulted hall in amber'),
  g('p31_025', 'Portraits', 'A performer in white before a rose-lit limestone wall'),
  g('p43_035', 'Celebration', 'An orchestra plays to a candlelit ballroom'),
  g('p53_044', 'Venues', 'The harbour towns lighting up at dusk'),
  g('p17_011', 'Ceremony', 'Tall magenta florals beneath palms'),
  g('still-guests', 'Celebration', 'Guests in white in a limestone garden'),
  g('p20_014', 'Venues', 'A garden inside the old fortifications'),
  g('p32_026', 'Celebration', 'Musicians in top hats play by the fortress'),
  g('p24_018', 'Celebration', 'A pink-lit lounge with chandeliers and velvet seating'),
  g('still-aerial', 'Venues', 'A reception on the bastions, seen from above'),
  g('p21_015', 'Venues', 'Topiary figures in a limestone garden'),
];

/* About us: taken from effectstech.in/about (lightly proofread). */
export const ABOUT = {
  motto: 'Think events, think Effects Tech.',
  story: [
    'With over 18 years of experience in providing turnkey solutions for events, Effects Tech is India’s leading events production house with a pool of talented professionals and an expansive infrastructure, best equipped to take on events and exhibitions of any magnitude. Led by some of the best in the business, Effects Tech has you covered with expert teams of sound, light and video professionals at your disposal.',
    'Whether it’s fabrication, sound and light design or trussing, we’ve got you covered. Our roster of events includes corporate conferences, fashion shows, brand launches, themed events, live shows, road shows and promotional activities for a variety of event management companies and top corporate houses.',
  ],
  stats: [{ value: '18+', label: 'years of experience' }, { value: '1000', label: 'projects' }, { value: '150', label: 'names who trust us' }],
  founder: 'Sarosh started out twenty-five years ago with an event production company and morphed into set designing whilst handling bigger and bigger projects. It was a fait accompli for Patel’s event production company, Effects Tech, which was fluidly led into designing because of last-minute changes like location or requirements, or the designer not being too happy with the design as it was. This forced the company to always look at creative ways to improve or correct on the spot. Over a period of time the company also started basic designing for returning patrons, and before they knew it, voila, they were doing it all the time.',
};

/* Social links in the footer. Add each address when the studio confirms it; without one the name shows as plain text. */
export const SOCIAL = [
  { name: 'Instagram', url: '' },
  { name: 'YouTube', url: '' },
  { name: 'Facebook', url: '' },
];

/* The gallery teaser on the home page, and the moving strip at the top of the gallery page. */
export const GALLERY_TEASER = ['still-bride', 'p46_038', 'still-portrait', 'p26_020', 'p33_027'].map(img);
