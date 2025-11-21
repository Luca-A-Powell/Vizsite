// Set up the dimensions of the chart
const margin = { top: 70, right: 40, bottom: 60, left: 175 }
const width = 660 - margin.left - margin.right
const height = 400 - margin.top - margin.bottom
const tooltip = d3.select('body')
  .append('div')
  .attr('class', 'tooltip');

// Create the SVG container for the chart
const svg = d3
  .select("#goalscorer-chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Load and process the data
d3.csv("goalscorer_data.csv").then(data => {
  data.forEach(d => {
    d.Goals_Scored = +d.Goals_Scored;
  });

  // Sort the data by total
  data.sort(function (a, b) {
    return d3.ascending(a.Goals_Scored, b.Goals_Scored);
  });

  // Set the x and y scales
  const x = d3.scaleLinear()
    .range([0, width])

    const margin = { top: 70, right: 40, bottom: 60, left: 175 }
    const width = 660 - margin.left - margin.right
    const height = 400 - margin.top - margin.bottom
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'tooltip');

    const svg = d3
      .select("#goalscorer-chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv("goalscorer_data.csv").then(data => {
      data.forEach(d => {
        d.Goals_Scored = +d.Goals_Scored;
      });

      data.sort(function (a, b) {
        return d3.ascending(a.Goals_Scored, b.Goals_Scored);
      });

      const x = d3.scaleLinear()
        .range([0, width])
        .domain([0, d3.max(data, function (d) { return d.Goals_Scored; })]);

      const y = d3.scaleBand()
        .range([height, 0])
        .padding(0.1)
        .domain(data.map(function (d) { return d.Rank; }));

      const xAxis = d3.axisBottom(x)
        .ticks(5)
        .tickSize(0);

      const yAxis = d3.axisLeft(y)
        .tickSize(0)
        .tickPadding(10);

      svg.selectAll("line.vertical-grid")
        .data(x.ticks(5))
        .enter()
        .append("line")
        .attr("class", "vertical-grid")
        .attr("x1", function (d) { return x(d); })
        .attr("y1", 0)
        .attr("x2", function (d) { return x(d); })
        .attr("y2", height)
        .style("stroke", "gray")
        .style("stroke-width", 0.5)
        .style("stroke-dasharray", "3 3");

      svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("y", function (d) { return y(d.Rank); })
        .attr("height", y.bandwidth())
        .attr("x", 0)
        .attr("width", function (d) { return x(d.Goals_Scored); })
        .attr('fill', '#96a5b9')
        .on('mouseover', (event, d) => {
        tooltip
          .style('opacity', 1)
          .html(`<strong>${d.Name}</strong><br/>Goals: ${d.Goals_Scored}`);
      })
         .on('mousemove', (event) => {
        tooltip
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY + 10) + 'px');
      })
      .on('mouseout', () => {
        tooltip.style('opacity', 0);
      });

      svg.append("g")
        .attr("class", "x axis")
        .style("font-size", "10px")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .call(g => g.select(".domain").remove());

      svg.append("g")
        .attr("class", "y axis")
        .style("font-size", "8px")
        .call(yAxis)
        .selectAll('path')
        .style('stroke-width', '1.75px');

      svg.selectAll(".y.axis .tick text")
        .text(function (d) {
          return d.toUpperCase();
        });

      svg.selectAll(".label")
        .data(data)
        .enter().append("text")
        .attr("x", function (d) {
          const xpos = x(d.Goals_Scored);
          const insideThreshold = 40;
          d._labelInside = xpos > insideThreshold;
          return d._labelInside ? xpos - 6 : xpos + 6;
        })
        .attr("y", function (d) { return y(d.Rank) + y.bandwidth() / 2; })
        .attr("dy", ".35em")
        .style("font-family", "sans-serif")
        .style("font-size", "10px")
        .style("font-weight", "bold")
        .style('fill', function(d){ return d._labelInside ? 'white' : '#3c3d28'; })
        .style('pointer-events','none')
        .style('text-anchor', function(d){ return d._labelInside ? 'end' : 'start'; })
        .text(function (d) { return d.Name; });

      svg.append("text")
        .attr("transform", "translate(" + width / 2 + "," + (height + margin.bottom / 2) + ")")
        .style("text-anchor", "middle")
        .style("font-size", "10px")
        .style("fill", "black")
        .style("font-family", "sans-serif")
        .attr("dy", "1em")
        .text("Total");
  
      svg.append("text")
        .attr("x", margin.left - 335)
        .attr("y", margin.top - 110)
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .style("font-family", "sans-serif")
        .text("This season's top goalscorers in the premier league.");

      svg.append("text")
        .attr("transform", "translate(" + (margin.left - 335) + "," + (height + margin.bottom - 10) + ")")
        .style("text-anchor", "start")
        .style("font-size", "8px")
        .style("fill", "lightgray")
        .style("font-family", "sans-serif")
        .html("<a href='https://www.cambridge.org/core/journals/antiquity/article/bogs-bones-and-bodies-the-deposition-of-human-remains-in-northern-european-mires-9000-bcad-1900/B90A16A211894CB87906A7BCFC0B2FC7#supplementary-materials'>Source: Bogs, Bones and Bodies - Published by Cambridge Press</a>");

    });


