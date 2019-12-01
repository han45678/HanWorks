$(function () {
    $.ajax({
        method: "GET",
        url: "../HanWorks/js/data.json"
    })
        .done(function (data) {
            var position = data.position;
            var englishName = data.englishName;
            var Name = data.Name;
            var birthday = data.birthday;
            var expertise = data.expertise;
            var phone = data.phone;
            var email = data.email;
            
            // var works0 = data.works[0].worksPhoto;
            // var works1 = data.works[1].worksPhoto;
            // var works2 = data.works[2].worksPhoto;
            // var works3 = data.works[3].worksPhoto;

            $("span.englishName,h4.englishName").append(englishName);
            $("h3.position").append(position);
            $("span.Name").append(Name);
            $("span.birthday").append(birthday);
            $("span.expertise").append(expertise);
            $("span.phone").append(phone);
            $("span.email").append(email);
        });

});