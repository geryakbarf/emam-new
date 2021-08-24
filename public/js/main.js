(function ($) {
  $(document).ready(function () {
    $("#tab-menu a").click(function (e) {
      e.preventDefault();
      $(this).tab("show");
    });
  });

  var $btn = $("#btntoTop");
  $(window).on("scroll", function () {
    var scroll = $(window).scrollTop();
    if (scroll < 80) {
      $btn.hide();
    } else {
      $btn.show();
      $btn.click(function () {
        $(window).scrollTop(0);
      });
    }
  });

  //info selengkapnya
  $("#txt-selengkapnya").click(function () {
    $(".layout-info-lengkap").toggle();
    // $(".txt-info-selengkapnya").toggle();
    if ($(this).text() == "Sembunyikan Info") {
      $(this).html("Info Selengkapnya<i class='fa fa-caret-down ml-2'></i>");
    } else {
      $(this).html("Sembunyikan Info<i class='fa fa-caret-up ml-2'></i>");
    }
  });

  //info pembayaran
  // $(".txt-metode-pembayaran").click(function () {
  //   $(".layout-pembayaran").toggle();
  // });

  $(document).ready(function () {
    $("#tab-pembayaran a").click(function (e) {
      e.preventDefault();
      $(this).tab("show");
    });
  });

  //click gambar
  $("#thumbs img").click(function () {
    $("#img-main").attr("src", $(this).attr("src"));
    $(".popup-imgset-covid19").removeClass("active");
    $(this).addClass("active");
    // $('#description').html($(this).attr('alt'));
  });

  try {
    var selectSimple = $(".js-select-simple");

    selectSimple.each(function () {
      var that = $(this);
      var selectBox = that.find("select");
      var selectDropdown = that.find(".select-dropdown");
      selectBox.select2({
        dropdownParent: selectDropdown,
      });
    });
  } catch (err) {
    console.log(err);
  }

  $("html, body").hide();

  if (window.location.hash) {
    setTimeout(function () {
      $("html, body").scrollTop(0).show();
      $("html, body").animate(
          {
            scrollTop: $(window.location.hash).offset().top - 100,
          },
          1000
      );
    }, 0);
  } else {
    $("html, body").show();
  }
})(jQuery);

window.onscroll = function () {
  myFunction();
};
function myFunction() {
  var layout = document.getElementById("layout-slider-menu");
  var navbar = document.getElementById("section-slider-menu");
  if(!navbar && !layout) return;
  var sticky = layout.offsetTop;
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky");
  } else {
    navbar.classList.remove("sticky");
  }
}

function debounce(func, wait = 100) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}

function onWistListClicked(placeID, el){
  const is_liked = el.getAttribute("data-is-liked");
  const token = localStorage.getItem("token");
  if(!token){
    Snackbar.show({ pos: 'bottom-center', text: "Anda belum login.", actionTextColor: "#e67e22", duration: 2000 });
    setTimeout(function(){
      window.location = "/auth";
    },2000)

    return;
  }
  const url = is_liked == "true" ? "/v1/wishlist-remove" : "/v1/wishlist";
  setTimeout(function() {
    fetch(emapi_base + url,{
      method: "POST",
      body: JSON.stringify({placeID}),
      headers: {
          'Content-Type': "application/json",
          'authorization': "Bearer "+token
      }
    }).then(function(res){
        if(res.status == 500) throw new Error("internal server error");
        return res.json();
    }).then(function(res){
      console.log(res);
      if(is_liked == "true"){
        el.src = "/assets/images/icon/emam-host-like-default.svg";
        el.setAttribute("data-is-liked", false);
      } else {
        el.src = "/assets/images/icon/emam-host-like-active.svg";
        el.setAttribute("data-is-liked", true);
      }
    }).catch(function(error){
      console.log(error);
    })
    
  },200);
  
}