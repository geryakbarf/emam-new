Vue.component('UserSection', UserSection);
Vue.component('WishListTab', WishListTab);
Vue.component('FoodListTab', FoodListTab);
Vue.component('TabSection', TabSection);
var profilePageApp = new Vue({
    el: "#vprofile",
    template: `
        <div class="container">
            <div class="pd-layout-section">
                <div v-if="loading" class="row justify-content-center">
                    <div style="height: 300px; padding: 100px 0;">
                        <i class="fa fa-spinner fa-pulse fa-5x fa-fw" style="color: #e92737;"></i>
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>
                <div v-if="!loading">
                    <user-section :foodlist-count="foodlistCount" />
                    <tab-section :on-tab-change="onTabChange" /> 
                    <section class="section-menu-profile" style="margin-top:0;">
                        <div class="tab-content">
                            <food-list-tab :on-food-list-loaded="onFoodListLoaded" v-if="tabIndex == 1" />
                            <wish-list-tab v-if="tabIndex == 2" />
                        </div>
                    </section>
                </div>
                
            </div>
        </div>

    `,
    data() {
        return {
            loading: false,
            error: null,
            profile: {},
            token: localStorage.getItem('token'),
            tabIndex: 1,
            username,
            foodlistCount: 0
        }
    },
    methods: {
        onTabChange: function(index){
            this.tabIndex = index;
        },
        onFoodListLoaded: function(foodlist){
            this.foodlistCount = foodlist.length;
        },
        loadProfile: function(){
            const $this = this;
            this.loading = true;
            const uri = username? `/v1/profile/${username}`:"/v1/me";
            fetch(emapi_base+ uri,{
                method: "GET",
                headers: {
                    'Content-Type': "application/json",
                    'authorization': "Bearer "+ this.token
                }
            }).then(function(res){
                if(res.status != 200) throw new Error("internal server error");
                return res.json();
            }).then(function(res){
                $this.loading = false;
                const data = res.data;
                $this.profile = {
                    nama: data.nama,
                    avatar: data.avatar,
                    bio: data.bio,
                    username: data.username,
                    _id: data._id
                }
                document.title = `@${data.username} - emam.id`
            }).catch(function(error){
                window.location = "/";
                console.log(error);
            })
        },
    },
    mounted(){
        this.loadProfile();
        const urlParams = new URLSearchParams(window.location.search);
        const tabIndex = urlParams.get('ti');
        if(tabIndex)
            this.tabIndex = tabIndex;

    }
});