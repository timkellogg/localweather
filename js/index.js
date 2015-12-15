$(document).ready(function() {
  var APP_ID = "8a4fb05ce91fe492775952160ec2d8ea";
  var userTime;
  var imperial = true;
  
  getLocation();
  
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(saveLocation);
    } else {
      alert("Your browser doesn't support geolocation!");
    }
  }
  
  function checkUnits() {
    var currentTemp = $("#temp").text().split(" ")[0];
    var currentSpeed = $("#windSpeed").text().split(" ")[0];
    
    if (imperial) {
      imperial = false;
      $("#unit-btn").text("Metric");
      convertToCelcius(currentTemp);
      convertWindToMetric(currentSpeed);
    } else {
      imperial = true;
      $("#unit-btn").text("Imperial");
      convertToFaren(currentTemp);
      convertWindToImperial(currentSpeed);
    }
  }
  
  $("#unit-btn").on("click", function() { checkUnits(); });
  
  function convertWindToMetric(currentSpeed) {
    $("#windSpeed").text( Math.round(currentSpeed * 1.60934) + " KPH" );
  }
  
  function convertWindToImperial(currentSpeed) {
    $("#windSpeed").text( Math.round(currentSpeed * 0.621371) + " MPH" );
  }
  
  function convertToFaren(currentTemp) {
    $("#temp").text(Math.round((currentTemp * 9/5) + 32) + " F");
  }
  
  function convertToCelcius(currentTemp) {
    $("#temp").text(Math.round((currentTemp - 32) * (5/9)) + " C");
  }
  
  function saveLocation(location) {
    var userLat = location.coords.latitude;
    var userLng = location.coords.longitude;
        userTime = parseUserTime(location.timestamp);
    var hour = new Date(location.timestamp);
        hour = hour.getHours();
    checkDayOrNight(hour);
    getWeather(userLat, userLng, userTime);
  }
  
  function parseUserTime(time) {
    userTime = new Date(time);
    userTime = userTime.toLocaleString('en-US');
    userTime = userTime.split(",")[1];
    return "Last updated: " + userTime;
  }
  
  function updateDOM(data, windDirection) {
    $("#temp").text( Math.round(data.main.temp) + " F");
    $("#city").text(data.name + ", " + data.sys.country);
    $("#time").text(userTime);
    $("#windSpeed").text(Math.round(data.wind.speed) + " " + windDirection);
    $("#description").text(data.weather[0].description);
    $("#temp-icon").attr("src", "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png");
  }
  
  function checkDayOrNight(hour) {
    if (  (5 >= hour && hour >= 0) || (24 >= hour && hour >= 18) ) {
      var imageUrl = "https://images.unsplash.com/photo-1431222176733-053f6ddcab8e?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=1080&fit=max&s=899c1b454c6301efafc9941e4709aaa6";
    } else {
      var imageUrl = "https://images.unsplash.com/photo-1415273535647-499901af1614?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=1080&fit=max&s=5735052062af556767dee10d664bb189";
      $("body").css("color", "white");
    }
    $("body").css("background-image", 'url(' + imageUrl + ')');
  }
  
  function degreesToDirection(num) {
    var val = Math.floor((num / 22.5) + 0.5);
    var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", 
               "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return arr[(val % 16)];
  }
  
  function getWeather(lat, lng, time, units) {
    $("#temp-icon").show();
    $(".spinner").show();
    $.get("http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lng + "&units=imperial&APPID=" + APP_ID, function(data) {})    
      .done(function(data) {
        var windDirection = degreesToDirection(data.wind.deg);
        var temp = data.main.temp;
        updateDOM(data, windDirection);
      })
      .fail(function() {
        alert("Something went wrong!");
      })
      .always(function() {
        $(".spinner").hide();      
      });
  }
});