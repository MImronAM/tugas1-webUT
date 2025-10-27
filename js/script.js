

document.addEventListener("DOMContentLoaded", function() {

    // HALAMAN LOGIN (index.html) 
    const loginForm = document.getElementById("loginForm");
    if (loginForm) { 
        
        loginForm.addEventListener("submit", function(event) {
            event.preventDefault(); 
            const emailInput = document.getElementById("email").value;
            const passwordInput = document.getElementById("password").value;
            
            let userDitemukan = false;
            let namaUser = "Pengguna"; 

            for (let i = 0; i < dataPengguna.length; i++) {
                if (dataPengguna[i].email === emailInput && dataPengguna[i].password === passwordInput) {
                    userDitemukan = true;
                    namaUser = dataPengguna[i].nama;
                    break;
                }
            }
            
            // Validasi dan Aksi 
            if (userDitemukan) {
                sessionStorage.setItem('namaUserLogin', namaUser);
                window.location.href = "dashboard.html";
            } else {
                alert("email/password yang anda masukkan salah");
            }
        }); 
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
        document.getElementById("closeLupa").addEventListener("click", () => modalLupa.classList.remove("show"));
        document.getElementById("closeDaftar").addEventListener("click", () => modalDaftar.classList.remove("show"));
    
    } 

    //  LOGOUT (BERLAKU DI SEMUA HALAMAN) 
    const btnLogout = document.getElementById("btnLogout");
    if (btnLogout) {
        
        btnLogout.addEventListener("click", function(event) {
            event.preventDefault(); 
            const konfirmasi = window.confirm("Apakah Anda yakin ingin logout?");
            if (konfirmasi) { 
                sessionStorage.removeItem('namaUserLogin');
                window.location.href = "index.html";
            }
           
        });
    }

    // HALAMAN DASHBOARD (dashboard.html) 
    const sapaanSpan = document.getElementById("sapaan");
    if (sapaanSpan) {
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
        const namaPenggunaSpan = document.getElementById("namaPengguna");
        const namaUser = sessionStorage.getItem('namaUserLogin');
        if (namaUser) {
            namaPenggunaSpan.textContent = namaUser;
        }
    }

    // HALAMAN TRACKING (tracking.html) 
    const trackingForm = document.getElementById("trackingForm");
    if (trackingForm) {
        
        trackingForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const nomorDO = document.getElementById("nomorDO").value;
            const hasilContainer = document.getElementById("hasil-tracking");
            const data = dataTracking[nomorDO];

            if (data) {
                let perjalananHTML = '<ol class="timeline">';
                data.perjalanan.forEach(item => {
                    perjalananHTML += `
                        <li>
                            ${item.keterangan}
                            <span>${item.waktu}</span>
                        </li>
                    `;
                });
                perjalananHTML += '</ol>';

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

                hasilContainer.style.display = "block";
            } else {
                alert(`Nomor DO "${nomorDO}" tidak ditemukan.`); 
                hasilContainer.innerHTML = ""; 
                hasilContainer.style.display = "none"; 
            }
        });
    }

    //  HALAMAN STOK (stok.html) 
    const stokContainer = document.getElementById("stok-container");
    if (stokContainer) {
        function muatSemuaStok() {
            stokContainer.innerHTML = "";
            dataBahanAjar.forEach(buku => {
                tambahKartuStokKeDOM(buku);
            });
        }
        function tambahKartuStokKeDOM(buku) {
            const card = document.createElement("div");
            card.className = "stok-card";
            let coverImageHTML = ""; 
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
        const formTambahStok = document.getElementById("form-tambah-stok");
        formTambahStok.addEventListener("submit", function(e) {
            e.preventDefault();
            
            const kodeBaru = document.getElementById("kodeBarang").value;
            const namaBaru = document.getElementById("namaBarang").value;
            const stokBaru = document.getElementById("stok").value;

            const bukuBaru = {
                kodeLokasi: "BARU",
                kodeBarang: kodeBaru,
                namaBarang: namaBaru, 
                jenisBarang: "BMP",
                edisi: "1",
                stok: parseInt(stokBaru),
                cover: "" 
            };

            tambahKartuStokKeDOM(bukuBaru);
            formTambahStok.reset();
        });
        muatSemuaStok();
    }
}); 