/* * Analisis File script.js
 * * Struktur yang benar adalah kunci.
 * * Setiap logika halaman (Login, Dashboard, Stok, Tracking, Logout)
 * * harus berada di dalam blok 'if (namaElemen)' mereka sendiri,
 * * dan semua blok 'if' itu harus setara (tidak di dalam satu sama lain).
 */

document.addEventListener("DOMContentLoaded", function() {

    // --- LOGIKA HALAMAN LOGIN (index.html) ---
    const loginForm = document.getElementById("loginForm");
    
    // Blok ini HANYA berjalan jika ada 'loginForm' (di index.html)
    if (loginForm) { 
        
        loginForm.addEventListener("submit", function(event) {
            // 1. Mencegah form terkirim (refresh)
            event.preventDefault(); 
            
            // 2. Ambil nilai input
            const emailInput = document.getElementById("email").value;
            const passwordInput = document.getElementById("password").value;
            
            let userDitemukan = false;
            let namaUser = "Pengguna"; // Siapkan variabel nama

            // 3. Loop dataPengguna dari data.js
            for (let i = 0; i < dataPengguna.length; i++) {
                if (dataPengguna[i].email === emailInput && dataPengguna[i].password === passwordInput) {
                    userDitemukan = true;
                    namaUser = dataPengguna[i].nama; // Ambil namanya saat ditemukan
                    break;
                }
            }
            
            // 4. Validasi dan Aksi (INI HARUS DI DALAM EVENT SUBMIT)
            if (userDitemukan) {
                // Simpan nama itu ke sessionStorage
                sessionStorage.setItem('namaUserLogin', namaUser);

                // Jika berhasil, pindah ke halaman dashboard
                window.location.href = "dashboard.html";
            } else {
                // Jika gagal, tampilkan alert
                alert("email/password yang anda masukkan salah");
            }
        }); // <-- Penutup untuk loginForm.addEventListener

        // Logika untuk Modal Box (juga di dalam if (loginForm))
        const modalLupa = document.getElementById("modalLupaPassword");
        const modalDaftar = document.getElementById("modalDaftar");
        
        document.getElementById("btnLupaPassword").addEventListener("click", function(e) {
            e.preventDefault();
            modalLupa.classList.add("show");
        });
        document.getElementById("btnDaftar").addEventListener("click", function(e) {
            e.preventDefault();
            modalDaftar.classList.add("show");
        });

        // Logika tombol close (x) pada modal
        document.getElementById("closeLupa").addEventListener("click", () => modalLupa.classList.remove("show"));
        document.getElementById("closeDaftar").addEventListener("click", () => modalDaftar.classList.remove("show"));
    
    } // <-- Penutup untuk if (loginForm)

    // --- LOGIKA LOGOUT (BERLAKU DI SEMUA HALAMAN) ---
    // Ini sekarang berada di LUAR 'if (loginForm)', jadi bisa berjalan
    // di halaman dashboard, tracking, dan stok.
    
    // --- LOGIKA LOGOUT (DENGAN KONFIRMASI) ---
    const btnLogout = document.getElementById("btnLogout");

    // Kita tetap cek 'apakah tombol logout ada'
    if (btnLogout) {
        
        btnLogout.addEventListener("click", function(event) {
            // 1. Mencegah link pindah halaman
            event.preventDefault(); 
            
            // 2. Tampilkan pop-up konfirmasi
            const konfirmasi = window.confirm("Apakah Anda yakin ingin logout?");
            
            // 3. Hanya jalankan logout JIKA pengguna menekan "OK"
            if (konfirmasi) { 
                // Hapus data sesi
                sessionStorage.removeItem('namaUserLogin');
                
                // Arahkan kembali ke halaman login
                window.location.href = "index.html";
            }
            // 4. Jika pengguna menekan "Cancel", tidak terjadi apa-apa.
        });
    }

    // --- LOGIKA HALAMAN DASHBOARD (dashboard.html) ---
    const sapaanSpan = document.getElementById("sapaan");
    if (sapaanSpan) {
        // Logika "greeting" berdasarkan waktu 
        const jam = new Date().getHours();
        if (jam < 12) {
            sapaanSpan.textContent = "Pagi";
        } else if (jam < 15) {
            sapaanSpan.textContent = "Siang";
        } else if (jam < 18) {
            sapaanSpan.textContent = "Sore";
        } else {
            sapaanSpan.textContent = "Malam";
        }
        
        // Logika Nama
        const namaPenggunaSpan = document.getElementById("namaPengguna");
        const namaUser = sessionStorage.getItem('namaUserLogin');
        if (namaUser) {
            namaPenggunaSpan.textContent = namaUser;
        }
    }

    // --- LOGIKA HALAMAN TRACKING (tracking.html) ---
    const trackingForm = document.getElementById("trackingForm");
    if (trackingForm) {
        
        trackingForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const nomorDO = document.getElementById("nomorDO").value;
            const hasilContainer = document.getElementById("hasil-tracking");
            const data = dataTracking[nomorDO];

            if (data) {
                // Jika data ditemukan, buat HTML dinamis
                let perjalananHTML = '<ol class="timeline">';
                
                // Loop untuk riwayat perjalanan
                data.perjalanan.forEach(item => {
                    perjalananHTML += `
                        <li>
                            ${item.keterangan}
                            <span>${item.waktu}</span>
                        </li>
                    `;
                });
                perjalananHTML += '</ol>';

                // --- INI STRUKTUR HTML BARUNYA ---
                hasilContainer.innerHTML = `
                    <div class="tracking-header">
                        <h3>${data.nama}</h3>
                        <span class="status-badge">${data.status}</span>
                    </div>

                    <div class="tracking-body">
                        <div class="tracking-details">
                            <h4>Detail Pengiriman:</h4>
                            <p><strong>Ekspedisi:</strong> ${data.ekspedisi}</p>
                            <p><strong>Tanggal Kirim:</strong> ${data.tanggalKirim}</p>
                            <p><strong>Total Bayar:</strong> ${data.total}</p>
                        </div>
                        <div class="tracking-history">
                            <h4>Perjalanan Paket:</h4>
                            ${perjalananHTML}
                        </div>
                    </div>
                `;
                // --- AKHIR STRUKTUR BARU ---

                hasilContainer.style.display = "block"; // Tetap 'block' bukan 'grid'
            } else {
                // Jika data tidak ditemukan (KODE BARU)
                // 1. Tampilkan alert box
                alert(`Nomor DO "${nomorDO}" tidak ditemukan.`); 
                // 2. Kosongkan hasil container sebelumnya (jika ada)
                hasilContainer.innerHTML = ""; 
                hasilContainer.style.display = "none"; // Sembunyikan container hasil
            }
        });
    }

    // --- LOGIKA HALAMAN STOK (stok.html) ---
    const stokContainer = document.getElementById("stok-container");
    if (stokContainer) {
        
        // 1. Fungsi untuk menampilkan semua stok
        function muatSemuaStok() {
            stokContainer.innerHTML = "";
            dataBahanAjar.forEach(buku => {
                tambahKartuStokKeDOM(buku);
            });
        }

        // 2. Fungsi untuk membuat elemen kartu (dengan logika gambar kosong)
        function tambahKartuStokKeDOM(buku) {
            const card = document.createElement("div");
            card.className = "stok-card";

            // Analisis: Buat variabel untuk HTML gambar
            let coverImageHTML = ""; // Default: string kosong (tidak ada gambar)
            
            // HANYA jika 'buku.cover' ada isinya, kita buat tag <img>
            if (buku.cover && buku.cover.trim() !== "") {
                coverImageHTML = `<img src="${buku.cover}" alt="${buku.namaBarang}">`;
            }

            card.innerHTML = `
                ${coverImageHTML} 
                <div class="stok-card-content">
                    <h4>${buku.namaBarang}</h4>
                    <p><strong>Kode:</strong> ${buku.kodeBarang} | <strong>Edisi:</strong> ${buku.edisi}</p>
                    <p><strong>Jenis:</strong> ${buku.jenisBarang} | <strong>Lokasi:</strong> ${buku.kodeLokasi}</p>
                    <p class="stok">Stok: ${buku.stok}</p>
                </div>
            `;
            stokContainer.appendChild(card);
        }

        // 3. Logika form tambah stok baru 
        const formTambahStok = document.getElementById("form-tambah-stok");
        formTambahStok.addEventListener("submit", function(e) {
            e.preventDefault();
            
            const kodeBaru = document.getElementById("kodeBarang").value;
            const namaBaru = document.getElementById("namaBarang").value;
            const stokBaru = document.getElementById("stok").value;

            const bukuBaru = {
                kodeLokasi: "BARU",
                kodeBarang: kodeBaru,
                namaBarang: namaBaru, // Pastikan ini 'namaBaru' (n kecil)
                jenisBarang: "BMP",
                edisi: "1",
                stok: parseInt(stokBaru),
                cover: "" // Set ke string kosong
            };

            tambahKartuStokKeDOM(bukuBaru);
            formTambahStok.reset();
        });

        // Panggil fungsi muat stok saat halaman dibuka
        muatSemuaStok();
    }

}); // <-- Penutup untuk DOMContentLoaded (PALING AKHIR)