$('#commodity_main_photo').slick({
    dots: false,
    infinite: false,
    slidesToShow: 1,
    autoplay: false,
    arrows: false,
    asNavFor: '#commodity_main_thumbnail'
});

$('#commodity_main_thumbnail').slick({
    dots: false,
    infinite: true,
    slidesToShow: 4,
    autoplay: false,
    focusOnSelect: true,
    asNavFor: '#commodity_main_photo'
});

$("#commodity_main_photo .item").height($("#commodity_main_photo .item").width());
$("#commodity_main_thumbnail .item").height($("#commodity_main_thumbnail .item").width())