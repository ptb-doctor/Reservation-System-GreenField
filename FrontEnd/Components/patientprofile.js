angular.module('app')
.component('patientprofile', {
        controller: "patientprofileCtrl",
        templateUrl: `./views/patientprofile.html`
 })
.controller('patientprofileCtrl', function($scope, $http) {
	$scope.profile;
	$.ajax({
                url: '/patientprofile',
                dataType: 'json',
                async: false,
                success: function(data) {
                   $scope.profile=data 
                }
            });
})