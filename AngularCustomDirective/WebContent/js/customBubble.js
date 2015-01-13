var custom_bubble_chart = (function(d3, CustomTooltip) {
  "use strict";

  var width = 980,
      height = 700,
      tooltip = CustomTooltip("tooltip", 240),
      layout_gravity = -0.01,
      damper = 0.1,
      nodes = [],
      vis, force, circles, radius_scale;

  var center = {x: width / 2, y: height / 2};

  var severity_centers = {
      "Low": {x: width / 4, y: height / 2},
      "Medium": {x: width / 3, y: height / 2},
      "High": {x:  width / 2, y: height / 2},
      "Emergency": {x: 2 * width / 3, y: height / 2}
    };

  var fill_color = d3.scale.ordinal()
                  .domain(["Low", "Medium", "High", "Emergency"])
                  .range(["#d84b2a", "#beccae", "#00FF00", "#FF0000"]);

  //Function to plot the chart.
  function custom_chart(data) {
    radius_scale = d3.scale.pow().exponent(0.5).domain([0, 10000000]).range([2, 85]);

    //create node objects from original data
    //that will serve as the data behind each
    //bubble 
    data.forEach(function(d){
      var node = {
        id: d.defect_id,
        radius: radius_scale(parseInt(10000000, 10)),
        value: d.ITEMID,
        desc:d.DEFECT_DESC,
        status:d.STATUS_CD,
        group: d.SEVERITY_CD,
        env:d.ENV_CD,
        name: d.ASSIGNED_TO,
        org: d.DEFECT_DESC,        
        severity: d.SEVERITY_CD,
        detdt:d.DETECTED_DT,
        x: Math.random() * 900,
        y: Math.random() * 800
      };
      nodes.push(node);
    });
    nodes.sort(function(a, b) {return b.value- a.value; });

    vis = d3.select("#vis").append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("id", "svg_vis");

    circles = vis.selectAll("circle")
                 .data(nodes, function(d) {return d.id ;});

    circles.enter().append("circle")
      .attr("r", 0)
      .attr("fill", function(d) { return fill_color(d.group) ;})
      .attr("stroke-width", 2)
      .attr("stroke", function(d) {return d3.rgb(fill_color(d.group)).darker();})
      .attr("id", function(d) { return  "bubble_" + d.id; })
      .on("mouseover", function(d, i) {show_details(d, i, this);} )
      .on("mouseout", function(d, i) {hide_details(d, i, this);} );

    circles.transition().duration(2000).attr("r", function(d) { return 10; });

  }

  function charge(d) {
    return -Math.pow(10, 2.0) / 8;
  }

  //Start d3 force layout 
  function start() {
    force = d3.layout.force()
            .nodes(nodes)
            .size([width, height]);
  }

  //Display all the bubbles as group
  function display_group_all() {
    force.gravity(layout_gravity)
         .charge(charge)
         .friction(0.9)
         .on("tick", function(e) {
            circles.each(move_center(e.alpha))
                   .attr("cx", function(d) {return d.x;})
                   .attr("cy", function(d) {return d.y;});
         });
    force.start();
    hide_severity();
  }

  //Bubbles will be moved to center
  function move_center(alpha) {
    return function(d) {
      d.x = d.x + (center.x - d.x) * (damper + 0.02) * alpha;
      d.y = d.y + (center.y - d.y) * (damper + 0.02) * alpha;
    };
  }
  
  
  function display_by_severity() {
    force.gravity(layout_gravity)
         .charge(charge)
         .friction(0.9)
        .on("tick", function(e) {
          circles.each(move_towards_severity(e.alpha))
                 .attr("cx", function(d) {return d.x;})
                 .attr("cy", function(d) {return d.y;});
        });
    force.start();
    display_severity();
  }

  function move_towards_severity(alpha) {
    return function(d) {
      var target = severity_centers[d.severity];
      d.x = d.x + (target.x - d.x) * (damper + 0.02) * alpha * 1.1;
      d.y = d.y + (target.y - d.y) * (damper + 0.02) * alpha * 1.1;
    };
  }


  function display_severity() {
      var severity_x = {"Low": 160, "Medium": width / 3, "High": width /2 ,"Emergency": width - 160};
      var severity_data = d3.keys(severity_x);
      var severity = vis.selectAll(".severity")
                 .data(severity_data);

      severity.enter().append("text")
                   .attr("class", "severity")
                   .attr("x", function(d) { return severity_x[d]; }  )
                   .attr("y", 40)
                   .attr("text-anchor", "middle")
                   .text(function(d) { return d;});

  }

  function hide_severity() {
      var severity = vis.selectAll(".severity").remove();
  }


  function show_details(data, i, element) {
    d3.select(element).attr("stroke", "black");
    var content = "<span class=\"name\">Title:</span><span class=\"value\"> " + data.id + "</span><br/>";
    content +="<span class=\"name\">Severity:</span><span class=\"value\"> " + data.group + "</span><br/>";
    content +="<span class=\"name\">Desc:</span><span class=\"value\"> " + data.desc + "</span>";
    tooltip.showTooltip(content, d3.event);
  }

  function hide_details(data, i, element) {
    d3.select(element).attr("stroke", function(d) { return d3.rgb(fill_color(d.group)).darker();} );
    tooltip.hideTooltip();
  }

  var my_mod = {};
  my_mod.init = function (_data) {
    custom_chart(_data);
    start();
  };

  my_mod.display_all = display_group_all;
  my_mod.display_severity = display_by_severity;
  my_mod.toggle_view = function(view_type) {
    if (view_type == 'severity') {
      display_by_severity();
    } else {
      display_group_all();
      }
    };

  return my_mod;
})(d3, CustomTooltip);