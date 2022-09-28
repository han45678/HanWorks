var map;
var marker;
var user = {
    lat: 24.17424710202494,
    lng: 120.6727611244978
};
var diameter = 100; //半徑 單位公尺

function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        center: user,
        zoom: 16
    });

    var user_marker = new google.maps.Marker({
        map: map,
        position: user
    });


    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            var marker = new google.maps.Marker({
                position: pos,
                icon: './user.png',
                map: map
            });

            // alert(pos.lat)
            // alert(pos.lng)

            x = position.coords.latitude
            y = position.coords.longitude

            document.getElementById("x").innerHTML = position.coords.latitude
            document.getElementById("y").innerHTML = position.coords.longitude
        });

    } else {
        alert("錯誤！");
    }

    cityCircle = new google.maps.Circle({ //created a circle to mark the radius
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        map: map,
        center: user,
        radius: diameter,
        clickable: false
    });
}

var checkPoint = {
    lat: x,
    lng: y
}

var centerPoint = user //打卡的座標

document.getElementById("xx").innerHTML = centerPoint.lat
document.getElementById("yy").innerHTML = centerPoint.lng

var m = diameter //打卡的範圍


function arePointsNear(checkPoint, centerPoint, m) { // credits to user:69083
    var km = m / 1000;
    var ky = 40000 / 360;
    var kx = Math.cos(Math.PI * centerPoint.lat / 180.0) * ky;
    var dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx;
    var dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
    return Math.sqrt(dx * dx + dy * dy) <= km;
}

// alert(arePointsNear(checkPoint, centerPoint, m))
function punch() {
    if (arePointsNear(checkPoint, centerPoint, m)) {
        alert("可以打卡")
    } else {
        alert("不可以打卡")
    }
}