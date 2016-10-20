import * as d3 from 'd3';


const TimeSeries = function(opts) {
    var defaults = { margin : {top: 20, right: 20, bottom: 20, left: 20}},
        conf = Object.assign({}, defaults, opts),
        margin = conf.margin,
        width = conf.width,
        height = conf.height,
        usable_height = height - margin.bottom - margin.top,
        usable_width = width - margin.right - margin.left,
        yScale = d3.scaleLinear(),
        xScale = d3.scaleTime(),
        xAxis = d3.axisBottom(xScale).tickSize(6,0),
        yAxis = d3.axisLeft(yScale).tickSize(6,0),
        line = d3.line()
            .curve(d3.curveBasis)
            .x(function(d){return xScale(d[0])})
            .y(function(d){return yScale(d[1])})
            ,
        cLine = d3.line()
            .curve(d3.curveBasis)
            .x(function(d){return xScale(d[0])})
            .y(function(d){return yScale(d[2])})
            ,
        xValue, yValue, y2Value = undefined;
    function chart(selection) {

        selection.each(function(data) {

            data = data.map(function(d, i) {
                return [xValue.call(data, d, i), yValue.call(data, d, i), y2Value.call(data,d , i)];
            });

            xScale
                .domain([d3.min(data, function(d){return d[0]}), d3.max(data, function(d){return d[0]})])
                .range([0, usable_width]);

            yScale
                .domain([d3.max(data, function(d){return d3.max([d[1],d[2]])}), d3.min(data, function(d){return d[1]})])
                .range([0, usable_height]);

            var svg = d3.select(this)
                .data([data])
                .attr("width", width)
                .attr("height", height);

            var g = svg.append("g");

            g.append("path").attr("class","line");
            g.append("path").attr("class","line summed").attr("stroke-dasharray","5,5");
            g.append("g").attr("class", "x axis").attr('transform','translate(0,'+(height-margin.top-margin.bottom)+')');
            g.append("g").attr("class", "y axis");

            g.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            g.select(".x.axis").call(xAxis);

            g.select(".line").attr('d',line);

            g.select(".line.summed").attr('d',cLine);

            g.select(".y.axis").call(yAxis);
        });
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

    chart.y2 = function(_) {
        if (!arguments.length) return y2Value;
        y2Value = _;
        return chart;
    };
    return chart;
};

export default TimeSeries
