angular.module('app')
.component('patientprofile', {
        controller: "patientprofileCtrl",
        templateUrl: `./views/patientprofile.html`
 })
.controller('patientprofileCtrl', function($scope, $http) {
    console.log('hiiii')
    $scope.profile;
    $.ajax({
                url:'/patientprofile',
                dataType: 'json',
                async: false,
                success: function(data) {
                   console.log(data)
                   $scope.profile=data 
                }
                ,error:function(){
                    console.log('errrrrrrrror')
                }
            });
})