//load data into json tree format
var plot_data = [];
treeJSON = d3.json('data.json', function(error, treeData){


var root = treeData;
var drop_zone = [{"number":1, "count":0}];//, {"number":2, "count":0}];

var selected_zone = null;
var selected_node = null;

//layout size for trees and drop area
var margin = {top: 30, right: 120, bottom: 30, left: 120},
    svg_width = 960,
    svg_height = 800,
    drop_width = 100,
    drop_height = svg_height - margin.top - margin.bottom,
    tree_width = svg_width - drop_width - margin.right - margin.left,
    tree_height = svg_height - margin.top - margin.bottom;

    
var i = 0,
    duration = 750;

var tree = d3.layout.tree()
    .size([tree_height, tree_width]);

var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

//create svg for visualization
var svg = d3.select("#tree_div").append("svg")
    .attr("width", svg_width)
    .attr("height", svg_height)

//Tree area
var tree_group = svg.append("g")
    .attr("id", "tree_group")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

//Drop area
var drop_group = svg.append("g")
    .attr("id", "drop_group")
    .attr("transform", "translate(" + (margin.left + tree_width) + "," + margin.top + ")")  


//Create area to drop nodes
drop_group.selectAll("rect").data(drop_zone).enter().append("rect")
.attr('class', 'dropRect')
.attr('width', '80')
.attr('height', '200')
.attr("opacity", 0.2) // change this to zero to hide the target area
.style("fill", "red")
.attr("y", function (d) { return ((d.number-1)*250)})
.attr('pointer-events', 'mouseover')
.on("mouseover", function(d) {
    selected_zone = d.number;
    console.log(selected_zone);
})
.on("mouseout", function(d) {
    selected_zone = null;
});

//Define drag and drop behavior on nodes
var drag = d3.behavior.drag()  
             .on('dragstart', function(d) {
                d3.event.sourceEvent.stopPropagation();
                dragStarted = true;
             })
             .on('drag', function(d) {
                if (dragStarted){
                    d3.selectAll('.dropRect').attr('class', 'dropRect show');
                    dragStarted = null;
                }
             })
			 
             .on('dragend', function(d) {
                d3.selectAll('.dropRect').attr('class', 'dropRect');
                if (selected_zone & !d.hasOwnProperty("drop_zone")){
                    console.log("move node " + d.name + " to " + selected_zone);
                    d["drop_zone"] = selected_zone;
                    d["position"] = drop_zone[selected_zone - 1]["count"]++;
                    plot_data.push(d);
                    console.log(plot_data);
                    updateDropZone();
                    draw_chart();
                }
                

            });


//Show Tree
root.x0 = tree_height / 2;
root.y0 = 0;

root.children.forEach(collapse);
update(root);

function collapse(d) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
}

function update(source) {

  // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse(),
        links = tree.links(nodes);

    // Normalize for fixed-depth.
    nodes.forEach(function(d) { d.y = d.depth * 180; });

    // Update the nodes…
    var node = tree_group.selectAll("g.node")
        .data(nodes, function(d) { return d.id || (d.id = ++i); });

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
        .on("click", click)
        	/*
        .on("mouseover", function(d){
            d3.select(this).append("text")
                .attr("class", "hover")
                .attr('transform', function(d){ 
                    return 'translate(10, 0)';
                })
                .text(d.name);
            
        })
        .on("mouseout", function(d){
            d3.select(this).select("text.hover").remove();
        });
            */

  nodeEnter.append("circle")
      .attr("r", 1e-6)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

	
  nodeEnter.append("text")
  		.attr("class", function(d) { return "n"+d.id; })
      //.attr("x", function(d) { return d.children || d._children ? -10 : 10; })
      .attr("x", 15)
      .attr("dy", ".35em")
      //.attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
      .attr("text-anchor", "start")
      .text(function(d) { return d.name; })
      .style("fill-opacity", 1e-6)
      .call(wrap, 150);
	
  nodeEnter.on("mouseover", function(d){
        	d3.select(this).select("text.n"+d.id).style("font-size", "16px").style("font-weight", "bold");
        })
        .on("mouseout", function(d){
        	d3.select(this).select("text.n"+d.id).style("font-size", "10px").style("font-weight", ""); 
        });

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

  nodeUpdate.select("circle")
      .attr("r", 10)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeUpdate.select("text")
      .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
      .remove();

  nodeExit.select("circle")
      .attr("r", 1e-6);

  nodeExit.select("text")
      .style("fill-opacity", 1e-6);

  // Update the links…
  var link = tree_group.selectAll("path.link")
      .data(links, function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
        var o = {x: source.x0, y: source.y0};
        return diagonal({source: o, target: o});
      });

  // Transition links to their new position.
  link.transition()
      .duration(duration)
      .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = {x: source.x, y: source.y};
        return diagonal({source: o, target: o});
      })
      .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
  d3.selectAll(".node").call(drag);
}

// Toggle children on click.
function click(d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
    } else {
        d.children = d._children;
        d._children = null;
    }
    update(d);
}

function updateDropZone(){

    var nodes = drop_group.selectAll("g.plot_node")
                .data(plot_data)

    var nodeEnter = nodes.enter().append("g")
        .attr("transform", function(d) { return "translate(" + 20 + "," + ((d.drop_zone-1)*250 + d.position*40 + 20) + ")"; })
        .attr("class", "plot_node");

        nodeEnter.append("circle")        
            .attr("opacity", 0.2)
            .attr("r", 20)
            .style("fill", "blue")
            .attr('pointer-events', 'none');

        nodeEnter.append("text")
            .text(function (d) {
                console.log(d);
                return d.orgName}); 
}

});

function wrap(text, width) {
    text.each(function () {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            x = text.attr("x"),
            y = text.attr("y"),
            dy = 0, //parseFloat(text.attr("dy")),
            tspan = text.text(null)
                        .append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan")
                            .attr("x", x)
                            .attr("y", y)
                            .attr("dy", ++lineNumber * lineHeight + dy + "em")
                            .text(word);
            }
        }
    });
}