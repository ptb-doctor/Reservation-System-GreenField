	
angular.module('app')
.controller('signup', ($scope, $http,$location) => {
	console.log('hiiiii')
	$scope.signup=function(){
		console.log('hiiiii')
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
            image:'aqqaq'
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
