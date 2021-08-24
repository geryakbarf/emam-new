const _FoodListTabTemplate = `
<div class="tab-pane fade show active" id="layout-tab-foodlist">
    <div v-if="loading" class="row justify-content-center">
        <div style="height: 300px; padding: 100px 0;">
            <i class="fa fa-spinner fa-pulse fa-5x fa-fw" style="color: #e92737;"></i>
            <span class="sr-only">Loading...</span>
        </div>
    </div>
    <div class="row" v-if="!loading">
        <div class="col-lg-12 col-md-12 col-sm-12 col-12 my-1 text-center" v-if="foodlist.length == 0">
            <p>Tidak ada food list tempat makan :(</p>
            <a href="/foodlist/new" v-if="!username" class="btn btn-fill">Buat food list</a>
        </div>
        <div class="col-lg-12 col-md-12 col-sm-12 col-12 my-1" v-if="foodlist.length > 0">
            <a href="/foodlist/new" v-if="!username" class="btn btn-fill" style="margin-bottom: 5px;">Tambah food list</a>
        </div>
        <div class="col-lg-3 col-6 mb-4" v-for="list of foodlist">
            <div class="card-link">
                <a :href="'/foodlist/'+list._id">
                    <div class="card-foodlist" :style="foodlistBanner(list.banner)">
                    </div>
                    <h5 class="mt-2"
                        style="font-size: 14px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical;">
                        <b>{{list.nama}}</b></h5>
                    <p class="inline" style="font-size: 14px; color: #000;">{{placeCount(list.listPlaces)}} Tempat</p>
                    <!-- <p class="inline" style="font-size: 14px; color: #A5A3A3;">5w</p> -->
                </a>
            </div>
        </div>
    </div>
</div>
`
const FoodListTab = {
    template: _FoodListTabTemplate,
    props: {onFoodListLoaded: Function},
    data() {
        return {
            loading: false,
            foodlist: [],
            username: this.$root.username,
            uid: this.$root.profile._id
        };
    },
    methods: {
        loadFoodlist: function() {
            const $this = this;
            const uri = username ? `/v1/foodlist?ownerID=${this.uid}` : "/v1/foodlist-my";
            this.loading = true;
            fetch(emapi_base+uri, {
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
                $this.foodlist = data;
                $this.onFoodListLoaded(data);
            }).catch(function(error){
                $this.loading = false;
                console.error(error);
            })
        },
        placeCount: function(listPlaces){
            return listPlaces ? listPlaces.length: 0;
        },
        foodlistBanner: function(banner){
            let imageURL = banner ? banner.path: '/assets/images/emam-cafe.png';
            return `background-image: url('${imageURL}')` ;
        }
    },
    mounted(){
        this.loadFoodlist();
    }
}