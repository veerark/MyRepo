var app = angular.module('bubbleApp', []);
app.controller('chartController', function($scope,$timeout, $templateCache) {
	
	var chartData;
	loadData();
	$timeout(function(){},1000),
	
	/**
	 * function will be invoked
	 * on click of 'Year' option
	 */
	$scope.year = function(){
		loadData();
		$scope.clicked = true;
	};
	
	/**
	 * function will be invoked
	 * on click of 'all' option
	 */
	$scope.all = function(){
		$scope.clicked = false;
		loadData();
		$timeout(function(){},1000);
	};
	
	/**
	 * function will load data from the
	 * csv file and loaded into angular cache.
	 */
	function loadData(){
		if(!angular.isUndefined($templateCache.get(chartData))){
		  $scope.data = $templateCache.get(chartData);
		} else{
		  d3.csv("../data/Disney.csv", function(data){
				$scope.data = data;
				//put the data into cache.
				$templateCache.put(chartData, data);					
		  });
		}	
	}
})
.directive('bubble',['$timeout', function (timer){
		
		return{
			restrict	:	'E',
			scope		:	{data:'=', view_type:'=', clicked:'='},
			link : function(scope, element){
				 scope.custom_chart=function(attr){
				   	 
					 var width = 800,
				      height = 700,
				      layout_gravity = -0.01,
				      damper = 0.1,
				      nodes = [],
				      data = scope.data,
				      view_type = scope.view_type,
				      vis, force, circles, radius_scale;
					  if(!angular.isUndefined(data)){ 
						  var center = {x: width / 2, y: height / 2};
		
						  var year_centers = {
						      "2010": {x: width / 4, y: height / 2},
						      "2011": {x: width / 2, y: height / 2},
						      "2012": {x: 2 * width / 3, y: height / 2}
						    };
		
						  var fill_color = d3.scale.ordinal()
						                  .domain(["2010", "2011", "2012"])
						                  .range(["#d84b2a", "#beccae", "#00FF00"]);
							
						    var max_amount = d3.max(data, function(d) { return parseInt(d.total, 10); } );
						    radius_scale = d3.scale.pow().exponent(0.5).domain([0, max_amount]).range([2, 85]);
		
					    //create node objects from original data
					    //that will serve as the data behind each
					    //bubble in the vis, then add each node
					    //to nodes to be used later
					    data.forEach(function(d){
					      var node = {
					        year: d.Year, 	  
					        radius: radius_scale(parseInt(d.total, 10)),
					        asset: d.Asset,
					        total:d.total,
					        opcost:d.Op_Cost,
					        x: Math.random() * 900,
					        y: Math.random() * 800
					      };
					      nodes.push(node);
					    });
					    nodes.sort(function(a, b) {return b.value- a.value; });
					    
					    d3.select("#vis").select("svg").remove();
					    
					    vis = d3.select("#vis").append("svg")
					                .attr("width", width)
					                .attr("height", height)
					                .attr("id", "svg_vis");
		
					    circles = vis.selectAll("circle")
					                 .data(nodes, function(d) {return d.id ;});
		
					    circles.enter().append("circle")
					      .attr("r", 0)
					      .attr("fill", function(d) { return fill_color(d.year) ;})
					      .attr("stroke-width", 2)
					      .attr("stroke", function(d) {return d3.rgb(fill_color(d.year)).darker();})
					      .attr("id", function(d) { return  "bubble_" + d.id; })
					      .on("mouseover", function(d, i) {show_details(d, i, this);} )
					      .on("mouseout", function(d, i) {hide_details(d, i, this);} );
		
					    circles.transition().duration(2000).attr("r", function(d) { return d.radius/3; });
					    
					    //based on the option type the corresponding
					    //method will get invoked to render the chart
					    if(attr == 'all'){
					      start();
					      display_group_all();
					    } else if(attr == 'year'){
					      start();
					      display_by_year();
					    }
					    
					    /**
					     * Charge method
					     */
					    function charge(d) {
					        return -Math.pow(10, 2.0) / 8;
					      }
					    
					    /**
					     * Method will set the 
					     * d3 force layout
					     */
					    function start() {
					        force = d3.layout.force()
					                .nodes(nodes)
					                .size([width, height]);		        
					      }
		
					    /**
					     * Method will display all
					     * the rides option grouped
					     * together
					     */
					     function display_group_all() {
					        force.gravity(layout_gravity)
					             .charge(charge)
					             .friction(0.9)
					             .on("tick", function(e) {
					                circles.each(move_towards_center(e.alpha))
					                       .attr("cx", function(d) {return d.x;})
					                       .attr("cy", function(d) {return d.y;});
					             });
					        force.start();
					        hide_years();
					      }
		
					     /**
					      * Method will move all the
					      * bubbles to center
					      */ 
					     function move_towards_center(alpha) {
					        return function(d) {
					          d.x = d.x + (center.x - d.x) * (damper + 0.02) * alpha;
					          d.y = d.y + (center.y - d.y) * (damper + 0.02) * alpha;
					        };
					      }
		
					     /**
					      * Method will display the
					      * year categories
					      */
					     function display_by_year() {
					        force.gravity(layout_gravity)
					             .charge(charge)
					             .friction(0.9)
					            .on("tick", function(e) {
					              circles.each(move_towards_year(e.alpha))
					                     .attr("cx", function(d) {return d.x;})
					                     .attr("cy", function(d) {return d.y;});
					            });
					        force.start();
					        display_years();
					      }
		
					     /**
					      * Method will show the data as 
					      * bubble and display under their 
					      * corresponding year
					      */
					     function move_towards_year(alpha) {
					        return function(d) {
					          var target = year_centers[d.year];
					          d.x = d.x + (target.x - d.x) * (damper + 0.02) * alpha * 1.1;
					          d.y = d.y + (target.y - d.y) * (damper + 0.02) * alpha * 1.1;
					        };
					      }
		
					     /**
					      * Method will render the years
					      */
					     function display_years() {
					          var years_x = {"2010": 160, "2011": width / 2, "2012": width - 160};
					          var years_data = d3.keys(years_x);
					          var years = vis.selectAll(".years")
					                     .data(years_data);
		
					          years.enter().append("text")
					                       .attr("class", "years")
					                       .attr("x", function(d) { return years_x[d]; }  )
					                       .attr("y", 40)
					                       .attr("text-anchor", "middle")
					                       .text(function(d) { return d;});
		
					      }
		
					      /**
					       * Method will hide the year labels
					       * when display_group_all method is
					       * invoked.
					       */
					      function hide_years() {
					          var years = vis.selectAll(".years").remove();
					      }
		
					      /**
					       * Method to display the
					       * tooltip
					       */
					      function show_details(data, i, element) {
					        d3.select(element).attr("stroke", "black");
					        var content = "<span class=\"name\">Asset:</span><span class=\"value\"> " + data.asset + "</span><br/>";
					        content +="<span class=\"name\">Op Cost:</span><span class=\"value\"> $" + data.opcost + "million </span><br/>";
					        content +="<span class=\"name\">Year:</span><span class=\"value\"> " + data.year + "</span>";
					        tooltip = CustomTooltip("tooltip", 240),
					        tooltip.showTooltip(content, d3.event);
					      }
					      
					      /**
					       * Method to hide the 
					       * tooltip
					       */
					      function hide_details(data, i, element) {
					        d3.select(element).attr("stroke", function(d) { return d3.rgb(fill_color(d.year)).darker();} );
					        //tooltip = CustomTooltip("tooltip", 240),
					        tooltip.hideTooltip();
					      }	
					    
					    
							 }
				 };
			
				 scope.$watch('clicked', function() {
			          if(angular.isUndefined(scope.data)){
							 scope.$watch('data', function(newData){
								 display_chart();
							 });
					   } else{
						   display_chart();
					   }
			      });
				 
				 /**
				  * function will render the chart
				  * based on the 'Year' or 'Ride' option 
				  * button click
				  */
				 function display_chart(){
					 if(scope.clicked){
						    scope.custom_chart('year');
						 }else if(!scope.clicked){
							 scope.custom_chart('all'); 
						 }
				 }
				 
			}
				
		  };
		
	}]);

