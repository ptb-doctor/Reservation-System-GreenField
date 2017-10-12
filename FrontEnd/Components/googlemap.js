angular.module('app')
.controller('googlemap', ($scope, $http,$location) => {
  //http://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&sensor=true
  //this link will get us info about what city we have ....
  /*@keyframes example {
    from {background-color: red;}
    to {background-color: yellow;}
}

div {
    width: 100px;
    height: 100px;
    background-color: red;
    animation-name: example;
    animation-duration: 4s;
}*/

    $scope.hospitals;
    $scope.render=false
    $scope.position;
    $scope.flag=false
    console.log('kokokokokokookoko')
    var map, infoWindow;
    $scope.initMap=function() {

      //styling ....
      $('.containerM').css({
        'width' : '30%'
      });
      $("#fb").animate({width: "-=60%"} ,1300);
      $("#sb").animate({width: "-=60%"} ,1300, () => {
        $("#sb").animate({top : "+=20%"});
      });
      $("#tb").animate({width: "-=60%"} ,1300, () => {
        $("#tb").animate({top : "+=10%"});
      });
      // $("#sb").css({marginRight: "350px"});
      
      // $("#sb").animate({width: "-=60%"} ,500, 'swing');
      $('.containerMB').css({
          'float' : 'right'
      });
      //the map :
      $scope.flag=true
      var x=document.getElementById('map')
      
      console.log('hiiii')
      map = new google.maps.Map(x, {
        center: {lat: -34.397, lng: 150.644},
        zoom: 11
      });
      infoWindow = new google.maps.InfoWindow;


      // Try HTML5 geolocation.
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          $scope.position=pos;
          console.log($scope.position)
          infoWindow.setPosition(pos);
          infoWindow.setContent('Location found.');
          infoWindow.open(map);
          map.setCenter(pos);
        }, function() {
          handleLocationError(true, infoWindow, map.getCenter());
        });
      } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
      }
      console.log(x)
      console.log($scope.position)
    }
  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
  }
  $scope.search=function(){
    //console.log('seaaaaarch')
    $scope.render=true
    $.ajax({
        method:'POST',
        async: false,
        method:'POST',
        url: "/googlemap",
        cache:false,
        dataType:'json',
        data:$scope.position,
        success: function (data){
          //console.log(typeof data);
          var x=JSON.parse(data.body)
          console.log(x.results);
          $scope.hospitals=x.results
        }
    });
  }
  function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
}

  function deg2rad(deg) {
      return deg * (Math.PI/180)
  }
  $scope.doctors;
  $scope.doctorss=function(){
    $scope.render=false;
      $.ajax({
                url:'/getDoctors',
                dataType: 'json',
                async: false,
                success: function(data) {
                   console.log('hwwwwwww')
                   console.log(data)
                   $scope.doctors=data
                   for(var i=0;i<$scope.doctors.length;i++){
                      var dist=getDistanceFromLatLonInKm($scope.position.lat,$scope.position.lng,$scope.doctors[i].location[0],$scope.doctors[i].location[1]);
                      $scope.doctors[i].distance=dist
                   }
                   console.log(doctors)

                }
                ,error:function(){
                    console.log('errrrrrrrror')
                }
            });
  }
})
.component('googlemap',{
	controller:"googlemap",
  templateUrl:`./views/googlemap.html`
})
