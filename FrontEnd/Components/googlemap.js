angular.module('app')
.controller('googlemap', ($scope, $http,$location) => {
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
    $('.containerM').css({
      'width' : '40%',
      'background-color' : 'green'
    });
    $('.containerMB').css({
        'float' : 'right'
    });

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

})
.component('googlemap',{
	controller:"googlemap",
  templateUrl:`./views/googlemap.html`
})
