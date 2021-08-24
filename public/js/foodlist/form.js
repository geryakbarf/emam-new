var formFoodlistApp = new Vue({
  el: "#form-foodlist",
  template: `
    <div class="container">
        <div class="pd-layout-section">
            <section class="section-profile row justify-content-center">
                <div class="col-lg-6 col-md-8 col-12">
                    <div class="text-center" style="display: block">
                        <h4>{{pageTitle}} Foodlist</h4>
                        <img ref="banner" src="/assets/images/emam-menu-no-photos.jpg" class="image-rectangle mx-auto mb-3"
                            style="display: block;">
                        <input id="banner" style="display:none;" type="file" v-on:change="onBannerChange"/>
                        <label :for="!loading? 'banner': 'no-banner'" class="mx-auto text-red" style="display: inline;cursor:pointer;">Ubah cover foodlist</label>
                    </div>
                    <form @submit="onSave">
                        <div class="form-group mt-48">
                            <label>Judul</label>
                            <input type="text" name="nama" v-model="form.nama" :readonly="loading" required class="form-control box-text">
                        </div>
                        <div class="form-group">
                            <label>Deskripsi (Opsional)</label>
                            <textarea class="form-control box-text" name="bio" v-model="form.bio" :readonly="loading" rows="4" style="resize: none;"
                                type="text"></textarea>
                        </div>
                        <div class="form-group">
                            <p class="no-sp" style="font-weight: bold;">Rahasiakan foodlist ini</p>
                            <p class="text-grey">Jadi, hanya anda yang dapat melihatnya.</p>
                            <div class="switch-group">
                                <!-- <span class="my-auto">Public</span> -->
                                <label class="switch">
                                    <input type="checkbox" name="is_private" v-model="form.is_private" :disabled="loading">
                                    <span class="slider round"></span>
                                </label>
                                <!-- <span class="my-auto">Rahasiakan</span> -->
                            </div>
                        </div>
                        <p>anda perlu bantuan? <a href="/about#contactus">hubungi kami</a></p>
                        <a href="javascript:history.back()" v-if="!loading"><button type="button" class="btn btn-border mr-2">Kembali</button></a>
                        <button type="button" class="btn btn-border mr-2" v-if="loading"><i class="fa fa-spinner fa-pulse fa-fw" v-if="loading" style="color: #000;"></i></button>
                        <button type="submit" class="btn btn-fill">
                            <i class="fa fa-spinner fa-pulse fa-fw" v-if="loading" style="color: #fff;"></i>
                            <span v-if="!loading">Simpan</span>
                        </button>
                    </form>
                </div>
            </section>
        </div>
    </div>

    `,
  data() {
    return {
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      loading: false,
      form: {
        _id: foodListID,
        nama: "",
        bio: "",
        banner: null,
        is_private: true,
      },
      formTmp: {
        banner: null,
      },
    };
  },
  methods: {
    onBannerChange: function (e) {
      try {
        let _this = this;
        let [file] = e.target.files;
        if (!file) throw Error("File kosong");
        this.formTmp.banner = file;
        let reader = new FileReader();
        reader.onload = function (e) {
          _this.$refs.banner.src = e.target.result;
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error(error);
      }
    },
    bannerUpload: async function () {
      try {
        let formData = new FormData();
        formData.append("file", this.formTmp.banner);
        const params = { method: "POST", body: formData };
        const res = await fetch("/api/v1/upload-image-s3", params);
        if (res.status != 200) throw Error("Upload photo gagal!");
        const data = await res.json();
        return Promise.resolve(data.data);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    _onSaveParams: async function () {
      let formData = { ...this.form };
      let bannerTmp = this.formTmp.banner;
      let banner = formData.banner;
      if (bannerTmp) {
        if (banner && banner.path != bannerTmp.name) {
          const images = [banner.path];
          await fetch("/api/v1/delete-images", {
            method: "DELETE",
            body: JSON.stringify({ images }),
            headers: { "Content-Type": "application/json" },
          });
          formData.banner = await this.bannerUpload();
        } else if (!banner || !formData._id) {
          formData.banner = await this.bannerUpload();
        }
      }

      return formData;
    },
    createFoodlist: async function (formData) {
      try {
        delete formData._id;
        const res = await fetch(emapi_base + "/v1/foodlist", {
          method: "POST",
          body: JSON.stringify(formData),
          headers: this.headers,
        });
        const data = await res.json();
        if (!res.ok) throw Error(data.message);
        return Promise.resolve(data);
      } catch (error) {
        console.log(error);
        return Promise.reject(error);
      }
    },
    loadBannerFromData: async function () {
      if (!this.form.banner) return;
      const _this = this;
      const fileUrl = this.form.banner.path;
      const res = await fetch(fileUrl);
      const blob = await res.blob();
      const file = new File([blob], fileUrl, { type: blob.type });
      this.formTmp.banner = file;
      let reader = new FileReader();
      reader.onload = function (e) {
        _this.$refs.banner.src = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    updateFoodlist: async function (formData) {
      try {
        const res = await fetch(emapi_base + "/v1/foodlist-update", {
          method: "POST",
          body: JSON.stringify(formData),
          headers: this.headers,
        });
        const data = await res.json();
        if (!res.ok) throw Error(data.message);
        return Promise.resolve(data);
      } catch (error) {
        console.log(error);
        return Promise.reject(error);
      }
    },
    loadFoodlist: async function () {
      if (!foodListID) return;
      try {
        const res = await fetch(
          `${emapi_base}/v1/foodlist-detail?foodlistID=${foodListID}`,
          {
            headers: this.headers,
            method: "GET",
          }
        );
        const { data } = await res.json();
        const { totalPlaces, listPlaces, is_owned, user, ...rest } = data;
        this.form = rest;
        this.loadBannerFromData();
      } catch (error) {
        console.log(error);
      }
    },
    onSave: async function (e) {
      e.preventDefault();
      if (this.loading) return;
      this.showSnackbar("Mohon tunggu...", 1000);
      this.loading = true;
      var $this = this;
      try {
        const formData = await this._onSaveParams();
        let res = null;
        if (formData._id) res = await this.updateFoodlist(formData);
        else res = await this.createFoodlist(formData);
        this.showSnackbar("Berhasil menyimpan food list", 1000);
        setTimeout(() => {
          $this.loading = false;
          window.location = `/foodlist/${res.data._id}`;
        }, 1000);
      } catch (error) {
        console.log(error);
        this.loading = false;
        this.showSnackbar("Gagal menyimpan food list");
      }
    },
    showSnackbar: function (text, duration = 3000) {
      Snackbar.show({
        pos: "bottom-center",
        text,
        actionTextColor: "#e67e22",
        duration,
      });
    },
  },
  computed: {
    pageTitle: function () {
      return this.form._id ? "Ubah" : "Buat";
    },
  },
  mounted() {
    this.loadFoodlist();
  },
});
