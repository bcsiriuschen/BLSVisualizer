//load data into json tree format

var group1_data = [];
var group2_data = [];
var group3_data = [];

var plot_data = [];
treeJSON = d3.json('data.json', function(error, treeData){


var root = treeData;
var drop_zone = [{"number":1, "count":0}];//, {"number":2, "count":0}];

var selected_zone = null;
var selected_node = null;

//layout size for trees and drop area
var margin = {top: 30, right: 60, bottom: 30, left: 120},
    svg_width = 400,
    svg_height = 380,
    drop_width = 300,
    drop_height = 270,
//    tree_width = svg_width - drop_width - margin.right - margin.left,
//    tree_height = svg_height - margin.top - margin.bottom;
    tree_width = 610,
    tree_height = 820
;

    
var i = 0,
    duration = 750;

var tree = d3.layout.tree()
    .size([tree_height, tree_width]);

var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

//create svg for visualization
var svg = d3.select("#tree_div").append("svg")
    .attr("width", svg_width)
    .attr("height", svg_height);

//Tree area
var tree_group = svg.append("g")
    .attr("id", "tree_group")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
//Drop area
var drop_group1 = svg.append("g")
    .attr("id", "drop_group1")
    .attr("transform", "translate(" + (50+tree_width) + "," + margin.top + ")"); 
    
var drop_group2 = svg.append("g")
    .attr("id", "drop_group2")
    .attr("transform", "translate(" + (50 + tree_width ) + "," + (margin.top+drop_height+30) + ")");

var drop_group3 = svg.append("g")
    .attr("id", "drop_group3")
    .attr("transform", "translate(" + (50 + tree_width ) + "," + (margin.top+drop_height*2+60) + ")");
    
// Chart area
    
var chart_area1 = svg.append("g")
	.attr("id", "chart_area")
	.attr("transform", "translate(" + (margin.left + tree_width + drop_width + 100) + "," + (margin.top - 10) + ")");

var chart_area2 = svg.append("g")
	.attr("id", "chart_area")
	.attr("transform", "translate(" + (margin.left + tree_width + drop_width + 100) + "," + (margin.top + 265) + ")");
	
var chart_area3 = svg.append("g")
	.attr("id", "chart_area")
	.attr("transform", "translate(" + (margin.left + tree_width + drop_width + 100) + "," + (margin.top + 540) + ")");

    
var dragItem = null;
var dragGroup = -1;
var strokeWidth = 5;

tree_group.append('rect')
.attr('class', 'bgRect')
.attr('width', tree_width)
.attr('height', (tree_height+50))
.attr('x', '-100')
.attr('y', '0')
.attr("opacity", 0.2) // change this to zero to hide the target area
.style("stroke", "black")
.style("stroke-width", strokeWidth)
.style("fill", "grey");

tree_group.append('text')
.attr('class', 'viewTitle')
.attr("x", '-90px')
.attr("y", '-5px')
.style("font-weight", "bold")
.text("Tree View");


//Create area to drop nodes
drop_group1.append("rect")
.attr('class', 'bgRect')
.attr('width', drop_width)
.attr('height', drop_height)
.attr("opacity", 0.2) // change this to zero to hide the target area
.style("fill", "grey")
.style("stroke", "black")
.style("stroke-width", strokeWidth)
.on("mouseover", function() {
    if (dragItem)
	    dragGroup = 1;
})
.on("mouseout", function(d) {
    dragGroup = -1;
});

//Create area to drop nodes
drop_group2.append("rect")
.attr('class', 'bgRect')
.attr('width', drop_width)
.attr('height', drop_height)
.attr("opacity", 0.2) // change this to zero to hide the target area
.style("fill", "grey")
.style("stroke", "black")
.style("stroke-width", strokeWidth)
.on("mouseover", function() {
    if (dragItem)
	    dragGroup = 2;
})
.on("mouseout", function(d) {
    dragGroup = -1;
});

//Create area to drop nodes
drop_group3.append("rect")
.attr('class', 'bgRect')
.attr('width', drop_width)
.attr('height', drop_height)
.attr("opacity", 0.2) // change this to zero to hide the target area
.style("fill", "grey")
.style("stroke", "black")
.style("stroke-width", strokeWidth)
.on("mouseover", function() {
    if (dragItem)
	    dragGroup = 3;
})
.on("mouseout", function(d) {
    dragGroup = -1;
});


drop_group1.append('text')
.attr('class', 'viewTitle')
.attr("y", "-5px")
.style("font-weight", "bold")
.text("Plot 1")
;

drop_group1.append('text')
.attr('class', 'group_empty')
.attr('x', '250')
.attr('y', '0')
.attr('fill', 'blue')
.on('click', function(){
    group1_data.forEach(function(d){ d.plot = false});
    group1_data = [];
    drop_group1.selectAll('text.data').remove();
    update(root);
    draw_chart()
})
.text('Clear')
;


drop_group2.append('text')
.attr('class', 'viewTitle')
.attr("y", "-5px")
.style("font-weight", "bold")
.text("Plot 2");

drop_group2.append('text')
.attr('class', 'group_empty')
.attr('x', '250')
.attr('y', '0')
.attr('fill', 'blue')
.on('click', function(){
    group2_data.forEach(function(d){ d.plot = false});
    group2_data = [];
    drop_group2.selectAll('text.data').remove();
    update(root);
    draw_chart()
})
.text('Clear')
;    
    
drop_group3.append('text')
.attr('class', 'viewTitle')
.attr("y", "-5px")
.style("font-weight", "bold")
.text("Plot 3");
    
drop_group3.append('text')
.attr('class', 'group_empty')
.attr('x', '250')
.attr('y', '0')
.attr('fill', 'blue')
.on('click', function(){
    group3_data.forEach(function(d){ d.plot = false});
    group3_data = [];
    drop_group3.selectAll('text.data').remove();
    update(root);
    draw_chart()
})
.text('Clear')
;    

d3.select(".btn-row").append('input')
  .attr('class', 'btn btn-default btn-lg')
  .attr('value','Quick Start - Gender')
  .on("click",quickStartGender);

d3.select(".btn-row").append('input')
  .attr('class', 'btn btn-default btn-lg')
  .attr('value','Quick Start - Race')
  .on("click",quickStartRace);

d3.select(".btn-row").append('input')
  .attr('class', 'btn btn-default btn-lg')
  .attr('value','Clear All')
  .on("click",clearAll);

  
/*
drop_group.selectAll("rect").data(drop_zone).enter().append("rect")
.attr('class', 'dropRect')
.attr('width', '250')
.attr('height', '800')
.attr("opacity", 0.2) // change this to zero to hide the target area
.style("fill", "grey")
.attr("y", function (d) { return ((d.number-1)*250)})
.attr('pointer-events', 'mouseover')
.on("mouseover", function(d) {
    selected_zone = d.number;
    console.log(selected_zone);
})
.on("mouseout", function(d) {
    selected_zone = null;
    console.log("mouseoutzone");
});
*/

//Define drag and drop behavior on nodes
var bodyDrag = false;
var drag = d3.behavior.drag()  
             .on('dragstart', function(d) {
                d3.event.sourceEvent.stopPropagation();
                dragStarted = true;
                bodyDrag = true;
                
                
    svg.append("circle")
    	.attr("class", "dragShape")
    	.attr("r", 30)
    	.style("fill-opacity", 0.2)
    	.attr("cx", 0)
        .attr("cy", 0)
	    .style("fill", "orange").moveToBack();
	    		
	    		dragItem = d;
	
             })
             .on('drag', function(d) {
                if (dragStarted){
                    d3.selectAll('.dropRect').attr('class', 'dropRect show');
                    dragStarted = null;
                }
             })
             .on('dragend', function(d) {
                    console.log("move node " + d.name + " to " + dragGroup);
             	if (dragGroup == 1 && group1_data.length < 6 && !dContains(group1_data, d)){
             		group1_data.push(d);
                    addElementsToGroup(1);
                    d.plot = true;
             	}else if (dragGroup == 2 && group2_data.length < 6 && !dContains(group2_data, d)){
             		group2_data.push(d);
                    addElementsToGroup(2);
                    d.plot = true;
             	}else if (dragGroup == 3 && group3_data.length < 6 && !dContains(group3_data, d)){
             		group3_data.push(d);
                    addElementsToGroup(3);
                    d.plot = true;
             	}
             /*
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
                */
                update(d);
                bodyDrag = false;
				svg.select("circle.dragShape").remove();
				dragItem = null;
            });
        
        
//var svgDrag = d3.select("body").on("mousemove", function(d){
var svgDrag = svg.on("mousemove", function(d){

	var pt = d3.mouse(this);
	
    if (bodyDrag) {
    	//console.log(pt[0]+".."+pt[1]);
    	svg.select("circle.dragShape")
    		.attr("cx", pt[0])
    		.attr("cy", pt[1]);
    }
				
});

d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

d3.selection.prototype.moveToBack = function() { 
    return this.each(function() { 
        var firstChild = this.parentNode.firstChild; 
        if (firstChild) { 
            this.parentNode.insertBefore(this, firstChild); 
        } 
    }); 
};

var maxDepth = 2;

//Show Tree
root.x0 = tree_height / 2;
root.y0 = 0;

root.children.forEach(collapse);
update(root);

draw_chart();
                 
var sameTwo = true;
function dContains(dList, item){
    sameTwo = false;
    dList.forEach( function (d) {
        if (item.orgName == d.orgName) {
            sameTwo = true;
        }
    });
    return sameTwo;
}

function clearAll(){
  for(var i = 0; i<group1_data.length; i++){
    group1_data[i].plot = false;
    update(group1_data[i]);
  }
  group1_data = [];
  drop_group1.selectAll('text.data').remove();

  for(var i = 0; i<group2_data.length; i++){
    group2_data[i].plot = false;
    update(group2_data[i]);
  }
  group2_data = [];
  drop_group2.selectAll('text.data').remove();

  for(var i = 0; i<group3_data.length; i++){
    group3_data[i].plot = false;
    update(group3_data[i]);
  }
  group3_data = [];
  drop_group3.selectAll('text.data').remove();
  draw_chart();
}

function quickStartRace(){
  clearAll();
  var population = root.children[0];
  var white, black, latino;
  if (population.children){
    white = population.children[2];
    black = population.children[3];
    latino = population.children[4];
    
  }else{
    white = population._children[2];
    black = population._children[3];
    latino = population._children[4];
  }
  white.plot = true;
  black.plot = true;
  latino.plot = true;
  group1_data.push(white);
  group1_data.push(black);
  group1_data.push(latino);
  addElementsToGroup(1);

  var employment = root.children[3];
  if (employment.children){
    white = employment.children[2];
    black = employment.children[3];
    latino = employment.children[4];
    
  }else{
    white = employment._children[2];
    black = employment._children[3];
    latino = employment._children[4];
  }
  white.plot = true;
  black.plot = true;
  latino.plot = true;
  group2_data.push(white);
  group2_data.push(black);
  group2_data.push(latino);
  addElementsToGroup(2);

var unemployment = root.children[8];
  if (unemployment.children){
    white = unemployment.children[2];
    black = unemployment.children[3];
    latino = unemployment.children[4];
    
  }else{
    white = unemployment._children[2];
    black = unemployment._children[3];
    latino = unemployment._children[4];
  }
  white.plot = true;
  black.plot = true;
  latino.plot = true;
  group3_data.push(white);
  group3_data.push(black);
  group3_data.push(latino);
  addElementsToGroup(3);
  draw_chart();  
}

function quickStartGender(){
  clearAll();
  var population = root.children[0];
  var man, woman;
  if (population.children){
    man = population.children[0];
    woman = population.children[1];
    
  }else{
    man = population._children[0];
    woman = population._children[1];
  }
  man.plot = true;
  woman.plot = true;
  group1_data.push(man);
  group1_data.push(woman);
  addElementsToGroup(1);

  var employment = root.children[3];
  if (employment.children){
    man = employment.children[0];
    woman = employment.children[1];
    
  }else{
    man = employment._children[0];
    woman = employment._children[1];
  }
  man.plot = true;
  woman.plot = true;
  group2_data.push(man);
  group2_data.push(woman);
  addElementsToGroup(2);

var unemployment = root.children[8];
  if (unemployment.children){
    man = unemployment.children[0];
    woman = unemployment.children[1];
    
  }else{
    man = unemployment._children[0];
    woman = unemployment._children[1];
  }
  man.plot = true;
  woman.plot = true;
  group3_data.push(man);
  group3_data.push(woman);
  addElementsToGroup(3);
  draw_chart();
}

function addElementsToGroup(cGroup){
    if (cGroup == 1){
        drop_group1.selectAll("text.data")
            .data(group1_data)
            .enter().append("text")
            .attr('class', 'data')
            .attr("x", 20)
            .attr("y", function(d, i){ return i*40+30;})
            .on("click", function(d, i){
                group1_data.splice(i, 1);
                drop_group1.selectAll('text.data').remove();

                addElementsToGroup(1);
                d.plot = false;
                update(d);
            })
            .text(function(d){return d.orgName;})
            .call(wrap, 250);
    }else if (cGroup == 2){
        drop_group2.selectAll("text.data")
            .data(group2_data)
            .enter().append("text")
            .attr('class', 'data')
            .attr("x", 20)
            .attr("y", function(d, i){ return i*40+30;})
            .on("click", function(d, i){
                group2_data.splice(i, 1);
                drop_group2.selectAll('text.data').remove();

                addElementsToGroup(2);
                d.plot = false;
                update(d);
            })
            .text(function(d){return d.orgName;})
            .call(wrap, 250);
    }else if (cGroup == 3){
        drop_group3.selectAll("text.data")
            .data(group3_data)
            .enter().append("text")
            .attr('class', 'data')
            .attr("x", 20)
            .attr("y", function(d, i){ return i*40+30;})
            .on("click", function(d, i){
                group3_data.splice(i, 1);
                drop_group3.selectAll('text.data').remove();

                addElementsToGroup(3);
                d.plot = false;
                update(d);
            })
            .text(function(d){return d.orgName;})
            .call(wrap, 250);
    }
    draw_chart();
}

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
    nodes.forEach(function(d) { 
        d.y = (d.depth - maxDepth + 1) * 250 - 80;
        d.x = d.x + 30;
    });

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
      .style("fill", function(d) { 
            if (d.max <= 100) {
                return d._children ? "green" : "#fff"; 
            }
            return d._children ? "red" : "#fff"; 
        })
        .style('stroke', function(d) {
            var color = "orange";
            if (d.max <= 100) color = "green"
            return color; 
        });

	
  nodeEnter.append("text")
  		.attr("class", function(d) { return "n"+d.id; })
      //.attr("x", function(d) { return d.children || d._children ? -10 : 10; })
      .attr("x", 15)
      .attr("dy", ".35em")
      //.attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
      .attr("text-anchor", "start")
      .text(function(d) { return d.name; })
      .style("fill-opacity", 1e-6)
//      .call(wrap, 250)
;
	
  nodeEnter.on("mouseover", function(d){
        	d3.select(this).select("text.n"+d.id).style("font-size", "13px").style("font-weight", "bold");
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
      .style("fill", function(d) { 
            if (d.max <= 100) {
                return d._children ? "green" : "#fff"; 
            }
            return d._children ? "orange" : "#fff"; 
        })
        .style('stroke', function(d) {
            var color = "orange";
            if (d.max <= 100) color = "green"
            return color; 
        });

  nodeUpdate.select("text")
      .style("fill-opacity", function(d){return d.plot? 0.2: 1;});

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
        .style('opacity', function(d) { 
            if (d.source.id == 25) return 0;
            else return 1;
        })
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
        maxDepth = d.depth;
        if (maxDepth < 2) maxDepth = 2;
    } else if (d._children) {
	    var cParent = d.parent;
        cParent.children.forEach(function(d2){
	        if (d2.children) d2._children = d2.children;
        	d2.children = null;
        });
        
        d.children = d._children;
        d._children = null;
        maxDepth = d.depth + 1;
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