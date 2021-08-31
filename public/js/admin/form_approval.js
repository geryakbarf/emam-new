const {QRCanvas: QrCanvas} = qrcanvas.vue;
var app = new Vue({
    el: '#form-approval',
    data: {
        sideMenuIndex: 0,
        search: '',
        isLoading: true,
        operationalTimesStatus: true,
        form: {
            _id: null,
            name: '',
            slug: '',
            city: 'bandung',
            address: '',
            categories: [],
            menu_categories: [],
            parkir: '',
            bio: '',
            is_draft: true,
            is_partner: false,
            is_halal: true,
            is_sticker: false,
            photo: null,
            cuisines: [],
            payments: [],
            facilities: [],
            covid: [],
            galleries: [],
            operationalTimesStatus: true,
            operational_times: [
                {day: 'Senin', openTime: '00:00', closeTime: '00:00', is_open: true, is_24Hours: false},
                {day: 'Selasa', openTime: '00:00', closeTime: '00:00', is_open: true, is_24Hours: false},
                {day: 'Rabu', openTime: '00:00', closeTime: '00:00', is_open: true, is_24Hours: false},
                {day: 'Kamis', openTime: '00:00', closeTime: '00:00', is_open: true, is_24Hours: false},
                {day: 'Jumat', openTime: '00:00', closeTime: '00:00', is_open: true, is_24Hours: false},
                {day: 'Sabtu', openTime: '00:00', closeTime: '00:00', is_open: true, is_24Hours: false},
                {day: 'Minggu', openTime: '00:00', closeTime: '00:00', is_open: true, is_24Hours: false},
            ],
            call_to_actions: [
                {type: "gmaps", value: '', draft: false},
                {type: "whatsapp", value: '', draft: false},
                {type: "instagram", value: '', draft: false},
                {type: "web", value: '', draft: false},
                {type: "grabfood", value: '', draft: false},
                {type: "gofood", value: '', draft: false},
                {type: "checkin", value: '', draft: false},
                {type: "linkmenu", value: '', draft: false},
            ],
            payment_detail: []
        },
        options: {
            cellSize: 8,
            correctLevel: 'H',
            data: '',
        },
        formTmp: {
            place_categories: '',
            payment: '',
            photo: null,
            galleries: []
        },
        formFieldValues: {
            place_categories: [],
            cuisines: [],
            payments: [],
            paymentscat: [],
            facilities: [],
            covid_prot: [],
            parkirs: [
                {
                    id: "5f54e8aa62288f9dcff1c9dd",
                    name: "Motor"
                },
                {
                    id: "5f54e8cb62288f9dcff1ce82",
                    name: "Motor & Mobil"
                }
            ],
            contactType: '',
            contactNumber: ''
        },
        menus: [],
        owner: [],
        ownerCols: [
            {label: '#'},
            {label: 'Nama', field: "name"},
            {label: 'Nomor Kontak', field: "contactNumber"},
            // {label: 'Update Berikutnya', field: "nextUpdate"},
            {label: 'Action'}
        ],
    },
    watch: {
        'form.name': {
            deep: true,
            handler: function (val) {
                let _this = this;
                if (this.form._id == null)
                    setTimeout(function () {
                        if (val.length > 3) {
                            let s = val;
                            if (_this.form.city.length > 0) s += ' ' + _this.form.city;
                            _this.form.slug = slugify(s);
                        } else {
                            _this.form.slug = ''
                        }

                    }, 300);

            }
        },
        'form.city': {
            deep: true,
            handler: function (val) {
                let _this = this;
                if (this.form._id == null)
                    setTimeout(function () {
                        if (_this.form.name.length > 3) {
                            let s = _this.form.name;
                            if (val.length > 0) s += ' ' + val;
                            _this.form.slug = slugify(s);
                        } else {
                            _this.form.slug = ''
                        }

                    }, 100);

            }
        },
    },
    methods: {
        setSideMenuIndex: function (idx) {
            this.sideMenuIndex = idx
        },
        isActiveSideMenu: function (id) {
            return this.sideMenuIndex == id
        },
        onPhotoChange: function (e) {
            try {
                let _this = this;
                let [file] = e.target.files;
                if (!file) throw Error("File kosong");
                this.formTmp.photo = file;
                let reader = new FileReader();
                reader.onload = function (e) {
                    _this.$refs.photo.src = e.target.result
                }
                reader.readAsDataURL(file);
            } catch (error) {
                console.error(error)

            }

        },
        _onSaveParams: async function () {
            this.form.operationalTimesStatus = this.operationalTimesStatus;
            if (placeId)
                this.form._id = placeId;
            let formData = {...this.form};
            if (ownerId && ownerId !== "") {
                formData.is_requested = true;
                formData.is_rejected = "";
            } else {
                formData.is_requested = false;
                formData.is_rejected = "";
            }
            let photoTmp = this.formTmp.photo;
            let photo = formData.photo;
            let [parkir] = this.formFieldValues.parkirs.filter(e => (e.id == formData.parkir));
            formData.parkir = parkir;
            formData.categories = formData.categories.map(e => ({id: e.id, name: e.text}));
            formData.payments = formData.payments.map(e => ({code: e.code, name: e.text}));
            formData.galleries = await this.uploadGalleryImage();
            if (photoTmp) {
                if ((photo && photo.path != photoTmp.name)) {
                    const images = [photo.path]
                    await fetch('/api/v1/delete-images', {
                        method: "DELETE",
                        body: JSON.stringify({images}),
                        headers: {'Content-Type': "application/json"}
                    },);
                    formData.photo = await this.photoUpload();
                } else if ((!photo) || (!formData._id)) {
                    formData.photo = await this.photoUpload();
                }

            }

            return formData;
        },
        onSave: async function (close = false) {
            try {
                const formData = await this._onSaveParams();
                let res = null;
                if (formData._id) res = await this.updatePlace(formData);
                else res = await this.createPlace(formData);
                console.log(res.data);
                if (this.form._id == null)
                    this.form._id = res.data.id;
                toastr.success(res.message)
                if (close) {
                    //menambahkan place ke owner
                    if (ownerId && ownerId !== "") {
                        const formData = {placeID: this.form._id, ownerId: ownerId};
                        const res = await fetch('/api/v1/owners-insert', {
                            method: "POST",
                            body: JSON.stringify(formData),
                            headers: {'Content-Type': "application/json"}
                        });
                        const data = await res.json();
                        toastr.success(data.message)
                    }
                    //
                    let _this = this
                    setTimeout(() => {
                        window.removeEventListener('beforeunload', _this.leaving, true)
                        if (ownerId && ownerId !== "") {
                            window.location = "/panel/owner/places/" + this.form._id + "/edit?nav=" + this.sideMenuIndex
                        } else
                            window.location = "/admin/places/" + this.form._id + "/edit?nav=" + this.sideMenuIndex
                    }, 1000)
                }
            } catch (error) {
                console.log(error);
                toastr.error("Duh ada error, coba tanya Gery Akbar")
            }

        },
        photoUpload: async function () {
            try {
                let formData = new FormData();
                formData.append('file', this.formTmp.photo)
                const params = {method: 'POST', body: formData};
                const res = await fetch('/api/v1/upload-image-s3', params);
                if (res.status != 200) throw Error("Upload photo gagal!");
                const data = await res.json();
                return Promise.resolve(data.data);
            } catch (error) {
                return Promise.reject(error);
            }
        },
        updatePlace: async function (formData) {
            try {
                const res = await fetch('/api/v1/places', {
                    method: "PUT",
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
        loadPhotoFromData: async function () {
            if (!this.form.photo) return;
            const _this = this;
            const fileUrl = this.form.photo.path;
            const res = await fetch(fileUrl);
            const blob = await res.blob();
            const file = new File([blob], fileUrl, {type: blob.type});
            this.formTmp.photo = file;
            let reader = new FileReader();
            reader.onload = function (e) {
                _this.$refs.photo.src = e.target.result
            }
            reader.readAsDataURL(file);
        },
        loadPlace: async function () {
            if (!placeId) return;
            console.log("ID : " + placeId)
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('nav'))
                this.sideMenuIndex = urlParams.get('nav')
            try {
                const res = await fetch(`/api/v1/approvals/${placeId}`);
                const data = await res.json();
                this.form = data.data;
                //
                this.loadPhotoFromData();
                this.isLoading = false;
            } catch (error) {
                console.log(error);
            }
        },
        sendWhatsapp: function (number, type) {
            if (type == "022") {
                toastr.error("Nomor ini tidak terdaftar di whatsapp");
            } else {
                location.href = "https://api.whatsapp.com/send/?phone=62" + number + "&text=Hallo%20kak%2C%20kami%20dari%20emam.id%20ingin%20bertanya%20apakah%20akan%20ada%20pembaharuan%20dari%20tempat%20makan%20kakak%3F%0Akami%20ingin%20memperbarui%20data%20tempat%20makan%20kakak%20yang%20ada%20di%20emam.id&app_absent=0";
            }
        },
        loadOwner: async function () {
            if (!placeId) return;
            try {
                const res = await fetch(`/api/v1/places/${placeId}/owner`);
                const data = await res.json();
                this.owner = data.data;
            } catch (error) {
                console.log(error);
            }
        }
    },
    mounted() {
        this.loadPlace()
        this.loadOwner()
    },
    computed: {
        hasQRIS() {
            var condition = false;
            for (var i = 0; i < this.form.payments.length; i++) {
                if (this.form.payments[i].text == 'QRIS') {
                    condition = true;
                }
            }
            return condition;
        },
        hasDebit() {
            var condition = false;
            for (var i = 0; i < this.form.payments.length; i++) {
                if (this.form.payments[i].text == 'Kartu Debit') {
                    condition = true;
                }
            }
            return condition;
        },
        hasCredit() {
            var condition = false;
            for (var i = 0; i < this.form.payments.length; i++) {
                if (this.form.payments[i].text == 'Kartu Kredit') {
                    condition = true;
                }
            }
            return condition;
        },
        hasCash() {
            var condition = false;
            for (var i = 0; i < this.form.payments.length; i++) {
                if (this.form.payments[i].text == 'Tunai') {
                    condition = true;
                }
            }
            return condition;
        },
        hasOperationalTimes() {
            return this.operationalTimesStatus;
        },
        filteredMenu() {
            return this.menus.filter(menu => {
                return menu.name.toLowerCase().includes(this.search.toLowerCase())
            })
        },
        filteredCategory() {
            return this.form.menu_categories.filter(cate => {
                return this.filteredMenu.map((sel) => {
                    return sel.category
                }).includes(cate)
            })
        }
    },
    created() {
        const image = new Image();
        image.src = 'https://i.ibb.co/0tGxK4T/Logo-Emam-11.png';
        image.onload = () => {
            this.options = Object.assign({}, this.options, {
                logo: {
                    image,
                },
            });
        };
    },
    components: {
        QrCanvas,
        'tinymce': VueEasyTinyMCE,
    },
})
