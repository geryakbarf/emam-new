var app = new Vue({
    el: '#form-tell',
    data: {
        form: {
            slug: placeID,
            nama: '',
            email: '',
            subject: '',
            pesan: ''
        },
        robot: true
    },
    watch: {},
    methods: {
        validEmail: function (email) {
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        },
        validation: function (formData) {
            //validasi Nama
            if (formData.nama.length < 1) {
                swal("Nama kosong", "Mohon masukan nama anda!", "error");
                return false;
            }
            //validasi email
            if (!this.validEmail(formData.email)) {
                swal("Alamat email salah", "Mohon masukan alamat email yang benar!", "error");
                return false;
            }
            //validasi jika email kosong
            if (formData.email.length < 1) {
                swal("Email kosong", "Mohon masukan alamat email anda!", "error");
                return false;
            }
            //validasi subject
            if (formData.subject === 'Choose option' || formData.subject.length < 1) {
                swal("Kasih tahu kosong", "Harap pilih kesalahan apa yang ingin anda kasih tahu!", "error");
                return false;
            }
            //validasi pesan
            if (formData.pesan.length < 1) {
                swal("Pesan kosong", "Harap isi pesan!", "error");
                return false;
            }
            return true

        },
        onSave: async function (close = false) {
            console.log(this.robot);
            let formData = {...this.form};
            let validasi = this.validation(formData);
            if (!validasi)
                return false;
            if (this.robot) {
                swal("Oppss!", "Verifikasi robot belum valid.", "error");
                return false;
            }

            try {
                let res = await this.sendEmail(formData);
                swal("Terima kasih!", "Kami akan segera membaca feedback dari anda!", "success");
                if (close) {
                    let _this = this
                    setTimeout(() => {
                        window.removeEventListener('beforeunload', _this.leaving, true)
                        window.location = "/p/" + formData.slug
                    }, 1000)
                }
            } catch (error) {
                console.log(error);
                swal("Oppss!", "Terjadi kesalaham mohon hubungi admin emam.", "error");
            }
        },
        sendEmail: async function (formData) {
            try {
                const res = await fetch('/api/v1/tell-us', {
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
