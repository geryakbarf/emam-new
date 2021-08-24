const _TabSectionTemplate = `
<section class="section-tab-menu pt-4" id="section-tab-menu">
    <div class="container">
        <div class="row">
            <div class="col-md-12 col-12 box-tab-menu">
                <div class="card-primary card-outline">
                    <div class="card-tabs" style="overflow: auto; white-space: nowrap;">
                        <ul class="nav navbar-tab" id="tab-menu" role="tablist">
                            <li class="nav-item-tab mr-3">
                                <a class="nav-link-tab" :class="[tabIndex == 1 ? 'active':'']" @click="tabChange(1)" href="javascript:void()">Foodlist</a>
                            </li>
                            <li class="nav-item-tab mr-3">
                                <a class="nav-link-tab" :class="[tabIndex == 2 ? 'active':'']" @click="tabChange(2)" href="javascript:void()">Wishlist</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
`;
const TabSection = {
  template: _TabSectionTemplate,
  props: { onTabChange: Function },
  data() {
    return {
      tabIndex: this.$root.tabIndex,
    };
  },
  methods: {
    tabChange: function (index) {
      this.onTabChange(index);
      this.tabIndex = index;
    },
  },
};
