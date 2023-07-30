let data;

function createSecondChart() {
  d3.select("#chart2").selectAll("svg").remove();
  const dataUrl = "http://127.0.0.1:8080/Pokemon_Dataset.csv";

  const margin = { top: 30, right: 80, bottom: 50, left: 50 };
  const width = 600 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const svg = d3.select("#chart2")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  function updateChart() {
    const xAttribute = document.getElementById("xAttribute").value;
    const yAttribute = document.getElementById("yAttribute").value;
    const type1Attribute = document.getElementById("type1Attribute").value;

    const filteredData = data.filter(d => d.Type1 === type1Attribute);

    const xScale = d3.scaleLinear()
      .domain([0, d3.max(filteredData, d => d[xAttribute])])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(filteredData, d => d[yAttribute])])
      .range([height, 0]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    d3.select("#chart1")
        .select(".annotation")
        .select(".toggleButton")
        .remove();;

    svg.select(".x-axis").remove();
    svg.select(".y-axis").remove();
    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis);

    svg.append("g")
      .attr("class", "y-axis")
      .call(yAxis);

    const labels = svg.selectAll(".label")
      .data(filteredData);

    labels.enter()
      .append("text")
      .attr("class", "label")
      .merge(labels)
      .attr("x", d => xScale(d[xAttribute]) + 8)
      .attr("y", d => yScale(d[yAttribute]) - 8)
      .text(d => d.Name);
    svg.select(".x-axis-label").remove();

    svg.append("text")
        .attr("class", "x-axis-label")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .style("text-anchor", "middle")
        .text(xAttribute);

    svg.select(".y-axis-label").remove();
    svg.append("text")
        .attr("class", "y-axis-label")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 10)
        .attr("transform", "rotate(-90)")
        .style("text-anchor", "middle")
        .text(yAttribute);

    const circles = svg.selectAll(".point")
      .data(filteredData);

    circles.enter()
      .append("circle")
      .attr("class", "point")
      .merge(circles)
      .attr("cx", d => xScale(d[xAttribute]))
      .attr("cy", d => yScale(d[yAttribute]))
      .attr("r", 5)
      .attr("fill", "#6aadd8");

    const tooltip = svg.append("g")
        .attr("class", "tooltip")
        .style("display", "none");

    tooltip.append("rect")
        .attr("width", 100)
        .attr("height", 50)
        .attr("fill", "white")
        .attr("stroke", "black");

    tooltip.append("text")
        .attr("x", 10)
        .attr("y", 20)
        .attr("font-size", "12px")
        .attr("font-weight", "bold")
        .text("");

    svg.selectAll(".point")
        .on("mouseover", function (event, d) {
        tooltip.select("text").text(d.Name);
        tooltip.style("display", "block");
        })
        .on("mouseout", function (event, d) {
        tooltip.style("display", "none");
        });

    circles.exit().remove();
    labels.exit().remove();
  }

  d3.csv(dataUrl).then(function (loadedData) {
    loadedData.forEach(d => {
      d.HP = +d.HP;
      d.Attack = +d.Attack;
      d.Defense = +d.Defense;
      d.SpAtk = +d.SpAtk;
      d.SpDef = +d.SpDef;
      d.Speed = +d.Speed;
    });

    data = loadedData;

    const type1Options = Array.from(new Set(data.map(d => d.Type1)));
    const type1Dropdown = document.getElementById("type1Attribute");
    type1Dropdown.innerHTML = "";
    type1Options.forEach(option => {
      const optionElement = document.createElement("option");
      optionElement.value = option;
      optionElement.textContent = option;
      type1Dropdown.appendChild(optionElement);
    });

    updateChart();

    document.querySelectorAll("#chart2 select").forEach(select => {
        select.style.display = "block";
    });
  });

  document.getElementById("xAttribute").addEventListener("change", updateChart);
  document.getElementById("yAttribute").addEventListener("change", updateChart);
  document.getElementById("type1Attribute").addEventListener("change", updateChart);
}