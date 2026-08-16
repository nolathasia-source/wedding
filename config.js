/* ============================================================
   WEDDING CONFIG
   Edit ONLY this file to update your wedding details.
   Every value here automatically updates the whole website.
   ============================================================ */

const WEDDING_CONFIG = {

  // ---- Couple ----
  groomName: "Theofil Tri Saputra Sibarani, S.Kom.",
  brideName: "Nola Thasia Rehulina, S.IP.",
  groomFather: "Bapak Musda Sibarani",
  groomMother: "Ibu Leriani boru Simamora",
  brideFather: "Bapak Frengky Nainggolan",
  brideMother: "Ibu Embun boru Hutabarat",

  // ---- Date & Time ----
  // Use 24h format, ISO-like: "YYYY-MM-DDTHH:MM:SS" (this is the time the
  // countdown counts down to — usually the Akad / ceremony start time)
  weddingDateTimeISO: "2026-06-20T09:00:00",
  weddingDateLong: "Sabtu, 20 Juni 2026",   // shown on the cover
  timezone: "Asia/Jakarta",                  // used in the .ics/calendar description only

  // ---- Akad / Pemberkatan ----
  akadDateTime: "Sabtu, 20 Juni 2026 · 09:00 WIB",
  akadStartISO: "2026-06-20T09:00:00",
  akadEndISO: "2026-06-20T10:30:00",
  venueName: "Gereja XXX, Jakarta",

  // ---- Resepsi ----
  resepsiDateTime: "Sabtu, 20 Juni 2026 · 12:00 – 15:00 WIB",
  resepsiStartISO: "2026-06-20T12:00:00",
  resepsiEndISO: "2026-06-20T15:00:00",
  venueName2: "Grand Ballroom XXX, Jakarta",

  // ---- Venue (used in map + calendar description) ----
  venueFull: "Grand Ballroom XXX Hotel",
  venueAddress: "Jl. Alamat Lengkap No. XX, Jakarta, Indonesia",
  // Easiest: open Google Maps, right-click the exact pin, copy coordinates.
  venueMapsQuery: "Grand Ballroom XXX Hotel Jakarta", // fallback text search
  venueLat: null,   // e.g. -6.200000  (optional — more accurate than text search)
  venueLng: null,   // e.g. 106.816666

  // ---- Gift ----
  bankInfo: "BCA · 1234567890",
  bankAccountNumberOnly: "1234567890", // used by the "copy" button
  bankHolder: "a.n. Diman Sitompul",
  giftAddress: "Jl. Alamat Pengiriman No. XX, Jakarta, Indonesia",

  // ---- Integrations ----
  // Paste the Web App URL you get after deploying apps-script/Code.gs
  // (see README.md → "Connect Google Sheets"). Leave empty during local
  // preview — the RSVP form + wishes list will show a friendly notice.
  appsScriptUrl: "",

  // ---- Guest name from URL ----
  // Sharing a link like yoursite.com/?to=Budi%20Santoso shows a
  // personalized "Kepada: Budi Santoso" on the opening gate.
};
