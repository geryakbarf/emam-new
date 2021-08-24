var app = new Vue({
    el: '#form-claim',
    data: {
        form: {
            placeId: placeID,
            placeName: placeName,
            ownerName: '',
            ownerPhoneNumber: '',
            placeAddress: '',
            operational_times: [
                {day: 'Senin', openTime: '00:00', closeTime: '00:00', is_open: false},
                {day: 'Selasa', openTime: '00:00', closeTime: '00:00', is_open: false},
                {day: 'Rabu', openTime: '00:00', closeTime: '00:00', is_open: false},
                {day: 'Kamis', openTime: '00:00', closeTime: '00:00', is_open: false},
                {day: 'Jumat', openTime: '00:00', closeTime: '00:00', is_open: false},
                {day: 'Sabtu', openTime: '00:00', closeTime: '00:00', is_open: false},
                {day: 'Minggu', openTime: '00:00', closeTime: '00:00', is_open: false},
            ],
        },
        robot: true
    },
    watch: {},
    methods: {
        validation: function (formData) {
            //validasi Nama Manager
            if (formData.ownerName.length < 1) {
                swal("Nama Pemilik Kosong", "Mohon masukan nama pemilik atau manajer!", "error");
                return false;
            }
            //validasi nomor kontak
            if (formData.ownerPhoneNumber.length < 1) {
                swal("Nomor Telepon Kosong", "Mohon masukan nomor telepon untuk dihubungi!", "error");
                return false;
            }
            //validasi jika form kontak dimasukin selain angka
            if (isNaN(formData.ownerPhoneNumber)) {
                swal("Nomor Telepon Salah", "Mohon masukan nomor telepon yang benar!", "error");
                return false;
            }
            //validasi alamat
            if (formData.placeAddress.length < 1) {
                swal("Alamat tempat Kosong", "Mohon masukan alamat tempat!", "error");
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
                swal("Terima kasih!", "Anda Akan Segera Di Direct ke Aplikasi Whatsapp", "success");
                if (close) {
                    let _this = this
                    setTimeout(() => {
                        window.removeEventListener('beforeunload', _this.leaving, true)
                        location.href = "https://api.whatsapp.com/send/?phone=6285156688480&text=" + res.data.message + "&app_absent=0"
                        // window.location = "/p/" + formData.placeId
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
