# 🍢 Sistem Kasir POS - Sate Klatak Mbak Lala

Aplikasi Point of Sale (POS) modern, cepat, dan responsif untuk **Sate Klatak Mbak Lala** (Jejeran, Bantul, D.I. Yogyakarta). Didesain khusus untuk operasional kasir restoran dengan tampilan rapi, elegan, dan otomatis menyesuaikan di perangkat **Desktop PC, Laptop, iPad/Tablet, serta Smartphone (Android & iOS)**.

---

## 🌟 Fitur Unggulan

1. **Desain UI Modern & Rapi (Sesuai Referensi POS)**
   - Layout split-panel 2 kolom (Panel Tagihan & Pesanan di Kiri, Katalog Menu di Kanan) untuk Desktop & iPad/Tablet.
   - Sliding Drawer / Bottom Sheet otomatis saat diakses dari Smartphone / HP.
   - Wadah placeholder gambar menu yang elegan, bersih, dan rapi sesuai instruksi (siap diganti foto asli sewaktu-waktu).

2. **Daftar Menu Asli & Lengkap (29 Item)**
   - **Sate**: Sate Klatak (Rp 35.000), Sate Kecap (Rp 35.000), Sate Goreng Manis (Rp 35.000).
   - **Daging**: Tongseng Daging (Rp 35.000), Gule Daging (Rp 35.000), Kicik Daging (Rp 35.000).
   - **Tulang**: Tengkleng (Rp 35.000), Rica Tengkleng (Rp 35.000), Gule Tulang (Rp 35.000).
   - **Jeroan**: Tongseng Jeroan (Rp 10.000), Kicik Jeroan (Rp 10.000), Gule Jeroan (Rp 10.000).
   - **Goreng**: Kronyos (Rp 30.000), Gule Goreng (Rp 10.000), Klatak Goreng (Rp 35.000), Klatak Bawang (Rp 35.000).
   - **Nasi**: Nasi Putih (Rp 5.000), Nasi Goreng Kambing (Rp 30.000).
   - **Olahan Ayam & Bebek**: Bakmi Goreng (Rp 25.000), Bakmi Godog (Rp 25.000), Nasi Goreng (Rp 25.000), Magelangan (Rp 25.000), Rica Rica Mentok (Rp 25.000).
   - **Minuman**: Teh Panas/Es, Teh Krampul, Jeruk Panas/Es, Air Es, dll.

3. **Pencarian Cepat & Filter Kategori**
   - Filter instan per kategori tab: *Semua, Sate, Daging, Tulang, Jeroan, Goreng, Nasi, Ayam & Bebek, Minuman*.
   - Kotak pencarian langsung (live instant search).

4. **Kustomisasi Pesanan (Catatan Meja & Menu)**
   - Tipe pesanan: **Makan di Tempat (Dine-in)** atau **Bawa Pulang (Takeaway)**.
   - Pemilihan nomor meja: *Meja 01 s/d Meja 10, Lesehan 01-03, VIP Room*.
   - Catatan khusus per menu (misal: *"Kuah dipisah"*, *"Pedas sedang"*, *"Tanpa jeroan"*, *"Bawang goreng banyak"*).

5. **Simpan Pesanan (Hold Bill / Open Bills)**
   - Fitur simpan tagihan meja yang sedang berjalan, dan dapat dipanggil kembali kapan saja hanya dengan 1 klik.

6. **Metode Pembayaran Lengkap**
   - **Tunai (Cash)**: Disertai tombol pecahan cepat (Uang Pas, 50k, 100k, 150k, 200k, 500k) dan hitung kembalian otomatis secara presisi.
   - **QRIS**: Tampilan mockup QRIS resmi untuk pembayaran scan digital (GoPay, OVO, ShopeePay, Dana, BCA Mobile, dll).
   - **Kartu Debit / EDC & Transfer Bank**.

7. **Struk Thermal Siap Cetak (Thermal Receipt ESC/POS)**
   - Format struk rapi 58mm / 80mm siap dicetak langsung ke printer thermal Bluetooth / USB dengan tombol Cetak Struk (`Ctrl + P`).

8. **Audio Feedback (Web Audio API)**
   - Nada sentuh responsif saat menambah menu, mengubah jumlah porsi, dan nada lonceng kasir saat transaksi sukses (tanpa download file audio eksternal).

9. **Riwayat Penjualan & Laporan Omzet Harian**
   - Laporan ringkasan omzet hari ini, jumlah transaksi, rincian pembayaran (Tunai vs QRIS), dan peringkat menu terlaris.

---

## 🚀 Cara Menjalankan

Aplikasi ini dapat dijalankan langsung dengan 2 cara:

### Cara 1: Menggunakan XAMPP (Apache)
1. Buka aplikasi **XAMPP Control Panel** dan klik **Start** pada modul **Apache**.
2. Buka browser (Chrome, Edge, Safari, Firefox), lalu akses alamat:
   ```
   http://localhost/aplikasi-kasir/
   ```
3. Untuk akses dari **HP Android / iPhone / iPad** yang terhubung ke Wi-Fi yang sama, buka browser di HP dan ketik:
   ```
   http://<IP-KOMPUTER-ANDA>/aplikasi-kasir/
   ```
   *(Contoh: `http://192.168.1.15/aplikasi-kasir/`)*

### Cara 2: Langsung Buka File HTML (Tanpa Server)
- Klik dua kali (double click) file `index.html` pada folder `c:\xampp\htdocs\aplikasi-kasir`.

---

## 🔗 Panduan Menghubungkan ke GitHub Anda

Akun Git Anda terdeteksi sebagai:
- **User**: `aleanopvnk-creator`
- **Email**: `aleanopvnk@gmail.com`

Untuk mengunggah (push) seluruh project ini ke akun GitHub Anda:

1. Buka [GitHub](https://github.com/new) dan buat repository baru, misalnya dengan nama:
   `aplikasi-kasir-sate-klatak` (pilih Public atau Private, jangan centang "Add a README file" karena kita sudah memilikinya).

2. Buka terminal (PowerShell atau Git Bash) di folder project ini (`c:\xampp\htdocs\aplikasi-kasir`), lalu jalankan perintah berikut:

```powershell
# Tambahkan URL repository GitHub Anda
git remote add origin https://github.com/aleanopvnk-creator/aplikasi-kasir-sate-klatak.git

# Set branch utama ke main
git branch -M main

# Unggah ke GitHub
git push -u origin main
```

*(Jika Anda menggunakan nama repository lain di GitHub, cukup ganti `aplikasi-kasir-sate-klatak` dengan nama repository yang Anda buat)*.

---

## 📁 Struktur File Project

```
c:\xampp\htdocs\aplikasi-kasir\
├── index.html           # Halaman utama aplikasi kasir POS
├── css/
│   ├── style.css        # Sistem desain POS, komponen, responsive layout (Desktop, Tablet, Mobile)
│   └── print.css        # Format cetak struk thermal printer (58mm/80mm)
├── js/
│   ├── data.js          # Database seluruh 29 menu asli Sate Klatak Mbak Lala & kategori
│   ├── pos.js           # State store, logika keranjang, hold order, kalkulasi, transaksi
│   ├── ui.js            # Controller render katalog, pencarian, keranjang, modal, struk
│   └── audio.js         # Sound effects interaktif kasir via Web Audio API
├── .gitignore           # File ignore Git
└── README.md            # Dokumentasi lengkap project
```
