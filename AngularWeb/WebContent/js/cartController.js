var mycart = angular.module("mycart",['ngRoute','service']);

mycart.config(['$routeProvider',
		      function($routeProvider){
				$routeProvider.when('/rest/search',{templateUrl: 'jsp/cart.html'})
				$routeProvider.when('/rest/delete/:itemDescription',{templateUrl: 'jsp/cart.html'})
				}  
		    ]);

mycart.controller('CartController', ['$scope', 'Item','Items',
	function($scope,Item,Items){
		$scope.items = Item.query(); //Will fetch the list from REST service.
		alert("Items:="+$scope.items.itemDescription);
		//Commented the $http directive to invoke the service.
		
		/*$http.get('http://localhost:8080/SpringREST/rest/search').
        success(function(data) {
        	//var jsonObj = JSON.parse(data);
		    $scope.items = data;
            //$scope.items.title = data.itemDescription;
		    alert("Hello!!!!"+$scope.items);
		    
        }).error(function(data, status, headers, config) {
			alert("error!!!!");
		});*/
	
		//Remove the product from the list.
	 	$scope.remove=function(index, item){
			Items.remove(item).then(function(){
			  $scope.items.splice(index, 1);				
			},function(reason){
			alert("Hi inside error");
		});
	  };
	 	
	 	/*$scope.add=function(){
	 		alert("inside add function");
	 		document.location.href='addProduct.html';
	 	}*/
		
}]);





/*var services = angular.module('mycart.services', ['ngResource']);

services.factory('UsersFactory', function ($resource) {
    return $resource('http://localhost:8080/SpringREST/rest/search', {}, {
        query: { method: 'GET', isArray: true },
        create: { method: 'POST' }
    })
});*/
