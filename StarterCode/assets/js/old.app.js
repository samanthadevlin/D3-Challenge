// @TODO: YOUR CODE HERE!

// Chart Params
var svgWidth = 960;
var svgHeight = 500;

var margin = { top: 20, right: 40, bottom: 60, left: 50 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
  .select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

function updateData(sel, data) {
    sel.data(data);

    // Add missing circles
    sel
        .enter()
        .append("circle")
        .merge(sel)
        .attr("cx", function(d) {
            console.log(this);
            return d.poverty*10
        })
        .attr("cy", 50)
        .attr("r", d => 0.5*d.poverty)
        .attr("fill", "gray")

    // Revmoe extra circles
    sel.exit().remove()
}

// Import data from an external CSV file
// parse data
d3.csv("assets/data/data.csv").then((data) => {
    console.table(data.slice(0,3))
    let smolData = data.slice(0,3);
    let svg = d3.select("#scatter").append("svg");
    svg.attr("width", "600").attr("height", "400")

    let circles = svg.selectAll("circle");

    //COPY AND PASTE FROM LECTURE FIX IT 
    // create scales
    var xLinearScale = d3.scaleTime()
      .domain(d3.extent(medalData, d => d.date))
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(medalData, d => d.medals)])
      .range([height, 0]);

    // create axes
    var xAxis = d3.axisBottom(xTimeScale);
    var yAxis = d3.axisLeft(yLinearScale).ticks(6);

    // append circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(medalData)
    .enter()
    .append("circle")
    .attr("cx", d => xTimeScale(d.date))
    .attr("cy", d => yLinearScale(d.medals))
    .attr("r", "10")
    .attr("fill", "gold")
    .attr("stroke-width", "1")
    .attr("stroke", "black");

    // BELOW DONE W/ SONDRA 

    circles.data(smolData)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
            return d.poverty*10
        })
        .attr("cy", 50)
        .attr("r", 10)
        .attr("fill", "gray")

    let lessSmolData = data.slice(5,15);

    console.table(lessSmolData);
    
    let sel = svg.selectAll("circle").data(lessSmolData);

    console.log(sel.data());

     

    sel
        .enter()
        .append("circle")
        .merge(sel)
        .attr("cx", function(d) {
            console.log(this);
            return d.poverty*10
        })
        .attr("cy", 50)
        .attr("r", d => 0.5*d.poverty)
        .attr("fill", "gray")

    sel.exit().remove()

    lessSmolData = data.slice(40,48);
    sel = svg.selectAll("circle");
    updateData(sel, lessSmolData);
})
