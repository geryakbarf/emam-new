function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

$(function () {
    $(".food_search").keyup(debounce(function () {
        var search_food = $(this).val();
        if (search_food.length > 2) {
            $.ajax({
                type: "GET",
                url: `/search-places?keyword=${search_food}`,
                cache: false,
                success: function (html) {
                    $("#result").html(html).show();
                }
            });
        } else if (search_food.length === 0)
            $('#result').empty();
        return false;
    }, 250));

    $("#result").on("click", function (e) {
        var $clicked = $(e.target);
        var $name = $clicked.find('.name').html();
        var decoded = $("<div/>").html($name).text();
        $('#search_food').val(decoded);
    });

    $(document).on("click", function (e) {
        var $clicked = $(e.target);
        if (!$clicked.hasClass("food_search")) {
            $("#result").fadeOut();
        }
    });

    $('#search_food').click(function () {
        $("#result").fadeIn();
    });
});
