$('.js-show-more').click(function() {
    $('.js-row-more').toggleClass('open');
    function reveal() {
        window.scrollBy(0, 160);
    }
    setTimeout(reveal, 100);
});
