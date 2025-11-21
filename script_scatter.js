
const margin = {top: 20, right: 30, bottom: 40, left: 40};
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

d3.csv("iris.csv").then(iris => {
  // Convert numeric fields from strings to numbers
  iris.forEach(d => {
    d.sepal_length = +d.sepal_length;
    d.sepal_width  = +d.sepal_width;
    d.petal_length = +d.petal_length;
    d.petal_width  = +d.petal_width;
  });

  const svg = d3
    .select("#observable_scatterplot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("border", "1px solid black");

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  g.append("rect").attr("width", width).attr("height", height).attr("fill","none");

  const x = d3
      .scaleLinear()
      .domain(d3.extent(iris, (d) => d.sepal_length))
      .nice()
      .range([0, width]);

  const y = d3
      .scaleLinear()
      .domain(d3.extent(iris, (d) => d.sepal_width))
      .nice()
      .range([height, 0]);

  const colorScale = d3
      .scaleOrdinal()
      .domain(Array.from(new Set(iris.map((d) => d.species))))
      .range(["red", "orange", "yellow"]);

  g.append("g")
      .selectAll("circle")
      .data(iris)
      .join("circle")
      .attr("r", 3)
      .attr("cx", (d) => x(d.sepal_length))
      .attr("cy", (d) => y(d.sepal_width))
      .style("fill", (d) => colorScale(d.species));

});