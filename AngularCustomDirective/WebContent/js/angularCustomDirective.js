/**
 * 
 */
angular.module('customDirective',[])
	.controller('CustomDirective', ['$scope', function($scope){
		$scope.data = {
				data: d3.csv("../data/Disney.csv")
		};
		
		console.log("Print the data:="+$scope.data);
	}])