// Create the SVG container inside the .graphic div
const svg = d3.select(".graphic")
  .append("svg")                         // Add an SVG element
  .attr("viewBox", "0 0 600 600")      // Make it scalable/responsive

// Load the CSV file
d3.csv("motor_carrier_crashes.csv", d => {
  return {
    CRASH_CARRIER_NAME: d.CRASH_CARRIER_NAME,
    count: +d.count
  }
}).then(data => {
  console.log(d3.extent(data, d=>d.count))
  createViz(data);
});

// Main chart-drawing function
const createViz = (data) => {
 
const xScale = d3.scaleBand()
    .domain(data.map(d=>d.CRASH_CARRIER_NAME))
    .range([0,600])
    .paddingInner(0.2)

const yScale = d3.scaleLinear()
    .domain([0,11145])
    .range([500,0])

const barAndLabel = svg
    .selectAll("g")
    .data(data)
    .join("g")
      .attr("transform", d=> `translate(${xScale(d.CRASH_CARRIER_NAME)},0)`)

barAndLabel
  .append('rect')
      .attr("y", d=> yScale(d.count))
      .attr("width", xScale.bandwidth())
      .attr("height", d => 500 - yScale(d.count))
      .attr("fill", d=>d.CRASH_CARRIER_NAME === "ESTES EXPRESS LINES" ? "orange":"skyblue");

barAndLabel
  .append("text")
    .text(d=>d.CRASH_CARRIER_NAME)
    .attr("y",500)
    .attr("x", xScale.bandwidth()/2)
    .attr("font-size", 9)
    .attr("transform", d =>
      `rotate(-90, ${xScale.bandwidth() / 2}, 515)`
    )

const line = svg
  .append("line")
    .attr("x1", 0)
    .attr("y1", 500)
    .attr("x2", 600)
    .attr("y2", 500)
    .attr("stroke", "black");


};