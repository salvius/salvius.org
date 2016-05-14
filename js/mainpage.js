var $firstRow = $(".js-first-row");

if ($firstRow.length) {
    $("#nav").affix({
        offset: {
            top: 435
        }
    });

    $("#nav").on("affixed.bs.affix", function() {
        $firstRow.css("margin-top", "50px");
        $(window).resize();
    });

    $("#nav").on("affixed-top.bs.affix", function() {
        $firstRow.css("margin-top", "0px");
        $(window).resize();
    });

    $("body").scrollspy({target: "#navbar-collapse"});
} else {
    $("#nav").affix();
}

$(".js-show-more").click(function(e) {
    $(".js-row-more").toggleClass("open");

    function reveal() {
        window.scrollBy(0, 160);
    }
    setTimeout(reveal, 100);
});

/* Smooth scrolling to an anchor on the same page. */
$(function() {
  $('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });
});
