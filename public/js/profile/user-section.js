const _UserSectionTemplate = `
<section class="section-profile row justify-content-center">
    <div class="col-lg-3 text-center">
        <img v-bind:src="profile.avatar ? profile.avatar : '/assets/images/emam-coffee-shop.png'" class="rounded-circle m-2"
            style="object-fit: cover; display: inline;" width="170" height="170">
    </div>
    <div class="col-lg-9 layout-data-profile">
        <H4>{{ profile.nama }}</H4>
        <p class="mb-3">@{{profile.username}}</p>
        <div class="layout-stats">
            <p class="inline stat-profile"><b>{{foodlistCount}} </b>foodlist</p>
        </div>
        <p class="mt-3 no-sp" style="color: #4C4C4C;">Bandung, Indonesia</p>
        <p class="no-sp">{{profile.bio}}</p>
        <!--
        <a href="/profile"><button class="btn btn-grey mr-2">Pengaturan & Privasi</button></a>
        <div class="dropdown-share show my-auto inline">
            <a aria-expanded="false" aria-haspopup="true" class="dropdown-toggle my-auto"
                data-toggle="dropdown" href="#" id="dropdownMenuLink" role="button"
                style="text-decoration: none; color: #000;">
                <button class="btn btn-grey">Share</button>
            </a>
            <div aria-labelledby="dropdownMenuLink" class="dropdown-menu mt-3" style="max-width: 150px"
                disabled>
                <table style="width: 100%;" class="text-center">
                    <tr>
                        <td>
                            <a href="">
                                <div class="social-media">
                                    <img alt="" class="img-sosial-media m-2" height="30" width="30"
                                        src="/assets/images/emam-instagram.svg">
                                    <p class="inline">Instagram</p>
                                </div>
                            </a>
                        </td>
                    </tr>
                </table>
            </div>
        </div> -->
    </div>
</section>
`
const UserSection = {
    template: _UserSectionTemplate,
    props: {foodlistCount: Number},
    data() {
        return {
            profile: this.$root.profile,
        };
    },
    mounted(){
        
    }
}