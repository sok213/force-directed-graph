var dataObj, nodes, links,
		width = $('svg').width(),
		height = $('svg').height();

// Ajax call to fixed dataset.
$.ajax({
	type: 'GET',
	async: false,
	url: 'https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json',
	success: function(data) {
		// Stores json data into global variable.
		dataObj = JSON.parse(data);
	},
	error: function(err) {
		alert(err);
	}
});

nodeStore = dataObj.nodes;
linkStore = dataObj.links;
nodes = [];
links = [];

nodeStore.filter(function(d, i) {
  nodes.push({ 'id': d.country, 'group': d.code });
});

linkStore.filter(function(d, i) {
  links.push({ 'source': nodeStore[d.source].country, 'target': nodeStore[d.target].country });
});

dataObj = 
[{ 'nodes': nodes, 'links': links }];

var svg = d3.select("svg");
var color = d3.scaleOrdinal(d3.schemeCategory20);

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody().distanceMax(160))
    .force("center", d3.forceCenter(width / 2, height / 2.4));

dataObj.map(function(graph) {

  var link = svg.append("g")
      .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line");

var node = svg.append("g")
    .attr("class", "nodes")
  .selectAll("image")
  .data(graph.nodes)
  .enter().append("svg:image")
    .attr("xlink:href",function(d) { return 'sprites/'+d.group+'.png'})
    .attr("class", function(d) { return "flag"; })
    .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));
 
  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .distance(15)
      .links(graph.links);

  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; });
  }
});

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}
