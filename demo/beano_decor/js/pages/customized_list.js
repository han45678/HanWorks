$('#banner .slick').slick({
    dots: true,
    infinite: true,
    slidesToShow: 1,
    autoplay: true,
});
$('#class .slick').slick({
    dots: false,
    infinite: true,
    slidesToShow: 5,
    autoplay: true,
    responsive: [
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 3,
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