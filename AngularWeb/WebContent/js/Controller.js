var loginApp = angular.module('login',['ngRoute','service']);

loginApp.config(['$routeProvider',
                 function($routeProvider){
					$routeProvider.when('/rest/login',{templateUrl: 'jsp/cart.html'})
				}]);

loginApp.controller('LoginController',['$scope','$location','loginSvc',
  function($scope,loginSvc){
    $scope.login = function(user){
    	document.location.href='jsp/cart.html';
    	//loginSvc.query(user); //REST implementation to validate the login is inprogress. 
  }
    
}]);