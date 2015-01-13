var app1 = angular.module('bubbleDirective',[]);
alert("Inside the bubble directive");
app1.directive('bubble',function(){
	return{
		restrict	:	'E',
		scope		:	{data:'='},
		/*templateUrl		:	'bubbleChart.html',*/
		link : function(scope,$timeout){
			$timeout(function(){
			 var width = 800,
		      height = 700,
		      tooltip = CustomTooltip("tooltip", 240),
		      layout_gravity = -0.01,
		      damper = 0.1,
		      nodes = [],
		      data = scope.data,
		      vis, force, circles, radius_scale;
			 console.log("Printing the value of the node:"+scope.data);
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
	    alert("max amount:="+max_amount);
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
	      console.log("Printing the value of the node:"+JSON.stringify(node));
	      nodes.push(node);
	    });
	    /*console.log("Printing the value of the node:"+JSON.stringify(nodes[0]));*/
	    nodes.sort(function(a, b) {return b.value- a.value; });

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
	    
	    
	    function charge(d) {
	        return -Math.pow(10, 2.0) / 8;
	      }

	      function start() {
	        force = d3.layout.force()
	                .nodes(nodes)
	                .size([width, height]);
	      }

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

	      function move_towards_center(alpha) {
	        return function(d) {
	          d.x = d.x + (center.x - d.x) * (damper + 0.02) * alpha;
	          d.y = d.y + (center.y - d.y) * (damper + 0.02) * alpha;
	        };
	      }

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

	      function move_towards_year(alpha) {
	        return function(d) {
	          var target = year_centers[d.year];
	          d.x = d.x + (target.x - d.x) * (damper + 0.02) * alpha * 1.1;
	          d.y = d.y + (target.y - d.y) * (damper + 0.02) * alpha * 1.1;
	        };
	      }


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

	      function hide_years() {
	          var years = vis.selectAll(".years").remove();
	      }


	      function show_details(data, i, element) {
	        d3.select(element).attr("stroke", "black");
	        var content = "<span class=\"name\">Asset:</span><span class=\"value\"> " + data.asset + "</span><br/>";
	        content +="<span class=\"name\">Op Cost:</span><span class=\"value\"> $" + data.opcost + "million </span><br/>";
	        content +="<span class=\"name\">Year:</span><span class=\"value\"> " + data.year + "</span>";
	        tooltip.showTooltip(content, d3.event);
	      }

	      function hide_details(data, i, element) {
	        d3.select(element).attr("stroke", function(d) { return d3.rgb(fill_color(d.year)).darker();} );
	        tooltip.hideTooltip();
	      }
			},1000);
		}	
			
			
			
			
			
						/*function(scope,element,attrs){
							var height = 500;
							var width = 700;
							var padding = 50;
							var dataSet = scope.data;						
							var xScale = d3.scale.linear()
											.domain([0,d3.max(dataSet,function(d){return d[0];})])
											.range([padding,width-padding*2]);

							var yScale = d3.scale.linear()
											.domain([0,d3.max(dataSet,function(d){return d[1];})])
											.range([height-padding,padding]);

							var rScale = d3.scale.linear()
											.domain([0,d3.max(dataSet,function(d){return d[2];})])
											.range([0,100]);

							var xAxis = d3.svg.axis()
											.scale(xScale)
											.orient("bottom")
											.ticks(5);

							var yAxis = d3.svg.axis()
											.scale(yScale)
											.orient("left")
											.ticks(5);

							var svg = d3.select("body")
										.append("svg")
										.attr("width",width)
										.attr("height",height);

							var circle = svg.selectAll("circle")
											.data(dataSet)
											.enter()
											.append("circle")
											.attr("cx",function(d){
												return xScale(d[0]);
											})
											.attr("cy",function(d){
												return yScale(d[1]);
											})
											.attr("r",function(d){
												var x;
												if(d[2]<=0)
													x = 30;
												else
													x = rScale(d[2]);
												return x;
											})
											.attr("opacity",function(d){
												var x = Math.random();
												var y = x<0.3?(x+0.2):x;
												return y;
											})
											.attr("fill",function(d){
												var randomNo = Math.round(Math.random()*1000000);
												var x = "#"+ randomNo;
												var y = randomNo / 100000;
												if(y<3){
													y+=4;
													x = "#"+y+Math.round(Math.random()*100000);
												}
												return x;})
											.attr("stroke","red");
											
							var text = svg.selectAll("text")
											 .data(dataSet)
											 .enter()
											 .append("text")
											 .text(function(d){
												 return d[2];
											 })
											 .attr("x",function(d){
												 return xScale(d[0]);
											 })
											 .attr("y",function(d){
												 return yScale(d[1]);
											 })
											 .attr("fill","black");

							svg.append("g").attr("class","axis").attr("transform","translate(0,"+(height-padding)+")").call(xAxis);
							svg.append("g").attr("class","axis").attr("transform","translate("+padding+",0)").call(yAxis);
		}*/
	};
	
});




