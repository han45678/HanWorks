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

$("#datepicker").datepicker({dateFormat: "yy-mm-dd"});

$("#commodity_content .label .item1").click(function(){
    $("#commodity_content .label .item2").removeClass("active");
    $(this).addClass("active");
    $("#commodity_content .content2").removeClass("active");
    $("#commodity_content .content1").addClass("active");
});

$("#commodity_content .label .item2").click(function(){
    $("#commodity_content .label .item1").removeClass("active");
    $(this).addClass("active");
    $("#commodity_content .content1").removeClass("active");
    $("#commodity_content .content2").addClass("active");
});