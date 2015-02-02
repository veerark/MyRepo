var service = angular.module('service',['ngResource']);

service.factory('Item',['$resource',
                             function ($resource){
							   return $resource('/SpringREST/rest/search',
									  {
								        query:{method:'GET'},
								        cache: false,
									  });					   
							  
							 }
                           ]);

service.factory('Items',function ($resource){
	                           return $resource('/SpringREST/rest/delete',{},
									  {
								        remove:{method:'POST'}								        
									  });					   
							  
							 }
                          );

service.factory('loginSvc', function($resource){
								return $resource('/SpringREST/rest/login',{
									      query:{method:'GET'},
									    });
					
							  });

service.factory('productSvc', function($resource){
	return $resource('/SpringREST/rest/add',{
		      add:{method:'POST'},
		    });

  });