const datarUrl = "/Pokemon_Dataset.csv";

d3.csv(datarUrl).then(function(data) {
    data.forEach(d => {
        d.Total = +d.Total;
    });

    let top10List = data.sort((a, b) => b.Total - a.Total).slice(0, 10);
    let top10ListStatic = data.sort((a, b) => b.Total - a.Total).slice(0, 10);
    let stopAt100 = 1;

    const margin = { top: 30, right: 30, bottom: 65, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#chart3")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    function updateThirdChart(){
        svg.selectAll("*").remove();
        
        const xScale = d3.scaleBand()
            .domain(top10List.map(d => d.Name))
            .range([0, width])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(top10ListStatic, d => d.Total)])
            .range([height, 0]);

        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

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
            .data(top10List)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d.Name))
            .attr("y", d => yScale(d.Total))
            .attr("width", xScale.bandwidth())
            .attr("height", d => height - yScale(d.Total))
            .attr("fill", "#4CAF50");

        svg.append("text")
            .attr("class", "chart-title")
            .attr("x", width / 2)
            .attr("y", -10)
            .attr("text-anchor", "middle")

            svg.append("text")
            .attr("class", "x-axis-title")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom)
            .attr("text-anchor", "middle")
            .text("Pokemon " + ((stopAt100-1) * 10 + 1) + " - " + (((stopAt100-1) * 10) + 10));
        
        svg.append("text")
            .attr("class", "y-axis-title")
            .attr("x", -height / 2)
            .attr("y", -margin.left + 15)
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .text("Sum of All Stats");
    }

    document.getElementById("toggleNextGroup").addEventListener("click", function() {
        if(stopAt100 < 10){
            top10List = data.sort((a, b) => b.Total - a.Total).slice(stopAt100 * 10, (stopAt100 * 10) + 10);
            stopAt100 = stopAt100 + 1;
            updateThirdChart();    
        }else{
            top10List = data.sort((a, b) => b.Total - a.Total).slice(0, 10);
            stopAt100 = 1
            updateThirdChart();
        }
        
    });

    updateThirdChart();
});
