	
angular.module('app')
.controller('signup', ($scope, $http,$location) => {
	console.log('hiiiii')
	$scope.image = document.getElementById('image').onchange = function(evt){
        var tgt = evt.target || window.event.srcElement,
        files = tgt.files;
        if(FileReader && files && files.length){
          var fr = new FileReader();
          fr.onload = function(){
                $scope.image.src =  fr.result;
          };
          fr.readAsDataURL(files[0]);

        }
      };
      $scope.image2 = document.getElementById('image2').onchange = function(evt){
        var tgt = evt.target || window.event.srcElement,
        files = tgt.files;
        if(FileReader && files && files.length){
          var fr = new FileReader();
          fr.onload = function(){
                $scope.image2.src =  fr.result;
          };
          fr.readAsDataURL(files[0]);

        }
      };
    $scope.patient=function(){
    	console.log('hiiiii')
		
      console.log("==============", $scope.image.src)
		var username=document.getElementById('name2').value;
		var password=document.getElementById('password2').value;
		var phone=document.getElementById('phone2').value
		$.ajax({
        url: '/patient',
        method: 'POST',
        async: false,
        data: {
            username:username,
            password:password,
            phoneNumber:phone,
            myImage:$scope.image2.src
        },
        success: () => {
            console.log('sent')
            $location.path('login');
        }
    })
	}
	$scope.signup=function(){
		console.log('hiiiii')
		
      console.log("==============", $scope.image.src)
		var username=document.getElementById('name').value;
		var password=document.getElementById('password').value;
		var phone=document.getElementById('phone').value
		var specilization=document.getElementById('specilization').value

		$.ajax({
        url: '/signup',
        method: 'POST',
        async: false,
        data: {
            username:username,
            password:password,
            phoneNumber:phone,
            specilization:specilization,
            image:$scope.image.src
        },
        success: () => {
            console.log('sent')
            $location.path('login');
        }
    })
	}

})
.component('signup',{
	controller:"signup",
  templateUrl:`./views/signup.html`
})
