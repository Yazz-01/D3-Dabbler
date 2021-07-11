//-------------Stting Up the space for the chart--------------------
// Setting up width, heigth and margins of the chart

// Setting up the sapace for the chart

var width = parseInt(d3.select("#scatter").style("width")); // deefines horizontal lenght for rendering area
// deefines vartical lenght for rendering area
var height = witdth - width / 4;
//Margin for the chart
var margin = 20;
// Space for the words 
var labelArea = 120;

//Padding for the text at the bottom and left axes
var txtBottom = 40;
var txtLeft = 40;

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

//--------------------Bottom Axis--------------------------
// Append an SVG group
var chartGroup = svg.append("g").attr("class", "xText");
//.attr("transform", `translate(${margin.left}, ${margin.top})`);

// xText will allow us to select the group without excess of code    
var xText = d3.select("xText");

//Give xText a transform property that places it at the bottom of the chart
xText.attr(
    "transform",
    "translate(" + ((width - labelArea) / 2 + labelArea) + ", " +
    (height - margin - bottom) + ")"
);

//Using xText to append the Text svg with coordinates specifying the space
// the values - age
xText
    .append("text")
    .attr("y", -26)
    .attr("data-name", "poverty")
    .attr("data-axis", "x")
    .attr("class", "aText active x")
    .text("Poverty (%)");

// -----------------Left Axis-----------------------------
//---------------------------------------------------------
// Defining the varibles to make the clearer the transform
var leftTextX = margin + txtLeft;
var leftTextY = (height + labelArea) / 2 - labelArea;

// Add a second label group, this time for the axis left of the chart
svg.append("g").attr("class", "yText");

// yText wil allows us to select the group without excess code
var yText = d3.select(".yText");

// Nesting the group´s transform attribute in a function to make changing it 
//on window change an easy operation

yText.attr(
    "transform",
    "translate(" + leftTextX + ", " + leftTextY + ")rotate(-90)"
);

// Smokes
yText
    .append("text")
    .attr("y", 26)
    .attr("data-name", "age")
    .attr("data-axis", "y")
    .attr("class", "sText active y")
    .text("Population Age (years)");

//--------------------IMPORTING CSV FILE------------------------
//---------------------------------------------------------------

// Import our CSV using d3 
//=========================================================
d3.csv("data.csv").then(function(healthData, err) {
    if (err) throw err
    viz(healthData)
});

// Step 2: Create Scales for the Visualization
// =====================================================
// function "viz" manages the visual manipulation of all elements dependent on the data
function viz(healthData) {
    // Defining varibles and functions
    //  namX and namY define the data represented in each axis
    //  we define the names as they are deined in the healthData
    var namX = "poverty"
    var namY = "healtcare";

    // Creating empty variables for the min and max values of x and y
    // This allow to alter the values in functions avoiding repetitive code
    var xMin;
    var xMax;
    var yMin;
    var yMax;

    // This function allows us to set up TOOLTIP 
    var toolTip = d3
        .tip()
        .attr("class", "d3-tip")
        .offset([40, -60])
        .html(function(d) {
            // Grab the firt_name
            var nameState = "<div>" + d.state + "</div>";
            // Get the "X" value and key value
            var theX = "<div>" + namX + ": " + parseFloat(d[namX]) + "</div>";
            //// Get the "Y" value and key value
            var theY = "<div>" + namY + ": " + parseFloat(d[namY]) + "</div>";
            // Disply what we capture
            return nameState + theX + theY;

        });
    // Call the Tooltip function
    svg.call(toolTip);

    // Changing the min and max with an "x"
    function xMinMax() {
        // .min will grab the smallest datum from the selected column
        xMin = d3.min(healthData, function(d) {
            return parseFloat(d[namX]) * 0.90;
        });
        //.max will grab the largest satum 
    }
}

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