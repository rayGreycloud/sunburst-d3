function sunburst() {
  // Data set
  var nodeData = {
      "name": "TOPICS", "children": [{
          "name": "Topic A",
          "children": [{"name": "Sub A1", "size": 4}, {"name": "Sub A2", "size": 4}]
      }, {
          "name": "Topic B",
          "children": [{"name": "Sub B1", "size": 3}, {"name": "Sub B2", "size": 3}, {
              "name": "Sub B3", "size": 3}]
      }, {
          "name": "Topic C",
          "children": [{"name": "Sub A1", "size": 4}, {"name": "Sub A2", "size": 4}]
      }]
  };
  // Set Size
  const width = 500;
  const height = 500;
  const radius = Math.min(width, height) / 2;
  // Scale map to array of colors
  let color = d3.scaleOrdinal(d3.schemeCategory20b);

  // Set up SVG workspace
  const g = d3.select('svg')
    .attr('width', width)
    .attr('height', height)
    // Create group
    .append('g')
    // Move center of <g> element to center of svg
    .attr('transform', `translate(${width / 2}, ${height / 2})`);

  // Formatting data
  const partition = d3.partition()
    // Set Size
    // Calculate radians and set sunburst radius
    .size([2 * Math.PI, radius]);

  //  Find data root
  const root = d3.hierarchy(nodeData)
    .sum(function (d) { return d.size});

  // Size arcs
  partition(root);
  let arc = d3.arc()
    .startAngle(function (d) { return d.x0})
    .endAngle(function (d) { return d.x1})
    .innerRadius(function (d) { return d.y0})
    .outerRadius(function (d) { return d.y1});

  // Put pieces together
  g.selectAll('path')
    .data(root.descendants())
    .enter()
    .append('path')
    .attr('display', function (d) { return d.depth ? null : "none"; })
    .attr('d', arc)
    .style('stroke', '#fff')
    .style('fill', function (d) {
      return color((d.children ? d : d.parent).data.name);
    });
}
