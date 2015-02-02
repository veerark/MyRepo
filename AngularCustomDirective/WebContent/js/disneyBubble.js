var custom_bubble_chart = (function(d3, CustomTooltip) {
  "use strict";

  var width = 800,
      height = 700,
      tooltip = CustomTooltip("tooltip", 240),
      layout_gravity = -0.01,
      damper = 0.1,
      nodes = [],
      vis, force, circles, radius_scale;

  var center = {x: width / 2, y: height / 2};

  var year_centers = {
      "2010": {x: width / 4, y: height / 2},
      "2011": {x: width / 2, y: height / 2},
      "2012": {x: 2 * width / 3, y: height / 2}
    };

  var fill_color = d3.scale.ordinal()
                  .domain(["2010", "2011", "2012"])
                  .range(["#d84b2a", "#beccae", "#00FF00"]);

  function custom_chart(data) {
    var max_amount = d3.max(data, function(d) { return parseInt(d.total, 10); } );
    alert("max amount:="+max_amount);
    radius_scale = d3.scale.pow().exponent(0.5).domain([0, max_amount]).range([2, 85]);

    //create node objects from original data
    //that will serve as the data behind each
    //bubble in the vis, then add each node
    //to nodes to be used later
    console.log("Printing the value of the node:"+data.length);
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

  }

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

  var my_mod = {};
  my_mod.init = function (_data) {
    custom_chart(_data);
    start();
  };

  my_mod.display_all = display_group_all;
  my_mod.display_year = display_by_year;
  my_mod.toggle_view = function(view_type) {
    if (view_type == 'year') {
    	alert("Hi inside view_type"+view_type);
      display_by_year();
    } else{
      display_group_all();
      }
    };

  return my_mod;
})(d3, CustomTooltip);