// Set the total width and height of the SVG drawing area (in pixels)
const width = 1000;
const height = 400;

// Define margins to create space for axes and labels
// The chart itself will live inside these margins
const margin = { top: 20, bottom: 20, left: 50, right: 50 };


// Load the CSV file asynchronously.
// d3.csv() returns a Promise, so nothing inside runs until the file is loaded.
d3.csv("detentions.csv").then(data => {
  data.sort((a, b) => d3.descending(+a["Level A"], +b["Level A"]))

  // Select the HTML element with class "graphic"
  // and append an SVG element inside it.
  // This SVG is the container for the chart.
  const svg = d3.select(".graphic")
    .append("svg")
    .attr("width", width)   // Set the SVG width
    .attr("height", height); // Set the SVG height


  // Create the x-scale for the bars.
  // scaleBand() is used for categorical (discrete) data.
  const x = d3.scaleBand()

    // The domain is the list of categories.
    // Here, each bar represents one facility name.
    .domain(data.map(d => d.Name))

    // The range is the horizontal space available for the bars,
    // starting after the left margin and ending before the right margin.
    .range([margin.left, width - margin.right])

    // Add padding between bars (10% of band width).
    .padding(0.1);


  // Create the y-scale for the bar heights.
  // scaleLinear() is used for numeric values.
  const y = d3.scaleLinear()

    // The domain goes from 0 up to the maximum "Level A" value.
    // The "+" converts the CSV string into a number.
    .domain([0, d3.max(data, d => +d["Level A"])])

    // Round the domain to nice, human-friendly values.
    .nice()

    // The range is inverted because SVG's y-axis increases downward.
    // Larger values map higher up on the screen.
    .range([height - margin.bottom, margin.top]);


  // Select all elements with class "bar" inside the SVG.
  // Since none exist yet, this creates an empty selection.
  svg.selectAll(".bar")

    // Bind the data array to the selection.
    // Each data row will correspond to one rectangle.
    .data(data)

    // join("rect") creates a <rect> for each data item.
    // This handles both entering and updating elements.
    .join("rect")

    // Assign a CSS class to each rectangle.
    .attr("class", "bar")

    // Set the x-position of each bar using the x-scale.
    // Each bar is placed according to its facility name.
    .attr("x", d => x(d.Name))

    // Set the y-position (top edge) of each bar using the y-scale.
    // Larger values move the bar upward.
    .attr("y", d => y(+d["Level A"]))

    // Set the height of each bar.
    // This is the distance between y(0) and y(value).
    .attr("height", d => y(0) - y(+d["Level A"]))

    // Set the width of each bar using the scaleBand's computed bandwidth.
    .attr("width", x.bandwidth())

    // Explicitly set the fill color so bars are visible.
    .attr("fill", "steelblue");

});