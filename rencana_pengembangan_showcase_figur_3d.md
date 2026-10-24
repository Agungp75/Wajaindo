# 📋 Rencana Pengembangan Proyek (Project Development Plan)

**Nama Proyek:** Interactive 3D Figure Showcase with Spatial Audio & Reversible Scroll  
**Target Platform:** Web Browser (Desktop & Mobile Responsif)  
**Pendekatan Teknis:** Single-Page Interactive Storytelling (HTML5, CSS3 3D Transforms, Three.js, Web Audio API / HTML5 Audio)

---

## 1. Tujuan & Konsep Utama (Core Concept)

Membangun aplikasi web *showcase* karakter/figur yang memberikan pengalaman imersif melalui kombinasi tiga elemen interaktif utama:

1. **Reversible Scroll Storytelling:** Figur muncul satu per satu saat halaman digulir ke bawah (*scroll down*), bergerak masuk secara selang-seling (figur ganjil dari kiri ke kanan, figur genap dari kanan ke kiri) dari ukuran kecil hingga membesar ke ukuran penuh. Saat pengguna menggulir kembali ke atas (*scroll up*), animasi berputar balik (*reverse*) secara mulus—figur kembali mengecil dan bergeser keluar ke arah asalnya.
2. **Interaksi Kursor 3D (Micro-Interaction):** Saat kursor diarahkan ke figur (*hover*), kartu akan miring secara 3D mengikuti posisi kursor (*3D perspective tilt*), memunculkan kilauan cahaya dinamis (*spotlight glare*), dan membuat gambar figur menonjol keluar (*pop-out zoom*).
3. **Backsound Interaktif Real-Time:** Musik latar khusus untuk tiap figur hanya berbunyi saat kursor diarahkan ke figur tersebut (*smooth fade-in*) dan langsung berhenti secara halus (*exponential fade-out*) ketika kursor meninggalkan figur atau saat figur mengecil karena di-scroll menjauh.

---

## 2. Arsitektur Teknis & Teknologi (Tech Stack)

* **Struktur & Layout:** HTML5 Semantic (`header`, `section`, `footer`) dengan tata letak *vertical storytelling*.
* **Styling & Efek 3D:** Tailwind CSS & Custom CSS3 dengan properti kunci:
  * `perspective: 1200px` pada kontainer kartu.
  * `transform-style: preserve-3d` pada elemen kartu utama.
  * `translateZ()` bertingkat pada tiap lapisan (*layer background*, *layer cincin*, *layer teks*, dan *layer karakter*) untuk menciptakan efek kedalaman (*multi-layer parallax*).
* **Animasi Scroll (Reversible Engine):** Vanilla JavaScript menggunakan loop `requestAnimationFrame` (60 FPS) dan rumus *Linear Interpolation* (`lerp`) serta fungsi *Smoothstep* untuk membaca posisi *viewport* secara *real-time*.
* **Background Atmosferik:** Three.js (`THREE.Points`) untuk partikel kosmik 3D di latar belakang yang merespons pergerakan mouse dan kecepatan scroll.
* **Sistem Audio:** Web Audio API Synthesizer (tanpa ketergantungan file eksternal) atau HTML5 Audio dengan kontrol *GainNode* untuk transisi volume halus (*anti-clicking fade*).

---

## 3. Alur Kerja Sistem (System Workflow)

### A. Mekanisme Scroll Bolak-Balik (Scroll Down vs Scroll Up)

| Aksi Pengguna | Logika Sistem (`Progress: 0.0 -> 1.0`) | Efek Visual pada Figur |
| :--- | :--- | :--- |
| **Belum di-scroll (Di bawah layar)** | `Progress = 0.0` | Ukuran kecil (`scale(0.55)`), transparan (`opacity: 0`), blur (`10px`), posisi di pinggir kiri (`-180px`) atau kanan (`+180px`). |
| **Scroll ke Bawah (Masuk ke tengah layar)** | `Progress` naik dari `0.0` ke `1.0` | Figur bergeser ke tengah (`0px`), membesar ke ukuran normal (`scale(1.0)`), blur hilang (`0px`), dan menjadi jelas (`opacity: 1`). |
| **Scroll ke Atas (Reverse / Kembali)** | `Progress` turun dari `1.0` ke `0.0` | Animasi berputar balik secara *real-time*: figur mengecil kembali ke `0.55`, memudar, dan bergeser kembali ke arah asalnya (kiri/kanan). |

### B. Mekanisme Hover 3D & Backsound

1. **Kondisi Idle (Kursor di luar figur):**
   * Kartu berada dalam posisi datar (`rotateX(0deg) rotateY(0deg)`).
   * Ukuran figur mengikuti skala dari progres scroll saat itu.
   * Status Audio: **Hening / Mati**.
2. **Kondisi Hover (Kursor diarahkan ke figur):**
   * Sistem menghitung koordinat $(X, Y)$ kursor relatif terhadap titik tengah kartu untuk memutar sumbu 3D (`rotateX` dan `rotateY` hingga $\pm 16^\circ$).
   * Lapisan figur didorong maju ke arah layar (`translateZ(130px) scale(1.18)`).
   * Indikator *equalizer* aktif dan audio mulai berbunyi dengan *fade-in* selama $0.18\text{ detik}$.
3. **Kondisi Kursor Keluar / Figur Ter-Reverse saat Scroll:**
   * Kartu kembali ke posisi datar secara elastis.
   * Audio langsung diredupkan dengan *exponential fade-out* selama $0.3\text{ detik}$ agar tidak terdengar bunyi patahan kasar (*pop/click*).

---

## 4. Tahapan Pengerjaan (Development Roadmap)

### Fase 1: Persiapan Aset Visual & Audio
- [x] Menyiapkan 4–6 aset gambar karakter dengan latar belakang transparan (format `.PNG`, `.WebP`, atau `.SVG`).
- [x] Memisahkan elemen visual di dalam kartu menjadi 3 lapisan kedalaman:
  - *Layer Dasar (`translateZ: 10px`):* Latar belakang gradien & aura.
  - *Layer Tengah (`translateZ: 35px - 70px`):* Cincin hologram berputar & informasi teks.
  - *Layer Utama (`translateZ: 85px -> 130px`):* Gambar karakter utama.
- [x] Menyiapkan *preset* nada Web Audio API atau file `.mp3` (*loopable*, durasi 15–30 detik per karakter).

### Fase 2: Pembuatan Layout & Efek 3D Hover
- [x] Membangun struktur halaman vertikal: *Hero Section* di bagian atas dan daftar *Section Figur* di bawahnya.
- [x] Mengatur tata letak selang-seling (*zig-zag*) antara kartu 3D dan kolom spesifikasi karakter.
- [x] Mengimplementasikan *event listener* `mousemove` pada setiap kartu untuk menggerakkan perspektif 3D dan sorotan cahaya (`radial-gradient`).

### Fase 3: Implementasi Engine Scroll Bolak-Balik (Reversible Scroll)
- [x] Membuat fungsi pembacaan posisi elemen terhadap tinggi layar menggunakan `getBoundingClientRect()`.
- [x] Mengonversi jarak elemen menjadi nilai progres ternormalisasi ($0.0 \le p \le 1.0$).
- [x] Menghubungkan nilai progres dengan properti `transform: translate3d() scale()` di dalam loop `requestAnimationFrame`.
- [x] Menguji kelancaran efek *reverse* baik saat di-scroll perlahan maupun cepat ke arah atas dan bawah.

### Fase 4: Integrasi Sistem Audio & Kebijakan Autoplay Browser
- [x] Membuat tombol **"Aktifkan Audio 3D"** dan *auto-unlock* pada klik pertama untuk membuka blokir `AudioContext` bawaan browser modern.
- [x] Menghubungkan *event* `mouseenter` dan `mouseleave` ke fungsi pemutar suara masing-masing figur.
- [x] Menambahkan logika pengaman otomatis: apabila figur mengecil ($p < 0.45$) saat di-scroll padahal kursor masih menempel, hentikan suara secara otomatis.

### Fase 5: Penyempurnaan & Optimasi (Polishing)
- [x] Menambahkan indikator arah scroll (*Scroll Down Reveal* vs *Scroll Up Reverse*) dan persentase skala figur secara *real-time*.
- [x] Menambahkan dukungan layar sentuh (*touchstart*) untuk pengguna perangkat *mobile*.
- [x] Mengoptimalkan performa *rendering* menggunakan `will-change: transform, opacity, filter` agar tetap berjalan stabil di 60 FPS.

---

## 5. Struktur Direktori Proyek (Untuk Pengembangan Multi-File)

Apabila prototipe *single-file* ini ingin dikembangkan lebih lanjut menjadi proyek modular di tekstual editor (seperti VS Code), berikut adalah struktur folder yang direkomendasikan:

```text
📦 cyberverse-3d-showcase
 ┣ 📂 assets
 ┃ ┣ 📂 images            # Gambar karakter transparan (sentinel.png, phoenix.png, dll.)
 ┃ ┗ 📂 audio             # File backsound MP3/OGG jika menggunakan audio eksternal
 ┣ 📂 css
 ┃ ┗ 📜 style.css         # Aturan perspective 3D, layer translateZ, dan animasi
 ┣ 📂 js
 ┃ ┣ 📜 scroll-engine.js  # Engine animasi scroll bolak-balik (lerp & smoothstep)
 ┃ ┣ 📜 tilt-3d.js        # Perhitungan rotasi 3D kursor & efek glare
 ┃ ┣ 📜 audio-engine.js   # Manajemen Web Audio API / pemutar backsound
 ┃ ┗ 📜 background-3d.js  # Partikel Three.js latar belakang
 ┣ 📜 index.html          # Halaman utama
 ┗ 📜 project_plan.md     # Dokumen rencana pengembangan ini
```