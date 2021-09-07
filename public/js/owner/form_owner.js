var app = new Vue({
    el: '#form-owner',
    data: {
        sideMenuIndex: 0,
        form: {
            _id: null,
            name: "",
            contact: "",
            subscription: "",
            contactType: "",
            contactNumber: "",
            addons: "",
            subsDate: "",
            addonsDate: "",
            addonsEndDate: "",
            oriaddonsDate: "",
            orisubsDate: "",
            username: "",
            password: "",
            placesId: []
        },
        repassword: "",
        placeForm: {
            _id: null,
            name: '',
            photo: null,
            views: null
        },
        filter: '',
        filterdraft: '',
        filterpublish: '',
        filterupdated: '',
        placeCols: [
            {label: '#'},
            {label: 'Place Name', field: "name"},
            {label: 'Total Views', field: "views"}
        ]
    },
    methods: {
        setSideMenuIndex: function (idx) {
            this.sideMenuIndex = idx
        },
        isActiveSideMenu: function (id) {
            return this.sideMenuIndex == id
        },
        onCancel: function () {
            window.addEventListener('beforeunload', this.leaving, true);
            window.location = `/admin/owners`
        },
        onSave: async function (close = false) {
            try {
                if (this.form.addons !== "")
                    this.form.addonsDate = new Date();
                else if (this.form.addons === "")
                    this.form.addonsDate = "";
                if (this.form.subscription !== "")
                    this.form.subsDate = new Date();
                else if (this.form.subscription === "")
                    this.form.subsDate = "";
                let formData = {...this.form};
                let res = null;
                if (formData._id) res = await this.updateOwner(formData);
                else res = await this.addOwner(formData);
                if (this.form._id == null)
                    this.form._id = res.data.id;
                toastr.success(res.message)
                if (close) {
                    let _this = this
                    setTimeout(() => {
                        window.removeEventListener('beforeunload', _this.leaving, true)
                        if (ceo && ceo !== ""){
                            window.location = "/panel/ceo/owners/" + this.form._id + "/edit?nav=" + this.sideMenuIndex
                        } else if(owner && owner !== ""){
                            window.location = "/panel/owner/owners/" + this.form._id + "/edit?nav=" + this.sideMenuIndex
                        } else
                            window.location = "/admin/owners/" + this.form._id + "/edit?nav=" + this.sideMenuIndex
                    }, 1000)
                }
            } catch (e) {
                console.log(e)
                toastr.error("Duh ada error, coba tanya Gery Akbar")
            }

        },
        addOwner: async function (formData) {
            try {
                const res = await fetch('/api/v1/owners', {
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
        deletePlaces: function (id) {
            this.form.placesId = this.form.placesId.filter(e => e !== id);
            this.placeForm = this.placeForm.filter(e => e._id !== id)
        },
        loadOwner: async function () {
            if (!_id) return;
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('nav'))
                this.sideMenuIndex = urlParams.get('nav')
            try {
                const res = await fetch(`/api/v1/owners/${_id}`);
                const data = await res.json();
                this.form = data.data;
            } catch (error) {
                console.log(error);
            }
        },
        updateOwner: async function (formData) {
          if(owner && owner !== ""){
            if(this.form.password !== this.repassword){
                toastr.error("Password dan konfirmasi password harus sama!")
                return;
            }
            if(this.form.password === ""){
              toastr.error("Password tidak boleh kosong!")
              return;
            }
          }
            try {
                const res = await fetch('/api/v1/owners', {
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
        loadPlace: async function () {
            if (!_id) return;
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('nav'))
                this.sideMenuIndex = urlParams.get('nav')
            try {
                const resultOwner = await fetch(`/api/v1/owners/${_id}`);
                const dataOwner = await resultOwner.json();
                let formData = dataOwner.data;
                const res = await fetch('/api/v1/places/owner', {
                    method: "POST",
                    body: JSON.stringify(formData),
                    headers: {'Content-Type': "application/json"}
                });
                const data = await res.json();
                this.placeForm = data.data;
                if (this.placeForm.views === null || this.placeForm.views === "")
                    this.placeForm.views = 0;
            } catch (error) {
                console.log(error);
            }
        },
        onDeleteData: async function () {
            if (confirm('Are you sure want to delete this data?')) {
                const res = await fetch(`/api/v1/owners-delete/${_id}`, {method: "DELETE"});
                if (res.ok) {
                    toastr.success("Success to delete data")
                    if (ceo && ceo !== ""){
                        window.location = "/panel/ceo/"
                    } else
                        window.location = "/admin/owners/"
                } else toastr.error("Failed to delete data");
            } else {

            }

        },
        onRegister: async function () {
            if(this.form.password !== this.repassword){
                toastr.error("Password dan Re-password harus sama!")
                return;
            }
            let formData = {...this.form};
            try {
                const res = await fetch('/api/v1/owners', {
                    method: "POST",
                    body: JSON.stringify(formData),
                    headers: {'Content-Type': "application/json"}
                });
                const data = await res.json();
                if (res.ok) {
                    toastr.success("Berhasil mendaftar! Silahkan login")
                    let _this = this
                    setTimeout(() => {
                        window.removeEventListener('beforeunload', _this.leaving, true)
                        window.location = "/panel/owner/login"
                    }, 1000)
                }
                else {
                    toastr.error("Terjadi kesalahan saat mendaftar, harap ganti username anda atau periksa koneksi anda!")
                }
            } catch (error) {
                console.log(error);
                toastr.error("Terjadi kesalahan saat mendaftar, harap ganti username anda atau periksa koneksi anda!");
            }
        },
        rejectRequest: async function () {
            const res = await fetch('/api/v1/approvals/reject', {
                method: "PUT",
                body: JSON.stringify({_id: placeId, is_rejected : "true"}),
                headers: {'Content-Type': "application/json"}
            });
            if (res.ok) {
                toastr.success("Success to reject the ownership")
                //this.sendWhatsapp(contactNumber, contactType, "Hallo%20kak%2C%20kami%20dari%20emam.id%20bahwa%20restoran%20anda%2E%20Mohon%20maaf%2C%20bahwa%20kami%20belum%20dapat%20menyetujui%20permintaan%20kakak%2E%20Kemungkinan%2C%20kami%20memerlukan%20data%20yang%20valid%20dan%20jelas%2E%20Jika%20sudah%20disiapkan%2C%20Kakak%20dapat%20mengulangi%20proses%20klaim%20tempat%20restoran%2E")
            } else toastr.error("Failed to reject the ownership");

        },
        sendWhatsapp: function (number, type, content) {
            if (type == "022") {
                toastr.error("Nomor ini tidak terdaftar di whatsapp");
            } else {
                setTimeout(() => {
                    location.href = "https://api.whatsapp.com/send/?phone=62" + number + "&text="+content+"&app_absent=0";
                }, 1500)
            }
        },
        acceptRequest: async function () {
            const res = await fetch('/api/v1/approvals/accept', {
                method: "PUT",
                body: JSON.stringify({_id: placeId, is_rejected : "false"}),
                headers: {'Content-Type': "application/json"}
            });
            if (res.ok) {
                toastr.success("Success to accept the ownership")
                // this.sendWhatsapp(contactNumber, contactType, "Hallo%20kak%2C%20kami%20dari%20emam.id%20bahwa%20restoran%20anda%20yang%20bernama%20"+placeName+"%20telah%20kami%20terima%20dari%permintaan%20kakak%2E%20Terima%20kasih%20telah%20menjadi%20partner%20kami%21")
            } else toastr.error("Failed to accept the ownership");

        }
    },
    mounted() {
        this.loadOwner()
        this.loadPlace()
    },
    computed: {}
})
