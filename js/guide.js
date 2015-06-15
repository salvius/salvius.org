function main() {
    $(".slides").slick({
        lazyLoad: "ondemand",
        dots: true,
        infinite: false
    });
}

$(document).ready(function() {
    main();

    $(".page-link").val(document.URL);

    $(".print").click(function() {
        if (!$(this).hasClass("print-view")) {
            $("img[data-lazy]").each(function() {
                var url = $(this).data("lazy");
                $(this).attr("src", url);
            });
            $(".slides").unslick();
            $(this).addClass("print-view");
        } else {
            $(this).removeClass("print-view");
            main();
        }
        ga("send", "event", "icon button", "click", "toggle print view");
    });

    $(".contents").click(function() {
        ga("send", "event", "icon button", "click", "table of contents link");
    });
});
