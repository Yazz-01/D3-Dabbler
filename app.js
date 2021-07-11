//-------------Stting Up the space for the chart--------------------
// Setting up width, heigth and margins of the chart
var svgWidth = 960; // deefines horizontal lenght for rendering area
var svgHeight = 500; // deefines vartical lenght for rendering area

var margin = { //padding 
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our 
//chart, and shift the latter by left and top margins (CANVAS FOR THE GRAPH)
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .attr("class", "chart"); //closed the svg

// Setting the Radius for each circle that will appear in the chart
// If the browser changes below 530 pixeles, so the circle will be reduce from 10 to 5 pixeles
var circRadius;

function cirGet() {
    if (width <= 530) {
        circRadius = 5;
    } else {
        circRadius = 10;
    }
}
cirGet();


// Append an SVG group
var chartGroup = svg.append("g").attr("class", "xText");
//.attr("transform", `translate(${margin.left}, ${margin.top})`);

// xText will allow us to select the group without excess of code    
var xText = d3.select("xText");

//Give xText a transform property that places it at the bottom of the chart
xText.attr(
    "transform",
    "translate(" + ((width - labelArea) / 2 + laberArea) + ", " +
    (height - margin - bottom) + ")"
);

// function used for updating x-scale var upon click on axis label
function xScale(healthData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.8,
            d3.max(healthData, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);

    return xLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]));

    return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

    var label;

    if (chosenXAxis === "poverty") {
        label = "Poverty:";
    } else if {
        label = "Age";
    } else {
        label = "Obesity"
    }

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
            return (`${d.state}<br>${label} ${d[chosenXAxis]}`);
        });

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

// Retrieve data from the CSV file and execute everything below

// ----------Import Data-----------------
d3.csv("data.csv").then(function(healthData, err) {
    if (err) throw err;

    // Step 1: Parse Data
    // ==============================
    healthData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
        //console.log(data.poverty);
    });

    // Step 2: Create Scales 
    // ==============================
    //cXLinearScale function above csv import
    var xLinearScale = xScale(healthData, chosenXAxis);

    //Create scale function Y axis(Linear)
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(healthData, d => d.smokes)])
        .range([height, 0]);

    // Step 3: Create initial axis functions
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

    // Step 5: Append Initial Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis])) // X Axis
        .attr("cy", d => yLinearScale(d.smokes)) // Y axis
        .attr("r", 20)
        .attr("fill", "pink")
        .attr("opacity", ".5");
    //.attr("class", function(d) {
    //  return "StateCircle" + d.abbr;
    //})

    // --------Create group for 3 x-axis labels ----//
    //-------------added (width/3) and (height + 60)-------------------------------------
    var labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 3}, ${height + 60})`);

    // X-1  Poverty Label 
    var povertyLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("Poverty (%)");
    // X-2  Age Label 
    var ageLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age") // value to grab for event listener
        .classed("inactive", true)
        .text("Age (years)");

    // X-3  Obesity Label 
    var obesityLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "obesity") // value to grab for event listener
        .classed("inactive", true)
        .text("Obesity (%)");

    // append Y axis
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

                //console.log(chosenXAxis)

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
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);
                } else if {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);

                } else {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    obesityLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }

            }
        });
}).catch(function(error) {
    console.log(error);
});