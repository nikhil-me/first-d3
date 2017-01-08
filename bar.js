var margin = {top: 20, right: 20, bottom: 70, left: 40},
    width = 600 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;



var x = d3.scale.ordinal().rangeRoundBands([0, width], 0.05);

var y = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom").ticks(10);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select("#bargraph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

d3.csv("pincode.csv", function(data, error) {

    data.forEach(function(d) {
        d.pincode = +d.pincode;
        // console.log(typeof d['1']);
        d.value = Number(d['1']) +
                  Number(d['2']) +
                  Number(d['3']) +
                  Number(d['4']) +
                  Number(d['5']) +
                  Number(d['6']) +
                  Number(d['7']) +
                  Number(d['8']) +
                  Number(d['9']) +
                  Number(d['10']);
    });

	 data.sort(function(a,b){
      return d3.descending(a.value, b.value);
   });

  data.splice(9);

  x.domain(data.map(function(d) { return d.pincode; }));
  y.domain([0, d3.max(data, function(d) { return d.value; })]);
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)" );

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end");

  svg.selectAll("bar")
      .data(data)
    .enter().append("rect")
      .style("fill", "steelblue")
      .attr("x", function(d) { return x(d.pincode); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); });

});
