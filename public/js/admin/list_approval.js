var app = new Vue({
    el: '#list-approval',
    data: {
        admin : username,
        sideMenuIndex: 0,
        filter: '',
        filterupdated: '',
        approvalCols: [
            {label: '#'},
            {label: 'Place Name', field: "name"},
            {label: 'Index', field: "idx"},
            {label: 'Verified', field: "is_partner"},
            {label: 'Sticker', field: "is_sticker"},
            {label: 'Last Update', field: "updatedAt"},
            {label: 'Action'}
        ],
        approvals: [],
        approvals_updated: []
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

        updateTime: async function (id, name) {
            const res = await fetch('/api/v1/places', {
                method: "PUT",
                body: JSON.stringify({_id: id, name}),
                headers: {'Content-Type': "application/json"}
            });
            if (res.ok) {
                toastr.success("Success to update time")
                this.loadPlaces();
            } else toastr.error("Failed to delete data");

        },
        loadApprovals: async function () {
            const res = await fetch('/api/v1/approvals');
            const data = await res.json();
            if (res.ok) {
                this.approvals = data.data;
                for (var i = 0; i < this.approvals.length; i++) {
                    //Anti undefined
                    if (!this.approvals[i].is_sticker)
                        this.approvals[i].is_sticker = false
                    this.approvals[i].lastUpdate = this.compareDate(this.approvals[i].updatedAt, false);
                    this.approvals[i].updatedAt = this.compareDate(this.approvals[i].updatedAt, true);
                    this.approvals[i].idx = i + 1;
                }
                this.approvals_updated = this.approvals.filter(e => e.lastUpdate <= 2 && !e.is_requested);
            } else toastr.error("Failed to retrive data");
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
        this.loadApprovals();
    },
})
