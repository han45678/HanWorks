$("#bookmark_content .item").click(function () {
    $("#bookmark_content .item").removeClass("active");
    $(this).addClass("active");
});


$("#bookmark_title #bt1").click(function () {
    $("#bookmark_content .item_content").removeClass("active");
    $("#bookmark_content #bc1").addClass("active");
});

$("#bookmark_title #bt2").click(function () {
    $("#bookmark_content .item_content").removeClass("active");
    $("#bookmark_content #bc2").addClass("active");
});