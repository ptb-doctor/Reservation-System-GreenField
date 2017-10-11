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
                   console.log('hwwwwwww')
                   console.log(data)
                   $scope.profile=data 
                }
                ,error:function(){
                    console.log('errrrrrrrror')
                }
            });
            $scope.deleteAppointment = (appointment) => {
                console.log('asdasdasdasd;as;kdmas;kdmja;sj', appointment)
                $.ajax({
                    url: '/deleteAppointment',
                    method: 'DELETE',
                    dataType: 'json',
                    data: {
                        reservedAppointment: appointment
                    },
                    success: () => {
                        console.log('hahahahahah')
                    }
                })
                $.ajax({
                    url:'/patientprofile',
                    dataType: 'json',
                    async: false,
                    success: function(data) {
                       console.log('hwwwwwww')
                       console.log(data)
                       $scope.profile=data 
                    }
                    ,error:function(){
                        console.log('errrrrrrrror')
                    }
                });
            }
})