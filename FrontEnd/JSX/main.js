//defined the module woh will have the controller for all the HTML page
angular.module('app')
.controller('AppCtrl', function($scope){
    $scope.doctors =[{
    name:'aya', image:'./Images/malelogo.png',specialization:'heart',phonnumber:079877546 ,availableAppointments:[{date:'12.oct' ,time :'10.05'},{date:'14.oct' ,time :'10.05'},{date:'15.oct' ,time :'10.05'}],showAppointments:false, showAll:true
},{
    name:'ammar', image:'./Images/malelogo.png',specialization:'heart',phonnumber:079 ,availableAppointments:[{date:'12.oct' ,time :'10.05'},{date:'14.oct' ,time :'10.05'},{date:'15.oct' ,time :'10.05'}],showAppointments:false, showAll:true}];
    $scope.reserveAppointment =function (doctor){
      console.log(doctor.name);
    };
    $scope.showDoctorAppointments = function (name){
      var currentDoctors = $scope.doctors;
      for (var i = 0; i < currentDoctors.length; i++) {
        if (currentDoctors[i].name === name)
        {
          currentDoctors[i].showAppointments = !currentDoctors[i].showAppointments;
        }else{
          currentDoctors[i].showAll = !currentDoctors[i].showAll;
        }
      }
    }

 })
 .component('main', {
   template: `
    <div ng-controller="AppCtrl">
        <ul>
            <div ng-show="doctor.showAll" class="media" ng-repeat="doctor in doctors">
                <div class="media-left media-top" >
                    <div class="media-left">
                        <img ng-src="{{doctor.image}}" class="media-object" style="width:80px"  ng-click="showDoctorAppointments(doctor.name)">
                        <div class="media-body">
                          <h1 class="media-heading">DR-name:{{doctor.name}}</h1>
                          <p>Phon Number: {{doctor.phonnumber}}</p>
                          <p>Specialization: {{doctor.specialization}}</p>
                        <div ng-show="doctor.showAppointments" class="row">
                        <div class="col-lg-4">
                        <label>Appointments</label>
                        <select class="form-control">
                        <option selected>Select an appointment</option>
                        <option type="radio" name="doctor.name"  ng-repeat="data in doctor.availableAppointments" ng-click="reserveAppointment(doctor.availableAppointments[data])"/>
                        {{data.time}},{{data.date}}</option>
                        </select>
                        <div class="form-group">

                          <label for="usr">Name:</label>
                          <input type="text" class="form-control" id="usr">
                        </div>
                        <div class="form-group">
                          <label for="pwd">Phone:</label>
                          <input type="text" class="form-control" id="pwd">
                        </div>
                        <br>
                        <button class="btn btn-success">Submit</button>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </ul>
    </div>
   `
 })
