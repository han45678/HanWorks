$("#order .pay_method .item1").click(function () {
    $("#order .pay_method .item").removeClass("active");
    $(this).addClass("active");
    $('#order .pay_method .item input[name="0"]')[0].checked = true;
    $('#order .pay_method .item input[name="0"]')[1].checked = false;
});


$("#order .pay_method .item2").click(function () {
    $("#order .pay_method .item").removeClass("active");
    $(this).addClass("active");
    $('#order .pay_method .item input[name="0"]')[1].checked = true;
    $('#order .pay_method .item input[name="0"]')[0].checked = false;
});