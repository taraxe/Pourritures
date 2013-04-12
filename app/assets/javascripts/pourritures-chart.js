function PourrituresChart(opts) {
    var defaults = { width: 800, height: 1000, margin : {top: 50, right: 20, bottom: 20, left: 20}},
        conf = $.extend(opts, defaults),
        margin = conf.margin,
        width = conf.width,
        height = conf.height,

        xValue = function(d) { return d[0]},
        yValue = function(d) { return d[1]},

        yScale = d3.time.scale(),
        xScale = d3.scale.ordinal(),
        xAxis = d3.svg.axis().scale(xScale),//.orient("right")/*.tickSize(3, 0)*/,
        yAxis = d3.svg.axis().scale(yScale).orient("top")/*.ticks(5)*//*.tickSize(3, 0)*/
        //line = d3.svg.line().x(X).y(Y).interpolate("basis");

    function chart(selection) {
        selection.each(function(data) {

            data = data.map(function(d, i) {
                return [xValue.call(data, d, i), yValue.call(data, d, i), d];
            });

            // Update the x-scale.
            xScale
                .domain(d3.extent(data, function(d) {
                    return d[0].formation;
                }))
                .rangeBands([0, width - margin.right - margin.left]);

            console.log(xScale.domain());

            // Update the y-scale.
            yScale
                .domain([d3.max(data, Y), d3.min(data, Y)])
                .range([0, height - margin.bottom - margin.top]);

            // Select the svg element, if it exists.
            var svg = d3.select(this).selectAll("svg").data([data]);

            // Otherwise, create the skeletal chart.
            var svgEnter = svg.enter().append("svg");
            conf.title ? svgEnter.append("text").attr('class','title').text(conf.title).attr('transform','translate()') : '';
            var gEnter = svgEnter.append("g").attr('transform','translate('+ margin.left+','+margin.top+')');



            //gEnter.append("path").attr("class", "line");
            gEnter.append("g").attr("class", "x axis");
            console.log(xScale.range())
            gEnter.append("g").attr("class", "y axis").attr("transform", "translate(0,0) rotate(90)");

            var nest = d3.nest()
                .key(function(d){ return d[2].formation;})
                .key(function(d){ return d[2].annee;})
                .map(data);
            console.log(nest);

            gEnter.append("g")
                .selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .attr("r",20)
                .attr("cy",function(d){
                    return yScale(d[1])
                })
                .attr("cx",function(d){
                    return xScale(d[0].formation)
                })
                .append("text");

            // Update the outer dimensions.
            svg .attr("width", width)
                .attr("height", height);

            // Update the inner dimensions.
            var g = svg.select("g")
                //.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // Update the line path.
            /*g.select(".line")
                .transition()
                .ease("linear")
                .duration(500)
                .attr("d", line);*/

            // Update the x-axis.
            g.select(".x.axis")
                /*.attr("transform", "translate(0," + yScale.range()[0] + ")")
                .transition()
                .ease("linear")
                .duration(500)*/
                .call(xAxis);
            // Update the y-axis.
            g.select(".y.axis")
                /*.attr("transform", "translate(0," + yScale.range()[0] + ")")
                .transition()
                .ease("linear")
                .duration(500)*/
                .call(yAxis);
        });
    }

    // The x-accessor for the path generator; xScale âˆ˜ xValue.
    function X(d) {
        return xScale(d[0]);
    }

    // The x-accessor for the path generator; yScale âˆ˜ yValue.
    function Y(d) {
        return yScale(d[1]);
    }

    chart.margin = function(_) {
        if (!arguments.length) return margin;
        margin = _;
        return chart;
    };

    chart.width = function(_) {
        if (!arguments.length) return width;
        width = _;
        return chart;
    };

    chart.height = function(_) {
        if (!arguments.length) return height;
        height = _;
        return chart;
    };

    chart.x = function(_) {
        if (!arguments.length) return xValue;
        xValue = _;
        return chart;
    };

    chart.y = function(_) {
        if (!arguments.length) return yValue;
        yValue = _;
        return chart;
    };
    chart.tooltip = function(_) {
        if (!arguments.length) return tooltip;
        tooltip = _;
        return chart;
    };

    return chart;
}