$('#banner .slick').slick({
    dots: true,
    infinite: true,
    slidesToShow: 1,
    autoplay: true,
});

$('#shop_class .slick').slick({
    dots: false,
    infinite: true,
    slidesToShow: 5,
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
                slidesToShow: 1,
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
                slidesToShow: 1,
            }
        }
    ]
});