const _WishListTabTemplate = `
<div class="tab-pane fade show active" id="layout-tab-wishlist">
    <div v-if="loading" class="row justify-content-center">
        <div style="height: 300px; padding: 100px 0;">
            <i class="fa fa-spinner fa-pulse fa-5x fa-fw" style="color: #e92737;"></i>
            <span class="sr-only">Loading...</span>
        </div>
    </div>
    <div class="row" v-if="!loading">
        <div class="col-lg-12 col-md-12 col-sm-12 col-12 my-1 text-center" v-if="wishlist.length == 0">
            <p>Tidak ada wish list tempat makan :(</p>
            <a href="/explore" v-if="!username" class="btn btn-fill">Cari tempat makan</a>
        </div>
        <div class="col-lg-12 col-md-12 col-sm-12 col-12 my-1" v-if="wishlist.length > 0">
            <a href="/explore" v-if="!username" class="btn btn-fill">Tambah wish list</a>
        </div>
        <div class="col-lg-3 col-md-4 col-sm-6 col-6 my-1 card-container" v-for="place of wishlist">
            <div class="card-group" style="height: 100%;">
                <div class="layout-btn-absolute">
                    <a href="javascript:void(0)" @click="onLoveButtonPressed(place._id)">
                        <div class="btn-icon inlineblock mx-1">
                            <img :src="'/assets/images/icon/emam-host-like-'+(!username ? 'active': 'default')+'.svg'"
                                alt="like button">
                        </div>
                    </a>
                </div>
                <a :href="'/p/'+place.slug">
                    <div class="card-layout">
                        <div class="card-box">
                            <div class="img-box">
                                <img alt="Photo Tempat" class="img-tempatmakan"
                                    :src="place.photo? place.photo.path :'/assets/images/emam-menu-no-photos.jpg'" />
                            </div>
                            <div class="card-body">
                                <h4 class="txt-h-nama-tempatmakan">{{place.name}}</h4>
                                <p class="txt-alamat-tempatmakan">{{place.address}}</p>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    </div>
</div>
`
const WishListTab = {
    template: _WishListTabTemplate,
    data() {
        return {
            wishlist: [],
            loading: false,
            username: this.$root.username
        };
    },
    methods: {
        loadWishlist: function() {
            const $this = this;
            const url = emapi_base+"/v1/wishlist?ownerID="+this.$root.profile._id;
            this.loading = true;
            fetch(url, {
                method: "GET",
                headers: {
                    'Content-Type': "application/json",
                    'authorization': "Bearer "+ this.$root.token
                }
            }).then(function(res){
                if(res.status == 500) throw new Error("internal server error");
                return res.json();
            }).then(function(res){
                $this.loading = false;
                const data = res.data;
                $this.wishlist = data;
            }).catch(function(error){
                $this.loading = false;
                console.error(error);
            })
        },
        onLoveButtonPressed: function(placeID) {
            const $this = this;
            if(!this.$root.token){
                Snackbar.show({ pos: 'bottom-center', text: "Anda belum login.", actionTextColor: "#e67e22", duration: 2000 });
                setTimeout(function(){
                  window.location = "/auth";
                },2000)
            
                return
              }
            if(confirm("Apa anda yakin akan menghapus tempat makan ini dari wishlist?")){
                this.loading = true;
                fetch(emapi_base + "/v1/wishlist-remove",{
                    method: "POST",
                    body: JSON.stringify({placeID}),
                    headers: {
                        'Content-Type': "application/json",
                        'authorization': "Bearer "+this.$root.token
                    }
                  }).then(function(res){
                      if(res.status == 500) throw new Error("internal server error");
                      return res.json();
                  }).then(function(res){
                      $this.loadWishlist();
                  }).catch(function(error){
                    console.log(error);
                    $this.loading = false;
                  })
            }
        }
    },
    mounted(){
        this.loadWishlist();
    }
}