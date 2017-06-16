function sunburst() {
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

  // Get data from json
  d3.json('data/myData.json', function(error, nodeData) {
    if (error) throw error;

    //  Find root node, begin sizing
    const root = d3.hierarchy(nodeData)
      .sum(function (d) { return d.size});

    // Size arcs
    partition(root);
    let arc = d3.arc()
      .startAngle(function (d) { return d.x0})
      .endAngle(function (d) { return d.x1})
      .innerRadius(function (d) { return d.y0})
      .outerRadius(function (d) { return d.y1});

    // Add <g> element for each node
    g.selectAll('g')
      .data(root.descendants())
      .enter()
      .append('g').attr('class', 'node')
      // Add path elements
      .append('path').attr('display', function (d) { return d.depth ? null : "none"; })
      // Draw paths
      .attr('d', arc)
      // Color lines
      .style('stroke', '#fff')
      // Color slices
      .style('fill', function (d) {
        return color((d.children ? d : d.parent).data.name);
      });

    // Add label for each node
    g.selectAll('.node')
      // Add empty text element to each node
      .append('text')
      // Move ref point for text element to center of arc
      .attr('transform', function (d) {
        return `translate(${arc.centroid(d)})rotate( ${computeTextRotation(d)})`;
      })
      // Move text element to left to look centered
      .attr('dx', '-20')
      // Pull text element closer to center
      .attr('dy', '.5em')
      // Get name attribute for each node
      .text(function (d) {
        return d.parent ? d.data.name : ''
      });
    // Calculate distance to rotate each label
    function computeTextRotation(d) {
      const angle = (d.x0 + d.x1) / Math.PI * 90;
      // Avoid upside down labels
      // Labels as rims
      return (angle < 120 || angle > 270) ? angle : angle + 180;
      // alternate - labels as spokes
      // return (angle < 180) ? angle - 90 : angle + 90;
    }
  });

}
