Vue.component('v-select', VueSelect.VueSelect);
var formFoodlistApp = new Vue({
    el: "#add-to-list",
    template: `
        <div>
            <section class="row justify-content-center">
                <div class="col-lg-6 col-md-8 col-12">
                    <div class="col-12" v-if="!manualInput">
                        <div class="form-group mt-30">
                            <label>Nama Tempat</label>
                            <v-select v-model="selected" label="name" :filterable="false" :options="options" @search="onSearch">
                                <template slot="no-options">
                                    <span v-if="options.length == 0 && searchKeyword.length == 0">ketikan nama tempat yang ingin di cari</span> 
                                    <span v-if="options.length == 0 && searchKeyword.length > 0">Tempat yang kamu cari ga ada.</span> 
                                </template>
                                <template slot="option" slot-scope="option">
                                <div class="d-center">
                                    {{ option.name }} - {{ option.address }}
                                    </div>
                                </template>
                                <template slot="selected-option" slot-scope="option">
                                    <div class="selected d-center">
                                        {{ option.name }} - {{ option.address }}
                                    </div>
                                </template>
                            </v-select>
                        </div>
                    </div>
              
                    <div class="col-12">
                        <div class="form-group">
                            <button class="btn" :class="[isSaveable ? 'btn-fill' : 'btn-border']" @click="onSave">
                                <i class="fa fa-spinner fa-pulse fa-fw" v-if="loading" style="color: #fff;"></i>
                                <span v-if="!loading">Tambahkan</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>

    `,
    data() {
        return {
            options: [],
            loading: false,
            selected: null,
            searchKeyword: "",
            manualInput: false,
            form: {
                name: "",
                address: "",
                photo: null,
            },
            formTmp: {
                photo: null
            }
        }
    },
    methods: {
        async onSave() {
            if (!this.isSaveable) return;
            if (this.loading) return;
            //Daerah Validasi
            toastr.success("Mohon Tunggu")
            this.loading = true;
            let $this = this;
            try {
                const formData = {placeID: this.selected._id, ownerId};
                console.log(formData);
                const res = await fetch('/api/v1/owners-insert', {
                    method: "POST",
                    body: JSON.stringify(formData),
                    headers: {'Content-Type': "application/json"}
                });
                const data = await res.json();
                if (data.message === "Tempat sudah ada dalam list anda") {
                    toastr.error(data.message)
                    this.loading = false;
                    return;
                } else
                    toastr.success(data.message)
                setTimeout(() => {
                    $this.loading = false;
                    window.location = `/admin/owners/${ownerId}/edit`;
                }, 1000)
            } catch (error) {
                console.log(error);
                this.loading = false;
                toastr.error("Duh ada error, coba tanya Gery Akbar")
            }

        },
        onSearch(search, loading) {
            loading(true);
            this.searchKeyword = search;
            this.search(loading, search, this);
        },
        search: _.debounce((loading, search, vm) => {
            fetch(`/api/v1/searchplaces?keyword=${escape(search)}`, {
                method: 'GET',
                headers: this.headers
            }).then(res => {
                res.json().then(json => (vm.options = json.data));
                loading(false);
            });
        }, 350)
    },
    computed: {
        isSaveable() {
            let condition = false;
            if (!this.manualInput && this.selected) condition = true;
            else if (this.manualInput) condition = true;
            return condition;
        }
    },
    mounted() {
    }
});