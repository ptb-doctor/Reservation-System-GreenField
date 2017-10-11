angular.module('app')
.controller('googlemap', ($scope, $http,$location) => {
  $scope.position;
  $scope.flag=false
  console.log('kokokokokokookoko')
  var map, infoWindow;
       $scope.initMap=function() {
        $scope.flag=true
        var x=document.getElementById('map')
        
        console.log('hiiii')
        map = new google.maps.Map(x, {
          center: {lat: -34.397, lng: 150.644},
          zoom: 6
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
        $.ajax({
            method:'POST',
            async: false,
<<<<<<< HEAD
=======
            method:'POST',
>>>>>>> origin
            url: "/googlemap",
            cache:false,
            dataType:'json',
            data:$scope.position,
            success: function (data){
              console.log(typeof data);
              console.log(data);
            }
        });
      }

})
.component('googlemap',{
	controller:"googlemap",
  templateUrl:`./views/googlemap.html`
})
