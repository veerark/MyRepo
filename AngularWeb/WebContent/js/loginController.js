var loginApp = angular.module('login', []);

loginApp.controller('LoginController', ['$scope',
                       function($scope){
	alert("Hell inside");
                    	   $scope.login=function(){
                    		   alert("Hi!!! inside");
                    	   }
                       }
                                        
                   ]);