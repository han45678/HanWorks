window.onload = function () {
    setTimeout(()=> {
        $("#load").addClass("active")
        $("body").removeClass("prohibit_scroll")
    }, 1000);
};

(function ($) {
    //共用
    $(".imgLiquid").imgLiquid({
        fill: true,
        horizontalAlign: "center",
        verticalAlign: "center"
    });    

    $("#menu_button").click(function () {
        $("#menu").addClass("active");
        $("#darken").addClass("active");
        $("body").addClass("prohibit_scroll");
    });

    $("#function_column .glass").click(function () {
        $("#darken").removeClass("active");
        $("#search_win").addClass("active");
        $("body").addClass("prohibit_scroll");
    });

    $("#function_column .shopping").click(function () {
        $("#darken").addClass("active");
        $("#car_win").addClass("active");
        $("body").addClass("prohibit_scroll");
    });

    $("#menu .shopping").click(function () {
        $("#menu").removeClass("active");
        $("#darken").addClass("active");
        $("#car_win").addClass("active");
        $("body").addClass("prohibit_scroll");
    });

    $("#menu .glass").click(function () {
        $("#menu").removeClass("active");
        $("#darken").removeClass("active");
        $("#search_win").addClass("active");
        $("body").addClass("prohibit_scroll");
    });

    $("i.off,#darken").click(function () {
        $("#darken").removeClass("active");
        $("#search_win").removeClass("active");
        $("body").removeClass("prohibit_scroll");
        $("#car_win").removeClass("active");
        $("#menu").removeClass("active");
    });

    $("#menu_content .submenu").click(function () {
        $(this).toggleClass("active")
    });

    // $("#car_win #car_win_content").height($(window).height() - ($("#car_win #lump_sum").height() + $("#car_win h2").height() + 100))

    if ($("header").offset().top > 80) {
        $("header").addClass("fixed");
    } else {
        $("header").removeClass("fixed");
    }

    let wh = $(window).height(); //瀏覽器可視視窗的高度
    let ws = $(window).scrollTop(); //目前視窗離頂部的高度
    let m = wh / 2 + ws;

    $(".an").each(function () {
        if ($(this).offset().top < m - $(this).height() / 2 + 350) {
            $(this).addClass("an_go");
        } else {
            $(this).removeClass("an_go");
        }
    });

    $(window).scroll(function () {

        if ($("header").offset().top > 80) {
            $("header").addClass("fixed");
        } else {
            $("header").removeClass("fixed");
        }

        let wh = $(window).height(); //瀏覽器可視視窗的高度
        let ws = $(window).scrollTop(); //目前視窗離頂部的高度
        let m = wh / 2 + ws;

        $(".an").each(function () {
            if ($(this).offset().top < m - $(this).height() / 2 + 350) {
                $(this).addClass("an_go");
            } else {
                $(this).removeClass("an_go");
            }
        });

    });


    $('img.svg_icon').each(function () {
        var $img = jQuery(this);
        var imgID = $img.attr('id');
        var imgClass = $img.attr('class');
        var imgURL = $img.attr('src');
        jQuery.get(imgURL, function (data) {
            // Get the SVG tag, ignore the rest   
            var $svg = jQuery(data).find('svg');

            // Add replaced image's ID to the new SVG   
            if (typeof imgID !== 'undefined') {
                $svg = $svg.attr('id', imgID);
            }
            // Add replaced image's classes to the new SVG   
            if (typeof imgClass !== 'undefined') {
                $svg = $svg.attr('class', imgClass + ' replaced-svg');
            }

            // Remove any invalid XML tags as per http://validator.w3.org   
            $svg = $svg.removeAttr('xmlns:a');

            // Check if the viewport is set, if the viewport is not set the SVG wont't scale.   
            if (!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
                $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
            }

            // Replace image with new SVG   
            $img.replaceWith($svg);

        }, 'xml');
    });

    //首頁
    if ($("main#home").length > 0) {
        document.write('<script src="./js/slick.min.js"></script>');
        document.write('<script src="./js/pages/home.js"></script>');
    }


    //客製化商品列表
    if ($("main#customized_list").length > 0) {
        document.write('<script src="./js/slick.min.js"></script>');
        document.write('<script src="./js/pages/customized_list.js"></script>');
    }

    if ($("main#customized").length > 0) {
        document.write('<link rel="stylesheet" href="./css/jquery-ui.min.css">');
        document.write('<script src="./js/jquery-ui.min.js"></script>');
        document.write('<script src="./js/slick.min.js"></script>');
        document.write('<script src="./js/pages/customized.js"></script>');
    }

    if ($("main#product").length > 0) {
        document.write('<script src="./js/slick.min.js"></script>');
        document.write('<script src="./js/pages/product.js"></script>');
    }

    if ($("main#faq").length > 0) {
        document.write('<script src="./js/pages/faq.js"></script>');
    }

})(jQuery);