angular.module('app')
// .controller('loginCtrl', function($scope){
//   $scope.submit = function (){
//     console.log ('submit clicked');
//     var username = $('#username').val()
//     var password = $('#password').val()
    

//    $.ajax({
//     url : "http://127.0.0.1:2000/login",
//     type : "POST",                            
//     contentType : "json",
//     data:{
//      username : username,
//      password: password
//       },
    
//     success : function(data) {
//             console.log('okokok');
//             }

//        })
//   };
  
// })




.component('login',{
  templateUrl:`./views/login.html`
})
