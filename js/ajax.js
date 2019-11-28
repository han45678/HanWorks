$(document).ready(function () {
    $.ajax({
        method: "GET",
        url: "../HanWorks/js/data.json"
    })
        .done(function (msg) {
            var position = msg.results[0].position;
            var englishName = msg.results[0].englishName;
            var Name = msg.results[0].Name;
            var birthday = msg.results[0].birthday;
            var expertise = msg.results[0].expertise;
            var phone = msg.results[0].phone;
            var email = msg.results[0].email;
            var works0 = msg.results[0].works[0].worksPhoto;
            var works1 = msg.results[0].works[1].worksPhoto;
            var works2 = msg.results[0].works[2].worksPhoto;
            var works3 = msg.results[0].works[3].worksPhoto;

            $("span.englishName,h4.englishName").append(englishName);
            $("h3.position").append(position);
            $("span.Name").append(Name);
            $("span.birthday").append(birthday);
            $("span.expertise").append(expertise);
            $("span.phone").append(phone);
            $("span.email").append(email);
        });

});