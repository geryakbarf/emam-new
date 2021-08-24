Vue.component('v-select', VueSelect.VueSelect);
var formFoodlistApp = new Vue({
    el: "#add-to-foodlist",
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
                                    <span v-if="options.length == 0 && searchKeyword.length > 0">Tempat yang kamu cari ga ada. <a href="javascript:void(0)" @click="toggleManualInput">Klik disini untuk tambah manual.</a></span> 
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
                    <div v-if="manualInput" class="col-12">
                        <div class="form-group">
                            <label>Nama Tempat</label>
                            <input type="text" name="name" v-model="form.name" :readonly="loading" required class="form-control box-text">
                        </div>
                        <div class="form-group">
                            <label>Alamat Tempat (Opsional)</label>
                            <textarea name="address" v-model="form.address" :readonly="loading" class="form-control box-text">
                            </textarea>
                        </div>
                        <div class="form-group">
                            <img ref="photo" src="/assets/images/emam-menu-no-photos.jpg" class="image-rectangle mb-3"
                            style="display: block; width: 150px; height: 150px;">
                            <input id="photo" style="display:none;" type="file" v-on:change="onPhotoChange"/>
                            <label :for="!loading? 'photo': 'no-photo'" class="mx-auto text-red" style="display: inline;cursor:pointer;">Ubah Gambar (Opsional)</label>
                        </div>
                        <p>anda Ingin mencoba menggunakan pencarian lagi? <a href="javascript:void(0)" @click="toggleManualInput">Klik disini</a></p>
                        
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
            headers: {
                'Content-Type': "application/json",
                'authorization': "Bearer " + localStorage.getItem("token")
            },
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
        async _onSaveParams() {
            if (!this.manualInput && this.selected) return {placeID: this.selected._id, foodListID};
            let formData = {manual: this.form, foodListID};
            let photoTmp = this.formTmp.photo;
            let photo = formData.photo;
            if (photoTmp) {
                if ((photo && photo.path != photoTmp.name)) {
                    const images = [photo.path]
                    await fetch('/api/v1/delete-images', {
                        method: "DELETE",
                        body: JSON.stringify({images}),
                        headers: {'Content-Type': "application/json"}
                    },);
                    formData.manual.photo = await this.photoUpload();
                } else if ((!photo) || (!formData._id)) {
                    formData.manual.photo = await this.photoUpload();
                }
            }
            return formData;
        },
        async photoUpload() {
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
        async addPlace(formData) {
            try {
                const res = await fetch(emapi_base + '/v1/foodlist-insert', {
                    method: "POST",
                    body: JSON.stringify(formData),
                    headers: this.headers
                });
                const data = await res.json();
                if (!res.ok) throw Error(data.message);
                return Promise.resolve(data);
            } catch (error) {
                console.log(error);
                return Promise.reject(error);
            }
        },
        async onSave() {
            if (!this.isSaveable) return;
            if (this.loading) return;
            //Daerah Validasi
            if (this.manualInput === true) {
                if (this.form.name === "" || this.form.name.length < 1) {
                    swal("Nama tempat tidak boleh kosong!", "Harap untuk mengisi nama tempat makan");
                    return;
                }
            }
            this.showSnackbar("Mohon tunggu...", 1000);
            this.loading = true;
            var $this = this;
            try {
                const formData = await this._onSaveParams();
                const data = await this.addPlace(formData);
                if (data.message === "Tempat sudah ada dalam foodlist anda") {
                    this.showSnackbar(data.message, 1000)
                    this.loading = false;
                    return;
                }
                else
                    this.showSnackbar("Berhasil menambahkan tempat makan ke foodlist", 1000);
                setTimeout(() => {
                    $this.loading = false;
                    window.location = `/foodlist/${foodListID}`;
                }, 1000)
            } catch (error) {
                console.log(error);
                this.loading = false;
                this.showSnackbar("Gagal menambah tempat pada food list");
            }

        },
        showSnackbar: function (text, duration = 3000) {
            Snackbar.show({pos: 'bottom-center', text, actionTextColor: "#e67e22", duration});
        },
        toggleManualInput() {
            this.form.name = this.searchKeyword;
            this.manualInput = this.manualInput ? false : true;
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
        onSearch(search, loading) {
            loading(true);
            this.searchKeyword = search;
            this.search(loading, search, this);
        },
        search: _.debounce((loading, search, vm) => {
            fetch(`${emapi_base}/v1/places?keyword=${escape(search)}&foodListID=${foodListID}`, {
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