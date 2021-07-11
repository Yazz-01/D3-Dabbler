var svgWidth = 960;
var svgHeight = 500;
var svgAxisMargin = 0.2;
var svgCirclesRadius = 10;
var svgCirclesColor = "#88bdd3";
var svgAxesSpacing = 17;
var svgTransitionDuration = 1000;


var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};


var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// these are the helper objects to hold the data for each axis
var xAxes = [{
        option: "poverty",
        label: "In Poverty (%)"
    },
    {
        option: "age",
        label: "Age (Median)"
    },
    {
        option: "income",
        label: "Household Income (USD Median)"
    }
];
var yAxes = [{
        option: "healthcare",
        label: "Lacks Healthcare (%)"
    },
    {
        option: "smokes",
        label: "Smokes (%)"
    },
    {
        option: "obesity",
        label: "Obese (%)"
    }
];


// Initial Params
var chosenXAxis = xAxes[0].option;
var chosenYAxis = yAxes[0].option;



// function used for updating x-scale var upon click on axis label
// function used for updating x-scale var upon click on axis label
function xScale(healthData, chosenXAxis) {
    // create xLinearScale
    return d3.scaleLinear()
        .domain([d3.min(healthData, d => d[chosenXAxis]) * (1 - svgAxisMargin),
            d3.max(healthData, d => d[chosenXAxis]) * (1 + svgAxisMargin)
        ])
        .range([0, width]);
}

// function used for updating y-scale var upon click on axis label
function yScale(healthData, chosenYAxis) {
    // create yLinearScale
    return d3.scaleLinear()
        .domain([0, d3.max(healthData, d => d[chosenYAxis]) * (1 + svgAxisMargin)])
        .range([height, 0]);
}

// function used for updating xAxis var upon click on axis label
function renderXAxis(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    // use a transition to shift the axis
    xAxis.transition()
        .duration(svgTransitionDuration)
        .call(bottomAxis);
    //
    return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderYAxis(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
    // use a transition to shift the axis
    yAxis.transition()
        .duration(svgTransitionDuration)
        .call(leftAxis);
    //
    return yAxis;
}


// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.selectAll("circle")
        .transition()
        .duration(svgTransitionDuration)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));
    // use a transition to shift the circles' text
    circlesGroup.selectAll("text")
        .transition()
        .duration(svgTransitionDuration)
        .attr("x", d => newXScale(d[chosenXAxis]))
        .attr("y", d => newYScale(d[chosenYAxis]));
    //
    return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    var xlabel = "";
    var ylabel = "";
    // Looping through X axes to grab the object that corresponds
    for (var i = 0; i < xAxes.length; i++)
        if (chosenXAxis === xAxes[i].option)
            xLabel = xAxes[i].label;
        // Looping through Y axes to grab the object that corresponds
    for (var i = 0; i < yAxes.length; i++)
        if (chosenYAxis === yAxes[i].option)
            yLabel = yAxes[i].label;
        // Adding Tooltip
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([110, 0])
        .html(d => [
            d.state,
            formatToolTipText(xLabel, d[chosenXAxis]),
            formatToolTipText(yLabel, d[chosenYAxis])
        ].join("<br>"));

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
            toolTip.show(data);
        })
        // onmouseout event
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });

    return circlesGroup;
}


// Import Data
d3.csv("data.csv").then(function(healthData, err) {
    if (err) throw err;
    // Step 1: Parse Data
    // ==============================
    healthData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.smokes = +data.smokes;
        data.age = +data.age;
        data.obesity = +data.obesity;
        console.log(data.poverty);
    });
    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = xScale(healthData, chosenXAxis);


    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(healthData, d => d.smokes)])
        .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // Step 4: Append Axes to the chart
    // ==============================

    chartGroup.append("g")
        .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d.smokes))
        //.attr("class", function(d) {
        //  return "StateCircle" + d.abbr;

    //})
    .attr("r", "15")
        .attr("fill", "pink")
        .attr("opacity", ".5");

    // Create group for two x-axis labels
    var labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertyLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("Poverty (%))");

    var ageLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age") // value to grab for event listener
        .classed("inactive", true)
        .text("Age (years)");

    // append y axis
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .text("Smokes (num)");

    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);


    // x axis labels event listener
    labelsGroup.selectAll("text")
        .on("click", function() {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {

                // replaces chosenXAxis with value
                chosenXAxis = value;

                // console.log(chosenXAxis)

                // functions here found above csv import
                // updates x scale for new data
                xLinearScale = xScale(healthData, chosenXAxis);

                // updates x axis with transition
                xAxis = renderAxes(xLinearScale, xAxis);

                // updates circles with new x values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

                // updates tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

                // changes classes to change bold text
                if (chosenXAxis === "poverty") {
                    albumsLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    hairLengthLabel
                        .classed("active", false)
                        .classed("inactive", true);
                } else {
                    albumsLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    hairLengthLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        });
}).catch(function(error) {
    console.log(error);
});