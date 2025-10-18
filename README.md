# Tugas1PrakPemweb

---

## 1. Penjelasan singkat tentang fungsi aplikasi dan fitur-fiturnya

Aplikasi Manajemen Tugas Mahasiswa web sederhana ini dirancang untuk membantu mahasiswa mengelola dan melacak tugas akademik mereka berdasarkan mata kuliah dan status penyelesaian. Dibangun menggunakan HTML, Tailwind CSS, dan JavaScript murni, aplikasi ini menggunakan Local Storage di browser Anda untuk menyimpan semua data secara persisten.

### Fitur Utama

Berikut adalah daftar lengkap fitur yang telah diimplementasikan dalam aplikasi ini:

* **Manajemen Mata Kuliah (Course):** Menambah, mengubah (edit), dan menghapus mata kuliah dari sidebar. Dropdown opsi (...) pada setiap mata kuliah untuk fungsi edit/hapus.
* **Manajemen Tugas (Task):** Menambah tugas baru (Nama dan Deadline) untuk mata kuliah yang aktif. Mengubah status tugas menjadi **"Selesai"** (Hijau) atau **"Belum Selesai"** (Merah) hanya dengan mengklik badge status pada tugas. Menghapus tugas melalui menu opsi (...) pada blok tugas.
* **Pencarian & Pemfilteran Global:** Kolom pencarian () dan dropdown status () di sidebar. Pencarian dapat dilakukan berdasarkan Nama Tugas, Deadline, atau Nama Mata Kuliah. Mode pencarian menampilkan semua tugas dari semua mata kuliah.
* **Indikator Status:** Saat mode Pencarian Global aktif, judul utama menampilkan jumlah total tugas dan secara spesifik jumlah tugas yang Belum Selesai.

---

## 🖼️ 2. Screenshot aplikasi yang sudah jadi (minimal 3 screenshot menunjukkan berbagai fitur)

<img width="1319" height="982" alt="image" src="https://github.com/user-attachments/assets/d0d6d6da-6e2c-4b40-9f3a-5f893e3e2d1d">
<img width="519" height="949" alt="image" src="https://github.com/user-attachments/assets/d1d1d711-c2ce-411a-824a-67a7d0d4a2fa">
<img width="1319" height="957" alt="image" src="https://github.com/user-attachments/assets/f4a18f9d-fa3b-4c4e-8e9d-f2915c4d15f7">

---

## 🚀 3. Cara menjalankan aplikasi

Aplikasi ini bersifat *client-side* murni (hanya menggunakan HTML, CSS, dan JavaScript) sehingga sangat mudah dijalankan.

1.  **Unduh File:** Pastikan Anda memiliki kedua file (`Index.html` dan `Script.js`) di dalam satu folder yang sama.
2.  **Buka di Browser:** Klik dua kali (`double-click`) pada file **`Index.html`**.
3.  Aplikasi akan otomatis terbuka di *browser* default Anda (Chrome, Firefox, dll.). Semua fungsionalitas akan langsung dapat digunakan.

---

## ⚙️ 4. Daftar fitur yang telah diimplementasikan



1.  **Manajemen Mata Kuliah:** CRUD dasar (Create, Read, Update, Delete) melalui *sidebar* dan menu opsi.
2.  **Manajemen Tugas:** Penambahan, Penghapusan, dan *Toggle* status (Belum Selesai / Selesai).
3.  **Pencarian Global:** Filter berdasarkan teks (Nama Tugas, Deadline, Matkul) dan status (Semua, Pending, Done).
4.  **Laporan Sederhana:** Menampilkan jumlah total tugas dan jumlah tugas yang belum selesai saat mode pencarian aktif.

---

## 💾 5. Penjelasan teknis tentang penggunaan LocalStorage dan validasi form

Aplikasi ini mengandalkan dua konsep inti untuk operasionalnya: **Validasi Form** dasar dan **Local Storage** untuk persistensi data.

### Penggunaan Local Storage

Aplikasi menggunakan `localStorage` untuk memastikan semua data (Mata Kuliah dan Tugas) tidak hilang saat *browser* ditutup atau halaman di-*refresh*.

* **Kunci Penyimpanan:** Dua kunci utama digunakan: `courses` (untuk daftar nama mata kuliah) dan `allTasks` (untuk data tugas utama).
* **Fungsi Kunci:** Fungsi **`saveCourses()`** dan **`loadCourses()`** bertanggung jawab untuk serialisasi objek JavaScript (`allTasks`) menjadi string JSON untuk penyimpanan, dan *parsing* kembali saat memuat data. Setiap perubahan data memanggil `saveCourses()`.

### Validasi Form Dasar

Validasi yang diimplementasikan berfokus pada memastikan integritas data dasar:

* **Input Wajib:** Saat menambah atau mengedit, aplikasi menggunakan `prompt()` dan memeriksa apakah input (`courseName` atau `taskName`) kosong atau hanya berisi spasi (`.trim() === ""`).
* **Pengecekan Duplikat:** Aplikasi mencegah pembuatan dua mata kuliah dengan nama yang sama persis.
* **Konfirmasi Penghapusan:** Fungsi `deleteTask()` dan `deleteCourse()` menggunakan `confirm()` untuk meminta persetujuan pengguna sebelum data dihapus secara permanen.
