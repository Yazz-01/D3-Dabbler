//-------------Stting Up the space for the chart--------------------
// Setting up width, heigth and margins of the chart

// Setting up the sapace for the chart

var width = parseInt(d3.select("#scatter").style("width")); // deefines horizontal lenght for rendering area
// deefines vartical lenght for rendering area
var height = width - width / 4;
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
    .attr("width", width)
    .attr("height", height)
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
    (height - margin - txtBottom) + ")"
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

            // Grab the first_name
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
        xMax = d3.max(healthData, function(d) {
            return parseFloat(d[namY]) * 1.10;
        });
    }
    // Change the Min and Max for Y 
    function yMinMax() {
        // min will grab the smallest datum from the selected column
        yMin = d3.min(healthData, function(d) {
            return parseFloat(d[namY]) * 0.90;
        });
        //.max will grab the largest satum 
        yMax = d3.max(healthData, function(d) {
            return parseFloat(d[namY]) * 1.10;
        });
    }

}
// ===================Scatter Plot initialization==========================
// Adding the first placement of the data and axis to the scatter plot
// Instruction with d3 placing the circles in an area starting after
// the margin and word area 
xMinMax();
yMinMax();

var xLinearScale = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([margin + labelArea, width - margin]);

var yLinearScale = d3
    .scaleLinear()
    .domain([yMin, yMax])
    .range([height - margin - labelArea, margin]);

// We pass the scale into the axis method creting the axis
var xAxis = d3.axisBottom(xLinearScale);
var yAxis = d3.axisLeft(yLinearScale);

// Appending the axis in group elements we call them 
//to include all the numbers, boarders and ticks
// The transform attribute specifies where to place the axes
svg
    .append("g")
    .call(xAxis)
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + (height - margin - labelArea) + ")");
svg
    .append("g")
    .call(yAxis)
    .attr("class", "yAxis")
    .attr("transform", "translate(" + (margin + labelArea) + ", 0)")

// Grouping the circles and their labels.
var circlesGroup = svg.selectAll("g theCircles").data(theData).enter();

// Step 5: Append the Circles for each row of datum
// ==============================
circlesGroup
    .append("circle")
    // These attr's specify location, size and class.
    .attr("cx", function(d) {
        return xScale(d[curX]);
    })
    .attr("cy", function(d) {
        return yScale(d[curY]);
    })
    .attr("r", circRadius)
    .attr("class", function(d) {
        return "stateCircle " + d.abbr;
    })
    // Hover rules (based on event listeners)
    .on("mouseover", function(d) {
        // Show the tooltip
        toolTip.show(d, this);
        // Highlight the state circle's border
        d3.select(this).style("stroke", "#323232");
    });