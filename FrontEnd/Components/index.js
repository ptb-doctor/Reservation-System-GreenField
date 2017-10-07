angular.module('app', [])
.controller('indexCtrl', ($scope, $http) => {
  $scope.isLoggedIn = true;
})
.component('index', {
  template: `
    <navbar check-is-logged-in = "checkIsLoggedIn.bind($ctrl)" is-logged-in = "$scope.isLoggedIn"/>
  `
})
