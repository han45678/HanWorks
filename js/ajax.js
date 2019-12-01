$(function () {
    $.ajax({
        method: "GET",
        url: "../HanWorks/js/data.json"
    })
        .done(function (data) {
            var position = data.results[0].position;
            var englishName = data.results[0].englishName;
            var Name = data.results[0].Name;
            var birthday = data.results[0].birthday;
            var expertise = data.results[0].expertise;
            var phone = data.results[0].phone;
            var email = data.results[0].email;
            
            var works0 = data.results[0].works[0].worksPhoto;
            var works1 = data.results[0].works[1].worksPhoto;
            var works2 = data.results[0].works[2].worksPhoto;
            var works3 = data.results[0].works[3].worksPhoto;

            $("span.englishName,h4.englishName").append(englishName);
            $("h3.position").append(position);
            $("span.Name").append(Name);
            $("span.birthday").append(birthday);
            $("span.expertise").append(expertise);
            $("span.phone").append(phone);
            $("span.email").append(email);


        });

});