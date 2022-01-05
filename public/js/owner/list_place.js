var app = new Vue({
    el: '#list-place',
    data: {
        _id: _id,
        sideMenuIndex: 0,
        filter: '',
        filterdraft: '',
        filterpublish: '',
        filterupdated: '',
        placeCols: [
            {label: '#'},
            {label: 'Place Name', field: "name"},
            {label: 'Status', field: "is_rejected"},
            {label: 'Action'}
        ],
        placeForm: [],
        places_draft: [],
        places_publish: [],
        places_updated: []
    },
    methods: {
        formatToday: function (date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();
            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;
            return [year, month, day].join('-');
        },

        compareDate: function (lastUpdate, condiiton) {
            var updatedAt = '';
            const unformatToday = this.formatToday(new Date());
            //Format date to YYYY-MM-DD
            const formattedDate = lastUpdate.substring(0, 10);
            const formattedToday = unformatToday.substring(0, 10);
            const hour = lastUpdate.substring(11, 16);
            const formatdate1 = formattedDate.split("-");
            const formatdate2 = formattedToday.split("-");
            //Compare Days Between Date
            const one_day = 1000 * 60 * 60 * 24;
            const date1 = new Date(formatdate1[0], (formatdate1[1] - 1), formatdate1[2]);
            const date2 = new Date(formatdate2[0], (formatdate2[1] - 1), formatdate2[2]);
            const diff = Math.ceil(parseInt((date2.getTime() - date1.getTime()) / (one_day)));
            //If Condition
            if (diff === 0)
                updatedAt = 'Today'
            else if (diff === 1)
                updatedAt = 'Yesterday'
            else if (diff === 2)
                updatedAt = diff + ' days ago'
            else
                updatedAt = lastUpdate
            if (condiiton)
                return updatedAt.substring(0, 10);
            else
                return diff;
        },

        setSideMenuIndex: function (idx) {
            this.sideMenuIndex = idx
        },
        isActiveSideMenu: function (id) {
            return this.sideMenuIndex == id
        },

        loadPlaces: async function () {
            console.log(_id)
            if (!_id) return;
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
                this.places_draft = this.placeForm.filter(e => e.is_rejected == "false");
                this.places_publish = this.placeForm.filter(e => e.is_rejected == "true");

            } catch (error) {
                console.log(error);
            }
        }
    },
    filters: {
        capitalize: function (value) {
            if (!value) return ''
            value = value.toString()
            return value.charAt(0).toUpperCase() + value.slice(1)
        }
    },
    mounted() {
        this.loadPlaces();
    },
})
