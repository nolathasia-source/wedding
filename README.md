# Undangan Pernikahan Digital — Diman & Ruth

Undangan pernikahan modern bertema Batak (editorial, minim, elegan) dengan
RSVP yang tersinkron otomatis ke Google Sheets, ucapan tamu real-time,
countdown, integrasi Google Maps & Google Calendar, dan musik latar.

Semua file sudah lengkap dan siap dipakai. Ada **3 langkah manual** yang
memang harus kamu lakukan sendiri (butuh login akun Google/GitHub kamu) —
selebihnya tinggal edit teks di satu file (`config.js`).

---

## 0. Struktur file

```
wedding-invitation/
├── index.html          ← struktur halaman (jarang perlu diedit)
├── style.css            ← semua tampilan/desain
├── config.js             ← ⭐ EDIT DI SINI: nama, tanggal, alamat, rekening
├── script.js              ← logika (countdown, RSVP, kalender, maps)
├── assets/
│   ├── photos/            ← ganti foto di sini (lihat assets/README.md)
│   ├── music/              ← ganti musik di sini
│   └── README.md
└── apps-script/
    └── Code.gs              ← kode backend Google Apps Script (Langkah 2)
```

---

## 1. Isi semua data pernikahan (WAJIB, paling gampang)

Buka **`config.js`** — semua nama, tanggal, jam, alamat gereja/gedung,
nomor rekening, dan alamat pengiriman hadiah ada di satu file ini dengan
komentar penjelasan di setiap baris. Edit nilainya, simpan, selesai —
seluruh halaman (cover, countdown, kalender, peta, hadiah) otomatis ikut
berubah karena semua bagian situs membaca dari file ini.

Field yang **wajib** kamu isi:
- `groomName`, `brideName`, nama orang tua kedua mempelai
- `weddingDateTimeISO`, `akadStartISO`, `akadEndISO`, `resepsiStartISO`, `resepsiEndISO`
- `venueName`, `venueName2`, `venueFull`, `venueAddress`
- `venueMapsQuery` (atau `venueLat`/`venueLng` jika ingin titik peta presisi)
- `bankInfo`, `bankAccountNumberOnly`, `bankHolder`, `giftAddress`

## 2. Ganti foto & musik

Lihat `assets/README.md` — cukup timpa file dengan nama yang sama persis
(`cover.jpg`, `groom.jpg`, `bride.jpg`, `gallery-1.jpg`...`gallery-5.jpg`,
`song.mp3`). Tidak perlu mengubah kode.

---

## 3. Sambungkan RSVP ke Google Sheets (manual, ~5 menit)

Saya tidak bisa membuat Google Sheet/Apps Script di akun Google kamu secara
otomatis (butuh login & izin akun kamu). Ikuti langkah ini persis:

1. Buka **sheets.google.com** → buat spreadsheet baru, beri nama misalnya
   `RSVP Pernikahan Diman & Ruth`.
2. Di menu, klik **Extensions → Apps Script**.
3. Hapus semua kode default di editor yang muncul, lalu **copy-paste seluruh
   isi file `apps-script/Code.gs`** (ada di folder proyek ini) ke sana.
4. Klik ikon **Save** (disket), beri nama project misalnya `RSVP API`.
5. Klik **Deploy → New deployment**.
   - Klik ikon gerigi di sebelah "Select type" → pilih **Web app**.
   - Description: bebas, misal `RSVP v1`.
   - **Execute as:** `Me (email kamu)`
   - **Who has access:** `Anyone` ⚠️ (wajib "Anyone", bukan "Anyone with
     Google account" — supaya tamu tanpa login Google tetap bisa RSVP)
   - Klik **Deploy**.
6. Google akan minta otorisasi (karena script ini mengakses spreadsheet
   kamu) → klik **Authorize access** → pilih akun Google kamu → pada layar
   peringatan "Google hasn't verified this app", klik **Advanced → Go to
   RSVP API (unsafe)** → **Allow**. (Ini normal untuk script buatan sendiri,
   bukan tanda bahaya — Google hanya belum mereview app pribadi.)
7. Setelah deploy selesai, kamu akan mendapat **Web app URL** seperti:
   `https://script.google.com/macros/s/AKfycb.../exec`
   Copy URL tersebut.
8. Buka **`config.js`**, isi:
   ```js
   appsScriptUrl: "https://script.google.com/macros/s/AKfycb.../exec",
   ```
9. Simpan. RSVP dan ucapan tamu sekarang otomatis masuk ke sheet bernama
   `RSVP` (dibuat otomatis saat submission pertama) dengan kolom:
   `Timestamp | Full Name | Attendance | Number of Guests | Message`.

**Catatan penting:**
- Setiap kali kamu **mengedit** `Code.gs` di kemudian hari, kamu harus
  **Deploy → Manage deployments → edit (ikon pensil) → New version →
  Deploy** — Apps Script tidak otomatis mempublikasikan perubahan.
- Data bisa langsung di-export dari Google Sheets ke Excel/CSV kapan saja
  (`File → Download`).
- Ucapan tamu di situs otomatis refresh tiap 30 detik selagi halaman
  terbuka (near real-time, tanpa perlu reload manual).

---

## 4. Deploy ke GitHub Pages (manual, ~5 menit)

Saya tidak punya akses ke akun GitHub kamu, jadi langkah ini perlu kamu
lakukan sendiri:

1. Buat repository baru di GitHub, misal `wedding-diman-ruth` (bisa
   public atau private — GitHub Pages tetap bisa jalan untuk keduanya di
   akun berbayar; untuk akun gratis, repo harus **public** agar Pages
   aktif).
2. Upload **semua isi folder `wedding-invitation/`** ini ke root repo
   tersebut (drag-and-drop lewat web GitHub, atau via `git push` jika
   kamu terbiasa command line):
   ```bash
   cd wedding-invitation
   git init
   git add .
   git commit -m "Undangan pernikahan Diman & Ruth"
   git branch -M main
   git remote add origin https://github.com/USERNAME/wedding-diman-ruth.git
   git push -u origin main
   ```
3. Di GitHub, buka repo → **Settings → Pages**.
4. Pada **Source**, pilih **Deploy from a branch** → Branch: `main`,
   folder `/ (root)` → **Save**.
5. Tunggu 1–2 menit, refresh halaman itu — akan muncul URL seperti:
   `https://USERNAME.github.io/wedding-diman-ruth/`
6. Itulah link undangan yang bisa kamu bagikan ke tamu. Untuk personalisasi
   nama tamu di gate pembuka, tambahkan `?to=Nama%20Tamu` di akhir link,
   misal:
   `https://USERNAME.github.io/wedding-diman-ruth/?to=Budi%20Santoso`

---

## Checklist fitur

- [x] Cover / opening dengan monogram & motif gorga
- [x] Section mempelai (bride & groom) dengan nama orang tua
- [x] Countdown (hari/jam/menit/detik) real-time
- [x] Detail acara (Akad & Resepsi) dengan tombol "+ Kalender" → Google Calendar
- [x] Tanggal & waktu pernikahan → klik → buka Google Calendar terisi otomatis
- [x] Section lokasi dengan alamat yang bisa diklik → buka Google Maps
- [x] Galeri foto
- [x] Form RSVP: nama, kehadiran, jumlah tamu, ucapan
- [x] RSVP otomatis tersimpan sebagai baris baru di Google Sheets
- [x] Section ucapan & doa tamu, tampil otomatis (polling 30 detik)
- [x] Section hadiah ("Wanna give us some gifts?") dengan info rekening & alamat + tombol salin
- [x] Tombol musik latar mengambang
- [x] Animasi fade-in saat scroll, smooth scroll
- [x] Mobile-first, responsif, dioptimalkan untuk iPhone & Android
- [x] Aksesibilitas dasar: fokus keyboard terlihat, `prefers-reduced-motion` dihormati
- [x] Ringan: tanpa framework/build step, hanya HTML/CSS/JS murni

## Yang perlu kamu lakukan (ringkasan)

1. Isi `config.js` dengan data asli.
2. Ganti foto & musik di `assets/`.
3. Deploy `apps-script/Code.gs` sebagai Web App → tempel URL-nya ke `config.js`.
4. Push folder ini ke GitHub → aktifkan GitHub Pages.
5. Bagikan link undangan ke tamu 🎉

## Troubleshooting

| Masalah | Penyebab umum | Solusi |
|---|---|---|
| RSVP tidak masuk ke Sheets | `appsScriptUrl` belum diisi / salah | Cek ulang Langkah 3, pastikan URL diakhiri `/exec` |
| Ucapan tidak muncul | Deployment Apps Script "Who has access" bukan "Anyone" | Redeploy dengan akses "Anyone" |
| Foto tidak muncul | Nama file tidak sama persis (case-sensitive) | Cocokkan nama file dengan tabel di `assets/README.md` |
| Musik tidak auto-play | Kebijakan browser (Safari/Chrome memblokir autoplay bersuara) | Musik otomatis mulai saat tamu tap "Buka Undangan"; tombol lingkaran kanan-bawah untuk kontrol manual |
| GitHub Pages 404 | Belum menunggu build selesai, atau source branch salah | Tunggu 1-2 menit, cek Settings → Pages menunjukkan status "live" |
