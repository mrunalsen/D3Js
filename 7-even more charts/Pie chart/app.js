async function draw() {
  // Data
  const dataset = await d3.csv('data.csv');

  // Wo wont need accessor functions in Pie chart as it has different approach

  // Dimensions
  let dimensions = {
    width: 600,
    height: 600,
    margins: 10,
  };

  dimensions.ctrWidth = dimensions.width - dimensions.margins * 2;
  dimensions.ctrHeight = dimensions.height - dimensions.margins * 2;

  // We need to define a radius
  const radius = dimensions.ctrWidth / 2;

  // Draw Image
  const svg = d3.select('#chart')
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);

  const ctr = svg.append("g") // <g>
    .attr(
      "transform",
      `translate(${dimensions.margins}, ${dimensions.margins})`
    );

  // Scales
  /**
   * (D3 will figure out how much space each slice will take)
   * d3.pie function will return a function which will perform 2 tasks.
   * First task will format out data.
   * Second task will calculate how big each slices will be.
   */
  const populationPie = d3.pie()
    /**
     * The value function will tell D3 how to access properties in our data.
     * Now instead of passing accessor function we can pass an arrow function
     */
    .value((d) => d.value) // the d arguement references the objects in the array
    .sort(null); // passing in null will prevent D3 to sort array by population and instead it will sort by age group
  const slices = populationPie(dataset);

  /**
   * The Pie function will format the data while the Arc function will return a function that will create an arc.
   * 
   */
  const arc = d3.arc()
    // The Arc function needs to know the radius of the pie by chaining a func called outerRadius
    .outerRadius(radius) // this func will tell d3 to draw the Arc from center of the circle to whatever value we pass into this func.
    .innerRadius(0); // The innerRadius func will add space at the center of the circle which will result it into a donut chart so passing in 0 will prevent d3 to create a donut chart

  const arcLabels = d3.arc()
    .outerRadius(radius)
    .innerRadius(200);
  const colors = d3.quantize(d3.interpolateSpectral, dataset.length);
  const colorScale = d3.scaleOrdinal()
    .domain(dataset.map(element => element.name))
    .range(colors);
  // Draw Shape
  const arcGroup = ctr.append('g') // 'g' refers to a group element
    .attr('transform',
      `translate(${dimensions.ctrHeight / 2}, ${dimensions.ctrWidth / 2})`
    );

  // We can use the arcGroup selection to select the path elements with the selectAll func
  arcGroup.selectAll('path')
    .data(slices) // Chaining the data func to join the slices with the selection (slices contain our formatted data)
    .join('path') // We can  begin to draw the path ellements by chaining the join function
    .attr('d', arc) // We can change the shape of the element by setting the d attribute to the arc function 
    .attr('fill', d => colorScale(d.data.name));
  /**
   * D3 will call the arc function for each object in the slices array.
   * It will proovide the object to the arc function which will return a value for the path element's d attribute 
   */

  const labelsGroup = ctr.append('g')
    .attr('transform',
      `translate(${dimensions.ctrHeight / 2.2}, ${dimensions.ctrWidth / 2})`
    )
    .classed('label', true);

  labelsGroup.selectAll('text')
    .data(slices)
    .join('text')
    .attr('transform', d => `translate(${arcLabels.centroid(d)})`)
    .call(
      text => text.append('tspan')
        .style('font-weight', 'bold')
        .attr('y', -4)
        .text(d => d.data.name)
    )
    .call(
      text => text.filter((d) => (d.endAngle - d.startAngle) > 0.25)
        .append('tspan')
        .attr('y', 9)
        .attr('x', 0)
        .text(d => d.data.value)
    );
}

draw();