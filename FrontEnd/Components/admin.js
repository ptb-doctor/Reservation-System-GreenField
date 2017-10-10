angular.module('app')
//we defined this varibals to be global for the others functions 
.controller('adminCtrl', function($scope, $http) {
   $scope.docInfo = {}
   $scope.reservedAppointments;
    // $scope.appointmentDate;
    // $scope.appointmentTime;
    // $scope.appointments;
    // $scope.counter = 0;
// it's for add new avalibal appointment 
$scope.addApointment = function() {
    $scope.appointmentDate = $('#addeddateappointment').val();
    $scope.appointmentTime = $('#addedtimeappointment').val();
            // for (var doctor=0 ; doctor < $scope.appointments.length ; doctor++){
            //  $scope.username = $scope.appointments[doctor].username;
            // }
            console.log('+++++++++>', $scope.appointmentDate);
            $.ajax({
                url: '/addAppointments',
                method: 'PUT',
                dataType: 'json',
                async: false,
                data: {
                    newAppointment: {
                        date: $scope.appointmentDate,
                        time: $scope.appointmentTime
                    }
                },
                success: function(data) {
                    console.log('apointment added  seccessfuly', data);
                }
            })
        };
// it will print the reserved appointments from the database
$scope.loadAppointments = function() {
    console.log('loadAppointments run');
    $.ajax({
        url: '/getDoctorReservedAppointments',
        method: 'GET',
        dataType: 'json',
        async: false,
        success: function(data) {
           console.log('++++++++++++++', data);
           $scope.reservedAppointments = data;
       }
   })
}

$scope.getDocInfo = function(){
    console.log("getting doctor")
    $.ajax({
        url: '/docInfo',
        method: 'GET',
        dataType: 'json',
        async: false,
        success: function(data) {
           console.log('++++++++++++++', data);
           $scope.docInfo = data[0]
       }
   })
}

$scope.recommendation = function(appointment){
    var letter = $("#recommendation").val()
    $.ajax({
        url: '/recommendation',
        method: 'POST',
        dataType: 'json',
        data: {
            recommendation: letter,
            appointment: appointment
        },
        success: () => {
            console.log('sent')
        }
    })
}

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
}

        $scope.deleteOpenAppointment = (appointment) => {
            console.log('asdasdasdasd;as;kdmas;kdmja;sj', appointment)
            $.ajax({
                url: '/deleteOpenAppointment',
                method: 'DELETE',
                dataType: 'json',
                data: {
                    reservedAppointment: appointment
                },
                success: () => {
                    console.log('hahahahahah')
                }
            })
        }
    })
    .component('admin', {
        controller: "adminCtrl",
        templateUrl: `./views/admin.html`
})