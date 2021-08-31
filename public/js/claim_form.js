var app = new Vue({
    el: '#form-claim',
    data: {
        form: {
            placeId: placeID,
            placeName: placeName,
            name: '',
            contactType: '',
            contactNumber: '',
            username: '',
            password: '',
            placesId : []
        },
        ownerConfirmPassword : "",
        robot: true
    },
    watch: {},
    methods: {
        validation: function (formData) {
            //validasi Nama Manager
            if (formData.name.length < 1) {
                swal("Nama Pemilik Kosong", "Mohon masukan nama pemilik atau manajer!", "error");
                return false;
            }
            // validasi jika form jenis kontak belum ada
            if (!formData.contactType) {
                swal("Jenis Nomor Telepon Kosong", "Mohon masukan jenis nomor telepon dengan benar!", "error");
                return false;
            }
            //validasi nomor kontak
            if (formData.contactNumber.length < 1) {
                swal("Nomor Telepon Kosong", "Mohon masukan nomor telepon untuk dihubungi!", "error");
                return false;
            }
            //validasi jika form kontak dimasukin selain angka
            if (isNaN(formData.contactNumber)) {
                swal("Nomor Telepon Salah", "Mohon masukan nomor telepon yang benar!", "error");
                return false;
            }
            //validasi alamat
            //validasi jika form username dimasukin kosong
             if (!formData.username) {
                 swal("Username anda tidak valid", "Mohon masukan username yang benar!", "error");
                 return false;
             }
             //validasi jika form password dimasukin salah
             if (formData.password.length < 5) {
                 swal("Password yang diinputkan masih lemah", "Pastikan password yang diisi diantara 5-20!", "error");
                 return false;
             }
             if (formData.password != this.ownerConfirmPassword) {
                 swal("Password dan Konfirmasi Password anda tidak valid", "Pastikan password yang diisi sudah benar!", "error");
                 return false;
             }
            return true

        },
        onSave: async function (close = false) {
            console.log(this.robot);
            let formData = {...this.form};
            var validasi = this.validation(formData);

            if (!validasi)
                return false;
            if (this.robot) {
                swal("Oppss!", "Verifikasi robot belum valid.", "error");
                return false;
            }

            try {
                let res = await this.insertClaim(formData);
                swal("Terima kasih!", "Anda Akan Segera Di Direct ke Halaman Login", "success");
                if (close) {
                    let _this = this
                    setTimeout(() => {
                        window.removeEventListener('beforeunload', _this.leaving, true)
                        window.location = "/panel/owner/login"
                    }, 1000)
                }
            } catch (error) {
                console.log(error);
                swal("Oppss!", "Terjadi kesalaham mohon hubungi admin emam.", "error");
            }
        },
        insertClaim: async function (formData) {
            try {
                const res = await fetch('/api/v1/claim/send-claim', {
                    method: "POST",
                    body: JSON.stringify(formData),
                    headers: {'Content-Type': "application/json"}
                });
                const data = await res.json();
                return Promise.resolve(data);
            } catch (error) {
                console.log(error);
                return Promise.reject(error);
            }
        },
        onVerify: function (response) {
            if (response) this.robot = false;
        }

    },
    mounted() {
        window.addEventListener('beforeunload', this.leaving, true);
    },
    components: {
        'vue-recaptcha': VueRecaptcha
    },
})
