const width = 1100;
const height = 400;
const margin = { top: 60, bottom: 350, left: 25, right: 60 };

const svg = d3.select(".graphic")
  .append("svg")
  .attr("width", width + margin.left + margin.right) 
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

d3.csv("detentions.csv").then(data => {
  data.forEach(d=> d["Level A"] = +d["Level A"]);
  data.sort((a, b) => d3.descending(a["Total Inmates"], b["Total Inmates"]))

  const x = d3.scaleBand()
    .domain(data.map(d => d.Name))
    .range([0, width])
    .padding(0.4);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d["Total Inmates"])])
    .range([height, 0])
    .nice();

  const xAxis = d3.axisBottom(x)

  const yAxis = d3.axisLeft(y)

///Add Title
svg.append("text")
  .attr("x", width / 2)
  .attr("y", -30)
  .attr("text-anchor", "middle")
  .style("font-size", "32px")
  .style("font-weight", "600")
  .text("ICE Detentions in Virginia");

///Create Axes
  svg
  .append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${height})`)
    .attr("opacity","0")
    .call(xAxis)
  .transition()
    .duration(500)
    .attr("opacity","1");


  svg.select(".x.axis")
  .selectAll("text")
  .attr("text-anchor","end")
  .attr("transform","rotate(-40)")
  .attr("dx", "-0.6em")
  .attr("dy", "0.15em");

  svg.append("g")
    .call(yAxis)
    .attr("opacity","0")
  .transition()
    .duration(2000)
    .attr("opacity","1");

const totalDuration = 1000; // 1.5 seconds total
const delayPerBar = totalDuration / data.length; ///Divides by three, since our data is three rows longth.

///This is the code that builds the actual bars
  svg.selectAll(".bar")
    .data(data)
    .join("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.Name))
      .attr("y", y(0))
      .attr("height",0)
      .attr("width", x.bandwidth())
      .attr("fill", "steelblue")
      .attr("opacity",".0")
      .attr("rx",4)
      .attr("ry",4)
    .transition()
      .delay((d, i) => i * delayPerBar)
      .duration(600)
      .ease(d3.easeCubicOut)
      .attr("y", d => y(d["Total Inmates"]))
      .attr("opacity",'1')
      .attr("height", d => y(0) - y(d["Total Inmates"]));

});