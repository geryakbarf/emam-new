$(".swiper-wrapper .swiper-slide").click(function () {
    $(".swiper-slide").removeClass("active");
    $(this).addClass("active");
});
var swiper = new Swiper('.swiper-container', {
    spaceBetween: 10,
    slidesPerView: 'auto',
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});

function menuSubNavSwitch(cat) {
    if(cat == "all"){
        menu_categories.forEach(e => {
            $(`[data-cat-target='${e}']`).show();
        });
    } else {
        menu_categories.filter(e => e != cat)
        .forEach(e => {
            $(`[data-cat-target='${e}']`).hide();
        })

        $(`[data-cat-target='${cat}']`).show();
        
    }
}