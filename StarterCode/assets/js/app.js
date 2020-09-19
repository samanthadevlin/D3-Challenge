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
d3.csv("assets/data/data.csv").then((data) => {
    console.table(data.slice(0,3))
    let smolData = data.slice(0,3);
    let svg = d3.select("#scatter").append("svg");
    svg.attr("width", "600").attr("height", "400")

    let circles = svg.selectAll("circle");

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
