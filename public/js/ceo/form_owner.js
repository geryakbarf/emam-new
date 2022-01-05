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
