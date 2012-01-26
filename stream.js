d3.csv("commodity.csv", function(data) {
    var n = 20, // number of layers
        m = 200, // number of samples per layer
        color = d3.interpolateRgb("#aad", "#556");

    var commodityTypes = [ "nickel", "lead", "iron", "gold", "copper", "zinc", "uranium", "tin", "silver" ];
    var commodityData = commodityTypes.map(function(type) {
        return data.map(function(row, i) {
            return { x: i, y: +row[type] };
        });
    });
    var commodityPrices = d3.layout.stack().offset("silhouette")(commodityData);

    var w = 1960,
        h = 500,
        mx = m - 1,
        my = d3.max(commodityPrices, function(d) {
          return d3.max(d, function(d) {
            return d.y0 + d.y;
          });
        });

    var area = d3.svg.area()
        .x(function(d) { return d.x * w / mx; })
        .y0(function(d) { return h - d.y0 * h / my; })
        .y1(function(d) { return h - (d.y + d.y0) * h / my; });

    var vis = d3.select("#chart")
      .append("svg")
        .attr("width", w)
        .attr("height", h);

    vis.selectAll("path")
        .data(commodityPrices)
      .enter().append("path")
        .style("fill", function() { return color(Math.random()); })
        .attr("d", area);
});

