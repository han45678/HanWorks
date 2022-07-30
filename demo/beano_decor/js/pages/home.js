$('#banner .slick').slick({
    dots: true,
    infinite: true,
    slidesToShow: 1,
    autoplay: true,
});

$('#shop_class .slick').slick({
    dots: false,
    infinite: true,
    slidesToShow: 6,
    autoplay: true,
    responsive: [
        {
            breakpoint: 1280,
            settings: {
                slidesToShow: 3,
            }
        },
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 2,
            }
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 2,
            }
        }
    ]
});

$('#best .slick').slick({
    dots: false,
    infinite: true,
    slidesToShow: 4,
    autoplay: false,
    responsive: [
        {
            breakpoint: 1280,
            settings: {
                slidesToShow: 3,
            }
        },
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 2,
            }
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 2,
            }
        }
    ]
});

if($(window).width()<=1024){
    const w = $("#home #banner .slick .item").width()
    $("#home #banner .slick .item").height(w)
}