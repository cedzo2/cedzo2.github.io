const dataUrl = "https://github.com/cedzo2/MyFiles/blob/main/Pokemon_Dataset.csv";
var attribute = "HP";

console.log(dataUrl);

d3.csv(dataUrl).then(function(data) {
  data.forEach(d => {
    d[attribute] = +d[attribute];
  });


  const colorList = ['#7AC74C', '#EE8130', '#6390F0', '#A6B91A', '#A8A77A', '#A33EA1', '#F7D02C',
                      '#E2BF65', '#D685AD', '#C22E28', '#F95587', '#B6A136', '#735797',
                      '#96D9D6', '#6F35FC', '#705746', '#A98FF3']

  const groupedData = d3.group(data, d => d.Type1);
  const averageHPData = Array.from(groupedData, ([type, values]) => ({
    Type1: type,
    AverageHP: d3.mean(values, d => d[attribute])
  }));

  const margin = { top: 30, right: 30, bottom: 70, left: 50 };
  const width = 600 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const svg = d3.select("#chart1")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const xScale = d3.scaleBand()
    .domain(averageHPData.map(d => d.Type1))
    .range([0, width])
    .padding(0.1)
    .paddingOuter(0.3)
    .align(0.5);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(averageHPData, d => d.AverageHP)])
    .range([height, 0]);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  svg.append("text")
    .attr("class", "x-axis-label")
    .attr("x", width / 2)
    .attr("y", height + margin.top + 30)
    .style("text-anchor", "middle")
    .text("Pokemon Type");

  svg.append("text")
    .attr("class", "y-axis-label")
    .attr("x", -height / 2)
    .attr("y", -margin.left + 10)
    .style("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("HP");

  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-0.8em")
    .attr("dy", "0.15em")
    .attr("transform", "rotate(-45)");

  svg.append("g").call(yAxis);

  svg.selectAll(".bar")
    .data(averageHPData)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => xScale(d.Type1))
    .attr("y", d => yScale(d.AverageHP))
    .attr("width", xScale.bandwidth())
    .attr("height", d => height - yScale(d.AverageHP))
    .attr("fill", (d, i) => colorList[i % colorList.length]);

  function updateChart() {
    attribute = getNextAttribute(attribute);

    data.forEach(d => {
      d.Value = +d[attribute];
    });

    const groupedData = d3.group(data, d => d.Type1);
    const averageAttributeData = Array.from(groupedData, ([type, values]) => ({
      Type1: type,
      AverageAttribute: d3.mean(values, d => d.Value)
    }));

    yScale.domain([0, d3.max(averageAttributeData, d => d.AverageAttribute)]);

    svg.select(".y-axis")
      .transition()
      .duration(500)
      .call(yAxis);

    const bars = svg.selectAll(".bar")
      .data(averageAttributeData);

    bars.enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => xScale(d.Type1))
      .attr("width", xScale.bandwidth())
      .attr("fill", (d, i) => colorList[i % colorList.length])
      .merge(bars)
      .transition()
      .duration(500)
      .attr("y", d => yScale(d.AverageAttribute))
      .attr("height", d => height - yScale(d.AverageAttribute));

    bars.exit().remove();

    svg.select(".y-axis-label")
      .text(attribute);

    const topThreeTypes = averageAttributeData
      .sort((a, b) => b.AverageAttribute - a.AverageAttribute)
      .slice(0, 3)
      .map(d => d.Type1);
  
    const annotationContainer = d3.select("#annotation");
    annotationContainer.html(
      "Top Three Types by " + attribute + ": " + topThreeTypes.join(", ")
    );
  }

  function getNextAttribute(currentAttribute) {
    const attributes = ["HP", "Attack", "Defense", "SpAtk", "SpDef", "Speed"];
    const currentIndex = attributes.indexOf(currentAttribute);
    const nextIndex = (currentIndex + 1) % attributes.length;
    return attributes[nextIndex];
  }

  document.getElementById("toggleButton").addEventListener("click", updateChart);

  updateChart();

  document.getElementById("toggleChartButton").addEventListener("click", function() {
    const chart1 = document.getElementById("chart1");
    const chart2 = document.getElementById("chart2");
    const chart3 = document.getElementById("chart3");
    if (chart2.style.display === "block") {
      chart1.style.display = "none";
      chart2.style.display = "none";
      chart3.style.display = "block";
      chartTitle.textContent = "Top 100 Pokemon by Total (Sum of All Stats)";
      toggleChartButton.textContent = "First Chart";
    } else if (chart1.style.display == "block"){
      chart1.style.display = "none";
      chart2.style.display = "block";
      chart3.style.display = "none";
      chartTitle.textContent = "Compare Individual Pokemon by Stats and Type"
      createSecondChart();
    }else{
      chart1.style.display = "block";
      chart2.style.display = "none";
      chart3.style.display = "none";
      chartTitle.textContent = "Average Stats by Type";
      toggleChartButton.textContent = "Next Chart";
    }
  });
});
  
