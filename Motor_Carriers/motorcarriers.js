// Create the SVG container inside the .graphic div
const svg = d3.select(".graphic")
  .append("svg")                         // Add an SVG element
  .attr("viewBox", "0 0 600 600")      // Make it scalable/responsive

// Load the CSV file
d3.csv("motor_carrier_crashes.csv", d => {
  return {
    CRASH_CARRIER_NAME: d.CRASH_CARRIER_NAME,
    count: +d.count,
    logo: `logos/${d.CRASH_CARRIER_NAME}.jpg`
  }
}).then(data => {
  console.log(data)
  createViz(data.slice(0, 10));
});

// Main chart-drawing function
const createViz = (data) => {

  const xScale = d3.scaleLinear()
    .domain([844,d3.max(data, d=>d.count)])
    .range([0,500])

  const yScale = d3.scaleBand()
    .domain(data.map(d=>d.CRASH_CARRIER_NAME))
    .range([0,600])
    .paddingInner(.10)

  ///Create a constant for my bar groups. This is how I access all my groups.///
  const barGroup = svg
    .selectAll("g")
    .data(data)
    .join("g")
      .attr("transform", d=>`translate(0, ${yScale(d.CRASH_CARRIER_NAME)})`);

  ///Code for my rectangles///
  barGroup
    .append("rect")
      .attr("x", 0)
      .attr("height", yScale.bandwidth())
      .attr("width", d=>xScale(d.count))
      .attr("fill","Thistle");

  ///Code for my line///
  svg
    .append("line")
      .attr("x1","0")
      .attr("x2", "0")
      .attr("y1", "0")
      .attr("y2", "600")
      .attr("stroke","black")
      .attr("stroke-width","1")

  ///Code for my text label
 /*barGroup
    .append("text")
      .text(d=>d.CRASH_CARRIER_NAME)
      .attr("x",d=>xScale(d.count) +54)
      .attr("y", yScale.bandwidth()/2)
      .attr("text-anchor","start")
      .attr("font-size",12)*/

  barGroup
    .append("text")
      .text(d=>d.count)
      .attr("x", 4)
      .attr("y", yScale.bandwidth()/2)
      .attr("text-anchor","start")
      .attr("font-size",12)

  barGroup
  .append("image")
    .attr("href", d => d.logo)
    .attr("x",d=>xScale(d.count) +4)               // left of the y-axis
    .attr("y", yScale.bandwidth()/3)
    .attr("width", yScale.bandwidth() + 10)
    .attr("height", yScale.bandwidth()/2)
    .attr("preserveAspectRatio", "xMidYMid meet");



};