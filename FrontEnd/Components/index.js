angular.module('app',['ngRoute'])
.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider , ) {
  $routeProvider
      .when('/login', {
          templateUrl: 'views/realviews/login.html'
      })
      .when('/signup', {
          templateUrl: 'views/realviews/signup.html',
      })
      .when('/patientprofile', {
      	  templateUrl: 'views/realviews/patientprofile.html'
      })
      .when('/docprofile', {
          templateUrl: 'views/realviews/docprofile.html',
      })
      .when('/main', {
      	templateUrl: 'views/realviews/main.html',
      })
      .otherwise({
          redirectTo: '/main'
      });
  }])