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
            placesId: []
        },
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
            {label: 'Total Views', field: "views"},
            {label: 'Action'}
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
                if (this.form.subscription !== "")
                    this.form.subsDate = new Date();
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
                if(this.placeForm.views === null || this.placeForm.views === "")
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
                    window.location = `/admin/owners`
                } else toastr.error("Failed to delete data");
            } else {

            }

        },
    },
    mounted() {
        this.loadOwner()
        this.loadPlace()
    },
    computed: {}
})