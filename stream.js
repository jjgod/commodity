d3.csv("commodity.csv", function(data) {
    var commodityTypes = d3.keys(data[0]);
    var colors         = [ "#446E86", "#3E9CA4", "#A7BDA8", "#C1CAAF", "#D3DDBB", "#2A0606", "#1E5957", "#AEAC7C", "#E9CC88", "#5B8584" ];
    var commodityData = commodityTypes.map(function(type) {
        return data.map(function(row, i) {
            return { x: i, y: 32.0 + parseFloat(row[type]), t: type };
        });
    });
    var commodityPrices = d3.layout.stack().offset("silhouette")(commodityData);

    var w = 2000,
        h = 600,
        m = 20,
        base = h,
        mx = data.length - 1,
        my = d3.max(commodityPrices, function(d) {
          return d3.max(d, function(d) {
            return d.y0 + d.y;
          });
        });

    var parse = d3.time.format("%Y-%m").parse;
    var from = parse("2002-01"), to = parse("2011-12");
    var x = d3.time.scale().range([0, w]),
        xAxis = d3.svg.axis().scale(x).tickSize(-base);
    x.domain([from, to]);

    var area = d3.svg.area()
        .x(function(d) { return d.x * w / mx; })
        .y0(function(d) { return h - d.y0 * h / my; })
        .y1(function(d) { return h - (d.y + d.y0) * h / my; });

    var vis = d3.select("#chart")
      .append("svg")
        .attr("width", w)
        .attr("height", h + m);

    vis.selectAll("path")
        .data(commodityPrices)
      .enter().append("path")
        .style("fill", function(d, i) { return d3.rgb(colors[i]); })
        .attr("d", area);

    vis.append("svg:g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + base + ")")
        .call(xAxis);
});

