var display = function (projection_data){

    var width = 960,
        height = 650;

    var svg = d3.select("#countrysvg")/*.select("#countrysvg")*/.append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("display", "block")
        .style("margin", "auto");

    // Append Div for tooltip to SVG
    var div = d3.select("body")
                .append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

    d3.json("region.json", function(error, data) {
        if (error) return console.error(error);

        var subunits = topojson.feature(data, data.objects.countries);

        var projection = d3.geoAlbers()
            .center(projection_data.center)
            .rotate(projection_data.rotate)
            .parallels(projection_data.parallels)
            .scale(projection_data.scale)
            .scale(800)
            .translate([width / 2, (height / 2)-23 ]); //shift up down left right

        var path = d3.geoPath()
            .projection(projection);

        svg.append("path")
            .datum(subunits)
            .attr("d", path);

        d3.json("population.json", function(error, population) {
        //d3.json("yearsMAP.json", function(error, population) {
       // d3.json("gniMAP.json", function(error, population) {
        //d3.json("lifeMAP.json", function(error, population) {
            var color = d3.scaleThreshold()
                .domain([.5, .6, .7, .8, .9].map(function(x){return x;}))
                //.range(["#a3eaff", "#6ec8e6", "#17a5d4", "#0086b3", "#006385", "#005e7d"]);
                .range(["#fdbb84", "#fc8d59", "#ef6548", "#d7301f", "#b30000", "#7f0000"]);
                //.range(["#fee5d9", "#fcbba1", "#fc9272", "#fb6a4a", "#de2d26", "#99000d"]); 

            var formatNumber = d3.format("");   //removes million formatting
                                                //http://bl.ocks.org/zanarmstrong/05c1e95bf7aa16c4768e

            svg.selectAll(".subunit")
                .data(topojson.feature(data, data.objects.countries).features)
                .enter().append("path")
                .style("fill", function(d){
                    if(d.properties.name)
                        return color(population[d.properties.name]);
                })
                .attr("class", function(d) {
                    if(d.properties.countryname)
                        return "subunit background";
                    else
                        return "subunit";
                })
                .attr("d", path)
                .on("mouseover", function(d) {
                    if(d.properties.name){
                        d3.select(this).attr("class", "highlight");

                        div.transition()
                            .duration(200)
                            .style("opacity", .9);
                        div.style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY - 28) + "px");
                        div.append("div").text(d.properties.name);
                        div.append("div").text(formatNumber(population[d.properties.name]));
                    }
                })
                // fade out tooltip on mouse out
                .on("mouseout", function(d) {
                    d3.select(this).classed("highlight", false);
                    div.selectAll("*").remove();
                    div.transition()
                        .duration(0)
                        .style("opacity", 0);
                });

            var x = d3.scaleLog()
                .domain([0.4, 1])   //legend scale 
                .range([0, 400]);

            
            var xAxis = d3.axisBottom()
            /*
                .scale(x)
                .tickSize(13)
                .tickValues(color.domain())
                .tickFormat(function(d) { return d >= 100 ? formatNumber(d) : null; });
             */
            var g = svg.append("g")
                .attr("transform", "translate(460,40)");
            /*
            g.selectAll("rect")
                .data(color.range().map(function(d, i) {
                    return {
                        x0: i ? x(color.domain()[i - 1]) : x.range()[0],
                        x1: i < color.domain().length ? x(color.domain()[i]) : x.range()[1],
                        z: d
                    };
                }))
                .enter().append("rect")
                .attr("height", 12)//8
                
                .attr("x", function(d) { return d.x0; })
                //transform into vertical legend
                .attr("y",400) //shifts to the left of the webpage
                //
                //.attr("x",200)
               
                .attr("width", function(d) { return (d.x1/d.x1) + 12; })
                .style("fill", function(d) { return d.z; })
                .attr("transform", "rotate(90)");
            */    

            g.append("text")
                .attr("class", "caption")
                .attr("x",-445)
                .attr("y", -25)
                .attr("fill", "#000")
                .text("HDI")
                
            
    //============================ADD SOURCES!!!!!!!!!===================================    
    //omar - adding legend 
    //=======================================
    var legendRectSize = 18;
    var legendSpacing = 4;
    var legend = svg.selectAll('.legend')
      .data(color.domain())
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', function(d, i) {
        var height = legendRectSize + legendSpacing;
        var offset = -.5 * height * color.domain().length/2;
        //var horz = 52.5 * legendRectSize;
           var horz = 48 * legendRectSize - 847;
        var vert = i * height - offset; //add more here to change y value
        return 'translate(' + horz + ',' + vert + ')';
      });

    // create the map legend
    legend.append('rect')
      .attr('width', legendRectSize)
      .attr('height', legendRectSize)
      .style('fill', color)
      .style('stroke', color);
    legend.append('text')
      .text(function(d) {return ""})
      .attr('x', legendRectSize + legendSpacing)
      .attr('y', legendRectSize - legendSpacing)
      .text(function(d) { return d; });
    return svg; //return the svg object to further modification


//END OF OMAR     
     
            
            
            
            
        });//end of json!

    });
};
