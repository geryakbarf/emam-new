var app = new Vue({
    el: '#list-message',
    data: {
        sideMenuIndex: 0,
        filter: '',
        filterupdated: '',
        approvalCols: [
            {label: '#'},
            {label: 'Tanggal', field: "createdAt"},
            {label: 'Dari', field: "receiverName"},
            {label: 'Subjek', field: "subject"},
            {label: 'Action'}
        ],
        outboxCols: [
            {label: '#'},
            {label: 'Tanggal', field: "createdAt"},
            {label: 'Ke', field: "receiverName"},
            {label: 'Subjek', field: "subject"},
            {label: 'Action'}
        ],
        inbox: [],
        outbox: []
    },
    methods: {
        setSideMenuIndex: function (idx) {
            this.sideMenuIndex = idx
        },
        isActiveSideMenu: function (id) {
            return this.sideMenuIndex == id
        },
        loadApprovals: async function () {
            let res = "";
            res = await fetch('/api/v1/message/owner');
            const data = await res.json();
            if (res.ok) {
                this.inbox = data.inbox;
                this.outbox = data.outbox;
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
