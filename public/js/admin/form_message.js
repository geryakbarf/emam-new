var app = new Vue({
    el: '#form-message',
    data: {
        sideMenuIndex: 0,
        loading: false,
        form: {
            _id: null,
            sender: '',
            receiver: '',
            subject: '',
            message: ''
        },
        owners: [],
        receiverName: '',
        placeId: ''
    },
    methods: {
        validation: function () {
            if(this.form.receiver === "")
              return true;
            else if(this.form.subject === "")
              return true;
            else if(this.form.message === "")
              return true;
            else
              return false;
        },
        _onSaveParams: async function () {
            let formData = {...this.form};
            return formData;
        },
        onSave: async function (close = false) {
            try {
                //Bagian Validasi
                const check = this.validation();
                if (check) {
                    toastr.error("Duh, ada data yang belum keisi!")
                    return
                }
                this.loading = true;
                const formData = await this._onSaveParams();
                let res = null;
                res = await this.createMenu(formData);
                toastr.success(res.message)
                    let request = null;
                    if(subject && subject === "Rejection")
                        request = await this.rejectRequest();
                    else if(subject && subject === "Accepted")
                        request = await this.acceptRequest();
                      let _this = this
                      setTimeout(() => {
                        window.removeEventListener('beforeunload', _this.leaving, true)
                        if (ownerId && ownerId !== "") {
                            window.location = `/panel/owner/message`
                        } else if (ceo && ceo !== ""){
                            window.location = `/panel/ceo/message`
                        } else
                            window.location = `/admin/message`
                        this.loading = false;
                    }, 1000)
            } catch (error) {
                toastr.error("Duh ada error, coba tanya Gery Akbar Fauzi")
                this.loading = false;
            }

        },
        createMenu: async function (formData) {
            try {
                const res = await fetch('/api/v1/message', {
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
        onCancel: function () {
            window.addEventListener('beforeunload', this.leaving, true);
            window.history.back();
        },
        rejectRequest: async function () {
            const res = await fetch('/api/v1/approvals/reject', {
                method: "PUT",
                body: JSON.stringify({_id: placeId, is_rejected : "true"}),
                headers: {'Content-Type': "application/json"}
            });
            if (res.ok) {
              const data = await res.json();
              return Promise.resolve(data);
              } else toastr.error("Failed to reject the ownership");

        },
        acceptRequest: async function () {
            const res = await fetch('/api/v1/approvals/accept', {
                method: "PUT",
                body: JSON.stringify({_id: placeId, is_rejected : "false"}),
                headers: {'Content-Type': "application/json"}
            });
            if (res.ok) {
              const data = await res.json();
              return Promise.resolve(data);
                // this.sendWhatsapp(contactNumber, contactType, "Hallo%20kak%2C%20kami%20dari%20emam.id%20bahwa%20restoran%20anda%20yang%20bernama%20"+placeName+"%20telah%20kami%20terima%20dari%permintaan%20kakak%2E%20Terima%20kasih%20telah%20menjadi%20partner%20kami%21")
            } else toastr.error("Failed to accept the ownership");

        },
        loadData: async function () {
          if(subject && subject !== "")
            this.form.subject = subject;
          if(placeId && placeId !== "")
            this.placeId = placeId;
          if(ceo && ceo !== "")
            this.form.sender = "CEO";
          if(admin && admin !== "")
            this.form.sender = "Admin";
          if(owner && owner !== "")
            this.form.sender = owner;
          if(id && id !== ""){
            this.form.receiver = id;
            const res = await fetch(`/api/v1/owners/${id}`);
            const data = await res.json();
            this.receiverName = data.data.name;
          }
            try {
                const res = await fetch('/api/v1/owners');
                const {data} = await res.json();
                this.owners = data;
                if(!_id) return;
                const message = await fetch(`/api/v1/message/${_id}`);
                const messageData = await message.json();
                this.form = messageData.data;
                this.receiverName = messageData.data.receiverName;
            } catch (error) {
                console.log(error);
            }
        },
        leaving: function (event) {
            event.preventDefault();
            event.returnValue = '';
        },
        isLoading: function () {
            return this.loading;
        }
    },
    mounted() {
        (async () => {
            await this.loadData();
        })()
    }
})
