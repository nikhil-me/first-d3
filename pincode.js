$(document).ready(function() {
    $("#slider").slider({
      value:5,
      min: 1,
      max: 10,
      step: 1,
      slide: function( event, ui ) {
        $("#rating").val(ui.value);
        redraw(ui.value.toString());
      }
    });
    $("#rating").val($("#slider").slider("value"));
    var w = 1200;
    var h = 500;
    var xy = d3.geo.equirectangular()
             .scale(1000);

    var path = d3.geo.path()
               .projection(xy);
    var svg = d3.select("#graph").insert("svg:svg")
              .attr("width", w)
              .attr("height", h);
            
    var states = svg.append("svg:g")
                 .attr("id", "states");
    var circles = svg.append("svg:g")
                  .attr("id", "circles");
    var labels = svg.append("svg:g")
                 .attr("id", "labels");
                 
    d3.json("world-countries.json", function(collection) {
      states.selectAll("path")
          .data(collection.features)
        .enter().append("svg:path")
          .attr("d", path)
                .on("mouseover", function(d) {
                    d3.select(this).style("fill","#6C0")
                        .append("svg:title")
                        .text(d.properties.name);})
                .on("mouseout", function(d) {
                    d3.select(this).style("fill","#ccc");})
    });

    var scalefactor=8;
    d3.csv("pincode.csv", function(csv) {
      circles.selectAll("circle")
          .data(csv)
        .enter()
        .append("svg:circle")
          .attr("cx", function(d, i) { return xy([+d["longitude"],+d["latitude"]])[0]; })
          .attr("cy", function(d, i) { return xy([+d["longitude"],+d["latitude"]])[1]; })
          .attr("r",  function(d) { return (+d["5"] * scalefactor); })
          .attr("title",  function(d) { return d["pincode"]+": "+Math.round(d["5"]); })
                .on("mouseover", function(d) {
                    d3.select(this).style("fill","#FC0");})
                .on("mouseout", function(d) {
                    d3.select(this).style("fill","steelblue");});
      labels.selectAll("labels")
          .data(csv)
        .enter()
        .append("svg:text")
            .attr("x", function(d, i) { return xy([+d["longitude"],+d["latitude"]])[0]; })
            .attr("y", function(d, i) { return xy([+d["longitude"],+d["latitude"]])[1]; })
            .attr("dy", "0.3em")
            .attr("text-anchor", "middle")
            .text(function(d) { return d["pincode"]; });
    });
    function redraw(rating) {
          circles.selectAll("circle")
        .transition()
              .duration(1000).ease("linear")
              .attr("r",  function(d) { return (+d[rating] * scalefactor); })
              .attr("title",  function(d) { return d["pincode"]+": "+Math.round(d[rating]); });
          labels.selectAll("text")
              .text(function(d) {
               return d["pincode"]; });
    }
    });