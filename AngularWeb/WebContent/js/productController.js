var product = angular.module('addProduct',['ngRoute','service']);

product.config(['$routeProvider',
 		      function($routeProvider){
 				$routeProvider.when('/rest/add/:product',{templateUrl: 'jsp/cart.html'})
 				}  
 		    ]);


mycart.controller('ProductController', ['$scope', 'productSvc','$location',
                                 	function($scope,product,$location){
	                                     $scope.addProduct=function(product){
	                                    	alert("Product:"+product); 
										    productSvc.add({product: product});
                                 		    $scope.items = Item.query();
	                                     }
                                 }]);
