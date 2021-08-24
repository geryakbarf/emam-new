var editPlaceFoodList = new Vue({
    el: "#edit-place-food-list",
    template: `
        <div>
            <section class="row justify-content-center">
                <div class="col-lg-6 col-md-8 col-12">
                    <div  class="col-12">
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
                            <label :for="!loading? 'photo': 'no-photo'" class="mx-auto text-red" style="display: inline;cursor:pointer;">Ubah Gambar</label>
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
            headers: {
                'Content-Type': "application/json",
                'authorization': "Bearer " + localStorage.getItem("token")
            },
            options: [],
            loading: false,
            manualInput: true,
            form: {
                name: place.name,
                address: place.address,
                photo: place.photo,
            },
            formTmp: {
                photo: null
            }
        }
    },
    methods: {
        async _onSaveParams() {
            let formData = { manual: this.form, foodListID, placeID: place._id };
            let photoTmp = this.formTmp.photo;
            let photo = formData.photo;
            if (photoTmp) {
                if ((photo && photo.path != photoTmp.name)) {
                    const images = [photo.path]
                    await fetch('/api/v1/delete-images', {
                        method: "DELETE",
                        body: JSON.stringify({ images }),
                        headers: { 'Content-Type': "application/json" }
                    }, );
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
                const params = { method: 'POST', body: formData };
                const res = await fetch('/api/v1/upload-image-s3', params);
                if (res.status != 200) throw Error("Upload photo gagal!");
                const data = await res.json();
                return Promise.resolve(data.data);
            } catch (error) {
                return Promise.reject(error);
            }

        },
        async editPlace(formData) {
            try {
                const res = await fetch(emapi_base + '/v1/foodlist/item-update', {
                    method: "PUT",
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
        loadPhotoFromData: async function() {
            if (!this.form.photo) return;
            const _this = this;
            const fileUrl = this.form.photo.path;
            const res = await fetch(fileUrl);
            const blob = await res.blob();
            const file = new File([blob], fileUrl, { type: blob.type });
            this.formTmp.photo = file;
            let reader = new FileReader();
            reader.onload = function(e) {
                _this.$refs.photo.src = e.target.result
            }
            reader.readAsDataURL(file);
        },
        async onSave() {
            if (!this.isSaveable) return;
            if (this.loading) return;
            this.showSnackbar("Mohon tunggu...", 1000);
            this.loading = true;
            var $this = this;
            try {
                const formData = await this._onSaveParams();
                await this.editPlace(formData);
                this.showSnackbar("Berhasil menambah tempat pada food list", 1000);
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
        showSnackbar: function(text, duration = 3000) {
            Snackbar.show({ pos: 'bottom-center', text, actionTextColor: "#e67e22", duration });
        },
        onPhotoChange: function(e) {
            try {
                let _this = this;
                let [file] = e.target.files;
                if (!file) throw Error("File kosong");
                this.formTmp.photo = file;
                let reader = new FileReader();
                reader.onload = function(e) {
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
            fetch(`${emapi_base}/v1/places?keyword=${escape(search)}&foodListID=${foodListID}`, { method: 'GET', headers: this.headers }).then(res => {
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
        this.loadPhotoFromData();
    }
});