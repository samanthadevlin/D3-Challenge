var svgWidth = 960;
var svgHeight = 600;

var margin = {
    top: 30,
    right: 40,
    bottom: 150,
    left: 150
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";

var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(liveData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(liveData, d => d[chosenXAxis]) * 0.8,
        d3.max(liveData, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);

    return xLinearScale;

}

function yScale(liveData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(liveData, d => d[chosenYAxis]) * 0.8,
        d3.max(liveData, d => d[chosenYAxis]) * 1.2
        ])
        .range([height, 0]);

    return yLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderAxesX(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

function renderAxesY(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
}


// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));


    return circlesGroup;
}

// Render the state names for each circle
function renderStateAbbr(stateAbbr, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    stateAbbr.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]))
        .attr("y", d => newYScale(d[chosenYAxis]));


    return stateAbbr;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    if (chosenXAxis === "poverty") {
        var labelx = "In Poverty (%)";
    }
    else if(chosenXAxis === "age") {
        var labelx = "Age (Median):";
    }
    else {
        var labelx = "Income: $";
    }

    if (chosenYAxis === "healthcare") {
        var labely = "Healthcare: ";
    }
    else if(chosenYAxis === "smokes") {
        var labely = "Smoke: ";
    }
    else {
        var labely = "Obesity: $";
    }




    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        //.offset([80, -60])
        .style("font-size", "8px")
        .html(function(d) {
            return (`${d.state}<br>${labelx} ${formatAxis(d[chosenXAxis], chosenXAxis)}<br>
        ${labely} ${formatAxis(d[chosenYAxis, chosenYAxis])}`)
        });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function (data) {
        toolTip.show(data);
    })
        // onmouseout event
        .on("mouseout", function (data, index) {
            toolTip.hide(data);
        });

    return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function (liveData, err) {
    if (err) throw err;

    // parse data
    liveData.forEach(function (data) {
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.obesity = +data.obesity;
        data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.smokes = +data.smokes;

    });

    // xLinearScale function above csv import
    var xLinearScale = xScale(liveData, chosenXAxis);

    var yLinearScale = yScale(liveData, chosenYAxis);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // append y axis
    chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);

    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(liveData)
        .enter()
        .append("circle")
        .attr("class", "stateCircle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 12)
        .attr("fill", "pink")
        .attr("opacity", ".5");


    var stateAbbr = chartGroup.selectAll("abbr")
        .data(liveData)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("class", "stateText")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("font-size", "8px")


    // Create group for two x-axis labels
    var labelsGroupX = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertyLabel = labelsGroupX.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("In Poverty (%)");

    var ageLabel = labelsGroupX.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age") // value to grab for event listener
        .classed("inactive", true)
        .text("Age (Median)");

    var houseLabel = labelsGroupX.append("text")
        .attr("x", 0)
        .attr("y", 80)
        .attr("value", "income") // value to grab for event listener
        .classed("inactive", true)
        .text("Household Income (median) ");

    // append y axis
    var labelsGroupY = chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        //.attr("dy", "1em")
        //.classed("axis-text", true)
        //.text("Obesity (%)");
    var healthLabel = labelsGroupY.append("text")
        .attr("dx", "-10em")
        .attr("dy", "-2em")
        .attr("value", "healthcare") // value to grab for event listener
        .classed("active", true)
        .text("Poor Healthcare (%)");

    var smokesLabel = labelsGroupY.append("text")
        .attr("dx", "-10em")
        .attr("dy", "-4em")
        .attr("value", "smokes") // value to grab for event listener
        .classed("inactive", true)
        .text("Smokes (%)");

    var obeseLabel = labelsGroupY.append("text")
        .attr("dx", "-10em")
        .attr("dy", "-6em")
        .attr("value", "obesity") // value to grab for event listener
        .classed("inactive", true)
        .text("Obese (%)");
    
  
    // updateToolTip function above csv import
    // circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

    // x axis labels event listener
    labelsGroupX.selectAll("text")
        .on("click", function () {
            // get value of selection
            var xvalue = d3.select(this).attr("value");
            if (xvalue !== chosenXAxis) {

                // replaces chosenXAxis with value
                chosenXAxis = xvalue;
                console.log(value, chosenXAxis);

                // console.log(chosenXAxis)

                // functions here found above csv import
                // updates x scale for new data
                xLinearScale = xScale(liveData, chosenXAxis);

                // updates x axis with transition
                xAxis = renderAxesX(xLinearScale, xAxis);

                // updates circles with new x values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

                // updates tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                // changes classes to change bold text
                if (chosenXAxis === "poverty") {
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    houseLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    
                }
                else if (chosenXAxis === "age"){
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    houseLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else{
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    houseLabel
                        .classed("active", true)
                        .classed("inactive", false);// handle the third option
                }
            }
        })

    labelsGroupX.selectAll("text")
        .on("click", function () {
            // get value of selection
            var xvalue = d3.select(this).attr("value");
            if (xvalue !== chosenXAxis) {

                // replaces chosenXAxis with value
                chosenXAxis = xvalue;
                console.log(value, chosenXAxis);

                // console.log(chosenXAxis)

                // functions here found above csv import
                // updates x scale for new data
                xLinearScale = xScale(liveData, chosenXAxis);

                // updates x axis with transition
                xAxis = renderAxesX(xLinearScale, xAxis);

                // updates circles with new x values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

                // updates tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                stateAbbr = renderStateAbbr(stateAbbr, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
                // changes classes to change bold text
                if (chosenXAxis === "poverty") {
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    houseLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    
                }
                else if (chosenXAxis === "age"){
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    houseLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else{
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    houseLabel
                        .classed("active", true)
                        .classed("inactive", false);// handle the third option
                }
            }
        })
    labelsGroupY.selectAll("text")
    .on("click", function () {
        // get value of selection
        var yvalue = d3.select(this).attr("value");
        if (yvalue !== chosenYAxis) {

            // replaces chosenXAxis with value
            chosenYAxis = yvalue;
            console.log(value, chosenYAxis);

            // console.log(chosenXAxis)

            // functions here found above csv import
            // updates x scale for new data
            yLinearScale = yScale(liveData, chosenYAxis);

            // updates x axis with transition
            yAxis = renderAxesY(yLinearScale, yAxis);

            // updates circles with new x values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

            stateAbbr = renderStateAbbr(stateAbbr, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
            // changes classes to change bold text
            if (chosenYAxis === "smokes") {
                smokesLabel
                    .classed("active", true)
                    .classed("inactive", false);
                healthLabel
                    .classed("active", false)
                    .classed("inactive", true);
                obeseLabel
                    .classed("active", false)
                    .classed("inactive", true);
                
            }
            else if (chosenYAxis === "obesity"){
                smokesLabel
                    .classed("active", false)
                    .classed("inactive", true);
                healthLabel
                    .classed("active", false)
                    .classed("inactive", true);
                obeseLabel
                    .classed("active", true)
                    .classed("inactive", false);
            }
            else{
                smokesLabel
                    .classed("active", false)
                    .classed("inactive", true);
                healthLabel
                    .classed("active", true)
                    .classed("inactive", false);
                obeseLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
        }
    })





}).catch(function (error) {
    console.log(error);
});