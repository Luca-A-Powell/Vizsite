// Minimal, clean chart script — renders top-goalscorers bar chart into #goalscorer-chart
const margin = { top: 70, right: 40, bottom: 60, left: 175 };
const width = 660 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const tooltip = d3.select('body').append('div').attr('class', 'tooltip');

const container = d3.select('#goalscorer-chart');
container.selectAll('*').remove();

const svg = container.append('svg')
  .attr('width', width /2 + margin.left + margin.right)
  .attr('height', height/2 + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`);

d3.csv('goalscorer_data.csv').then(data => {
  data.forEach(d => { d.Goals_Scored = +d.Goals_Scored; });
  data.sort((a,b) => d3.ascending(a.Goals_Scored, b.Goals_Scored));

  const x = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.Goals_Scored)])
    .range([0, width]);

  const y = d3.scaleBand()
    .domain(data.map(d => d.Rank))
    .range([height, 0])
    .padding(0.1);

  svg.selectAll('.bar')
    .data(data)
    .join('rect')
    .attr('class','bar')
    .attr('y', d => y(d.Rank))
    .attr('height', y.bandwidth())
    .attr('x', 0)
    .attr('width', d => x(d.Goals_Scored))
    .attr('fill', '#96a5b9')
    .on('mouseover', (event,d) => {
      tooltip.style('opacity',1).html(`<strong>${d.Name}</strong><br/>Goals: ${d.Goals_Scored}`);
    })
    .on('mousemove', (event) => {
      tooltip.style('left', (event.pageX+10)+'px').style('top', (event.pageY+10)+'px');
    })
    .on('mouseout', () => tooltip.style('opacity',0));

  const xAxis = d3.axisBottom(x).ticks(5).tickSize(0);
  const yAxis = d3.axisLeft(y).tickSize(0).tickPadding(10);

  svg.append('g').attr('transform', `translate(0,${height})`).call(xAxis).call(g => g.select('.domain').remove()).style('font-size','10px');
  svg.append('g').call(yAxis).style('font-size','8px');

  svg.selectAll('.label')
    .data(data)
    .join('text')
    .attr('x', d => x(d.Goals_Scored) + 6)
    .attr('y', d => y(d.Rank) + y.bandwidth()/2)
    .attr('dy','.35em')
    .style('font-size','10px')
    .text(d => d.Name);

}).catch(err => {
  console.error('Error loading goalscorer_data.csv', err);
  container.append('div').style('color','red').text('Error loading goalscorer_data.csv');
});


