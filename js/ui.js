$(window).load(function () {
    $("#load p .top").animate({ width: '100%' }, 600);
    $("#load p .bottom").animate({ width: '100%' }, 700);
    $("#load p .left").animate({ height: '100%' }, 800);
    $("#load p .right").animate({ height: '100%' }, 900);
    $("#load").animate({ height: '0' }, 1500);
    $("#load2").animate({ height: '0' }, 2500);
    $('html,body').animate({ scrollTop: '0px' }, 500);
    
    $('#works .slick ul').slick({
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: true,
        //autoplay: true,
        draggable: true,
        nextArrow: $('#works  .next'),
        prevArrow: $('#works  .prev'),
        responsive: [
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });
    
    $('#banner .photo').slick({
        infinite: true,
        autoplay: true,
        fade: true,
        speed: 2000,
        arrows: false,
        dots: false,
    });
});

new WOW().init();

$(document).ready(function () {
    
    $(window).scroll(function() {
        if ($("header").offset().top > 75) {
            $("header").addClass("active");
        } else {
            $("header").removeClass("active");
        }
    });

    $(".menu_button").click(function () {
        $(".menu_button,.menu").toggleClass("active");
    });

    $("header .menu a").click(function () {
        $(".menu_button,.menu").removeClass("active");
    });

    $('#top').click(function () {
        $('html,body').animate({ scrollTop: '0px' }, 800);
    });

    $('.goWorks').click(function () {
        $('html,body').animate({ scrollTop: $('#works').offset().top }, 800);
    });

    $('.goAbout').click(function () {
        $('html,body').animate({ scrollTop: $('#about').offset().top }, 800);
    });
    $(".imgLiquidCenter,#about .photo").imgLiquid({
        fill: true,
        horizontalAlign: "center",
        verticalAlign: "top"
    });
});