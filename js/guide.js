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

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-12573345-8', 'auto');
ga('send', 'pageview');
