/* ============================================================
   WEDDING INVITATION — behavior
   Reads everything from WEDDING_CONFIG (config.js). You should
   not need to edit this file to update wedding details.
   ============================================================ */

(function () {
  "use strict";

  const cfg = window.WEDDING_CONFIG || {};

  /* ---------- 1. inject config text into [data-field] elements ---------- */
  document.querySelectorAll("[data-field]").forEach((el) => {
    const key = el.getAttribute("data-field");
    if (cfg[key]) el.textContent = cfg[key];
  });

  /* ---------- 2. guest name from ?to= query param ---------- */
  const params = new URLSearchParams(window.location.search);
  const guestName = params.get("to");
  if (guestName) {
    const el = document.getElementById("gate-guest-name");
    if (el) el.textContent = decodeURIComponent(guestName);
  }

  /* ---------- 3. gate open + start music + reveal animations ---------- */
  const gate = document.getElementById("gate");
  const openBtn = document.getElementById("open-invitation");
  const content = document.getElementById("content");
  const music = document.getElementById("bg-music");
  const musicToggle = document.getElementById("music-toggle");

  openBtn?.addEventListener("click", () => {
    gate.classList.add("hidden");
    content.removeAttribute("aria-hidden");
    document.body.style.overflow = "auto";
    music?.play().then(() => {
      musicToggle?.classList.add("playing");
      musicToggle?.setAttribute("aria-pressed", "true");
    }).catch(() => { /* autoplay blocked — user can tap the music button */ });
  });

  musicToggle?.addEventListener("click", () => {
    if (!music) return;
    if (music.paused) {
      music.play();
      musicToggle.classList.add("playing");
      musicToggle.setAttribute("aria-pressed", "true");
    } else {
      music.pause();
      musicToggle.classList.remove("playing");
      musicToggle.setAttribute("aria-pressed", "false");
    }
  });

  /* scroll-reveal */
  const revealEls = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => io.observe(el));

  /* ---------- 4. countdown ---------- */
  const cdDays = document.getElementById("cd-days");
  const cdHours = document.getElementById("cd-hours");
  const cdMins = document.getElementById("cd-mins");
  const cdSecs = document.getElementById("cd-secs");
  const targetDate = new Date(cfg.weddingDateTimeISO || cfg.akadStartISO);

  function pad(n) { return String(n).padStart(2, "0"); }

  function tickCountdown() {
    const now = new Date();
    let diff = targetDate - now;
    if (diff < 0) diff = 0;
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    if (cdDays) cdDays.textContent = pad(days);
    if (cdHours) cdHours.textContent = pad(hours);
    if (cdMins) cdMins.textContent = pad(mins);
    if (cdSecs) cdSecs.textContent = pad(secs);
  }
  tickCountdown();
  setInterval(tickCountdown, 1000);

  /* ---------- 5. Google Calendar link builder ---------- */
  function toGCalDate(iso) {
    // Google Calendar wants UTC-ish compact format: YYYYMMDDTHHMMSSZ
    // We treat the given ISO as local WIB time and just strip punctuation
    // (guests' calendars will show it as their local time equivalent of
    // the literal digits — acceptable for a wedding invite; for exact
    // timezone handling add "ctz=Asia/Jakarta" which we do below).
    const d = iso.replace(/[-:]/g, "").replace(/\.\d+/, "");
    return d;
  }

  function buildGCalUrl({ title, startISO, endISO, details, location }) {
    const base = "https://calendar.google.com/calendar/render?action=TEMPLATE";
    const dates = `${toGCalDate(startISO)}/${toGCalDate(endISO)}`;
    const qs = new URLSearchParams({
      text: title,
      dates: dates,
      details: details,
      location: location,
      ctz: cfg.timezone || "Asia/Jakarta",
    });
    return `${base}&${qs.toString()}`;
  }

  const mainCalendarUrl = buildGCalUrl({
    title: `Pernikahan ${cfg.groomName} & ${cfg.brideName}`,
    startISO: cfg.akadStartISO,
    endISO: cfg.resepsiEndISO || cfg.akadEndISO,
    details: `Kami mengundang Anda pada acara pernikahan ${cfg.groomName} & ${cfg.brideName}.\n\nAkad: ${cfg.akadDateTime}\nResepsi: ${cfg.resepsiDateTime}\nLokasi: ${cfg.venueFull}, ${cfg.venueAddress}`,
    location: `${cfg.venueFull}, ${cfg.venueAddress}`,
  });

  const akadCalendarUrl = buildGCalUrl({
    title: `Pemberkatan Pernikahan ${cfg.groomName} & ${cfg.brideName}`,
    startISO: cfg.akadStartISO,
    endISO: cfg.akadEndISO,
    details: `Pemberkatan pernikahan ${cfg.groomName} & ${cfg.brideName}.\nLokasi: ${cfg.venueName}`,
    location: cfg.venueName,
  });

  const resepsiCalendarUrl = buildGCalUrl({
    title: `Resepsi Pernikahan ${cfg.groomName} & ${cfg.brideName}`,
    startISO: cfg.resepsiStartISO,
    endISO: cfg.resepsiEndISO,
    details: `Resepsi pernikahan ${cfg.groomName} & ${cfg.brideName}.\nLokasi: ${cfg.venueName2}`,
    location: cfg.venueName2,
  });

  document.getElementById("add-to-calendar")?.setAttribute("href", mainCalendarUrl);
  document.getElementById("akad-calendar")?.setAttribute("href", akadCalendarUrl);
  document.getElementById("resepsi-calendar")?.setAttribute("href", resepsiCalendarUrl);
  [document.getElementById("add-to-calendar"), document.getElementById("akad-calendar"), document.getElementById("resepsi-calendar")]
    .forEach((a) => a && (a.target = "_blank", a.rel = "noopener"));

  /* ---------- 6. Google Maps link ---------- */
  const mapsUrl =
    cfg.venueLat && cfg.venueLng
      ? `https://www.google.com/maps/search/?api=1&query=${cfg.venueLat},${cfg.venueLng}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cfg.venueMapsQuery || cfg.venueFull || "")}`;
  const mapsLink = document.getElementById("open-maps");
  if (mapsLink) {
    mapsLink.href = mapsUrl;
    mapsLink.target = "_blank";
    mapsLink.rel = "noopener";
  }

  /* ---------- 7. RSVP submit → Apps Script (Google Sheets) ---------- */
  const rsvpForm = document.getElementById("rsvp-form");
  const rsvpStatus = document.getElementById("rsvp-status");
  const rsvpSubmit = document.getElementById("rsvp-submit");
  const attendanceGroup = document.getElementById("attendance-group");

  attendanceGroup?.querySelectorAll(".radio-option").forEach((opt) => {
    opt.addEventListener("click", () => {
      attendanceGroup.querySelectorAll(".radio-option").forEach((o) => o.classList.remove("active"));
      opt.classList.add("active");
      opt.querySelector("input").checked = true;
    });
  });

  rsvpForm?.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!cfg.appsScriptUrl) {
      rsvpStatus.textContent = "Formulir belum terhubung ke Google Sheets. Lihat README untuk menyambungkan.";
      rsvpStatus.className = "form-status error";
      return;
    }

    const formData = new FormData(rsvpForm);
    const payload = {
      name: formData.get("name")?.toString().trim(),
      attendance: formData.get("attendance"),
      guests: formData.get("guests"),
      message: formData.get("message")?.toString().trim(),
    };

    if (!payload.name || !payload.attendance || !payload.message) {
      rsvpStatus.textContent = "Mohon lengkapi semua kolom.";
      rsvpStatus.className = "form-status error";
      return;
    }

    rsvpSubmit.disabled = true;
    rsvpSubmit.textContent = "Mengirim...";

    try {
      const res = await fetch(cfg.appsScriptUrl, {
        method: "POST",
        // text/plain avoids a CORS preflight against Apps Script,
        // which does not support OPTIONS requests.
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.status === "success") {
        rsvpStatus.textContent = "Terima kasih! RSVP Anda telah kami terima.";
        rsvpStatus.className = "form-status success";
        rsvpForm.reset();
        attendanceGroup?.querySelectorAll(".radio-option").forEach((o) => o.classList.remove("active"));
        loadWishes(); // refresh wishes list to show the new one
      } else {
        throw new Error(data.error || "Unknown error");
      }
    } catch (err) {
      rsvpStatus.textContent = "Gagal mengirim. Silakan coba lagi.";
      rsvpStatus.className = "form-status error";
      console.error(err);
    } finally {
      rsvpSubmit.disabled = false;
      rsvpSubmit.textContent = "Kirim RSVP";
    }
  });

  /* ---------- 8. Wishes list ---------- */
  const wishesList = document.getElementById("wishes-list");

  async function loadWishes() {
    if (!wishesList) return;
    if (!cfg.appsScriptUrl) {
      wishesList.innerHTML = '<p class="wish-empty">Ucapan akan tampil di sini setelah formulir RSVP terhubung ke Google Sheets.</p>';
      return;
    }
    try {
      const res = await fetch(`${cfg.appsScriptUrl}?action=wishes`);
      const data = await res.json();
      const wishes = data.wishes || [];
      if (!wishes.length) {
        wishesList.innerHTML = '<p class="wish-empty">Jadilah yang pertama mengirimkan ucapan &amp; doa!</p>';
        return;
      }
      wishesList.innerHTML = wishes
        .map(
          (w) => `
        <div class="wish-item">
          <span class="wish-name">${escapeHTML(w.name)}</span>
          <span class="wish-tag">${escapeHTML(w.attendance || "")}</span>
          <p class="wish-msg">${escapeHTML(w.message)}</p>
        </div>`
        )
        .join("");
    } catch (err) {
      wishesList.innerHTML = '<p class="wish-empty">Tidak dapat memuat ucapan saat ini.</p>';
      console.error(err);
    }
  }

  function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str ?? "";
    return div.innerHTML;
  }

  loadWishes();
  // Poll every 30s for near-real-time updates while the guest has the page open.
  setInterval(loadWishes, 30000);

  /* ---------- 9. copy bank account number ---------- */
  document.getElementById("copy-bank")?.addEventListener("click", async (e) => {
    try {
      await navigator.clipboard.writeText(cfg.bankAccountNumberOnly || "");
      e.target.textContent = "Tersalin!";
      setTimeout(() => (e.target.textContent = "Salin Nomor Rekening"), 1800);
    } catch {
      e.target.textContent = cfg.bankAccountNumberOnly || "";
    }
  });
})();
