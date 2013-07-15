(function(ns, d3, $){

    var order = ["pcf","fdg","verts","ps","udi","ump","fn"]; // natural ordering


    var Pourritures = function(opts) {
        var defaults = { width: 800, height: 650, margin : {top: 70, right: 20, bottom: 20, left: 40}},
            conf = $.extend(defaults,opts),
            margin = conf.margin,
            width = conf.width,
            height = conf.height,
            usable_width = width - margin.left - margin.right,
            usable_height = height - margin.top - margin.bottom,
            yScale = d3.time.scale(),
            xScale = d3.scale.ordinal(),
            xAxis = d3.svg.axis().scale(xScale).orient("top").tickSize(0).tickFormat(function(d){return d.toUpperCase()}),
            yAxis = d3.svg.axis().scale(yScale).orient("left").tickSize(0).tickPadding(10).ticks(d3.time.years),
            circleWidth = usable_width / 65,
            tooltip = null;

        function chart(selection) {
            selection.each(function(data) {

                data = data.map(function(d, i) {
                    return [d, xValue.call(data, d, i), yValue.call(data, d, i)];
                });

                var format = d3.time.format("%d/%m/%Y");
                var alternance = conf.alter.map(function(d){
                    return [format.parse(d.start),format.parse(d.end), d.gouv];
                });

                xScale
                    .domain(data.map(function(d){return d[1]}).sort(function (a, b) {
                        return order.indexOf(a) - order.indexOf(b);
                    }))
                    .rangeBands([0, usable_width], 0.1);
                console.log("X ["+xScale.domain()+"] => ["+xScale.range()+"]");


                // we want 1 year before the first condamnation date
                var minDate = d3.min(data, function (d) {return d[2]}),
                    d = new Date();
                d.setYear(minDate.getYear() - 1);

                yScale
                    .domain([d3.max(data, function(d){return d[2]}), d])
                    .range([0, usable_height]);

                console.log("Y ["+yScale.domain() +"] => ["+yScale.range()+"]");

                var svg = d3.select(this).selectAll("svg:not(.legend)").data([data]);

                var svgEnter = svg.enter().append("svg").attr('class','content');
                var gEnter = svgEnter.append("g");

                gEnter.append("g").attr("class", "x axis");
                gEnter.append("g").attr("class", "y axis");

                //gouvernment color
                gEnter.append("g").attr("class", "gouv").attr("transform","translate(-67,0)")
                    .selectAll("rect")
                    .data(alternance).enter()
                    .append("rect")
                    .attr("x", function(){ return xScale.range()[0]})
                    .attr("y", function(d){ return yScale(d[1])})
                    .attr("width", 40)
                    .attr("height", function(d){ return Math.abs(yScale(d[1]) - yScale(d[0]))})
                    .attr("class", function(d){
                        return "group "+ d[2];
                    });

                var nest = d3.nest()
                    .key(function(d){ return d[1]}) //by Year
                    .key(function(d){ return d[2]}) //by Groupe politique
                    .entries(data);

                var groups = gEnter.append("g").selectAll("g").data(nest).enter()
                    .append("g")
                    .attr("class",function(d){
                        return "group "+ d.key;
                    })
                    .attr("transform",function(d){
                        return "translate("+xScale(d.key)+",0)"
                    });

                var years = groups.selectAll("g").data(function(d){return d.values}).enter().append("g").attr("class",function(d){
                    return "year y"+ d.key
                });

                years.selectAll("circle")
                    .data(function(d){
                        return d.values.sort(function (a, b) {
                            return b[0].infractions.length - a[0].infractions.length ;
                        });
                    })
                    .enter()
                    .append("a").attr("xlink:href",function(d){
                        return jsRoutes.controllers.Pourritures.show(d[0].slug).url;
                    })
                    .append("circle")
                    .attr("r",function(d){
                        var l = d[0].infractions.length;
                        return Math.sqrt(l) * circleWidth
                    })
                    .attr("cy",function(d){return yScale(d[2])})
                    .attr("cx",function(d,i){
                        return i * xScale.rangeBand()/this.parentNode.parentNode.__data__.values.length
                    })
                    .attr("class", function(d){
                        return d[0].ex ? "ex " : "";
                    })
                    .attr("name",function(d){
                        return d[0].name.toLowerCase();
                    })
                    .attr("stroke-dasharray",function(d){
                        return d[0].type.indexOf("condamnation") >= 0 ? "0" : "5,5";
                    })
                    .each(function(d){
                        $(this).tipsy({
                            title: function() {return tooltip(d);},
                            html : true,
                            fade: true,
                            gravity: 's'
                        });
                    });

                svg.attr("width", width)
                    .attr("height", height);

                var g = svg.select("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                g.select(".x.axis")
                    .call(xAxis)
                    .selectAll('text').attr('dy','-30');

                g.select(".y.axis")
                    .call(yAxis)
                    .selectAll('line')
                    .attr('x2', usable_width);
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
        chart.tooltip = function(_) {
            if (!arguments.length) return tooltip;
            tooltip = _;
            return chart;
        };

        return chart;
    };

    var TimeSeries = function(opts) {
        var defaults = { width: 800, height: 650, margin : {top: 20, right: 20, bottom: 20, left: 30}},
            conf = $.extend(defaults,opts),
            margin = conf.margin,
            width = conf.width,
            height = conf.height,
            usable_height = height - margin.bottom - margin.top,
            usable_width = width - margin.right - margin.left,
            yScale = d3.scale.linear(),
            xScale = d3.time.scale(),
            xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickSize(6,0),
            yAxis = d3.svg.axis().scale(yScale).orient("left").tickSize(6,0),
            line = d3.svg.line()
                .x(function(d){return xScale(d[0])})
                .y(function(d){return yScale(d[1])})
                .interpolate("basis"),
            cLine = d3.svg.line()
                .x(function(d){return xScale(d[0])})
                .y(function(d){return yScale(d[2])})
                .interpolate("basis");

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

                var svg = d3.select(this).selectAll("svg:not(.legend)").data([data]);

                var gEnter = svg.enter().append("svg").append("g");

                gEnter.append("path").attr("class","line");
                gEnter.append("path").attr("class","line summed").attr("stroke-dasharray","5,5");
                gEnter.append("g").attr("class", "x axis").attr('transform','translate(0,'+(height-margin.top-margin.bottom)+')');
                gEnter.append("g").attr("class", "y axis");

                svg .attr("width", width)
                    .attr("height", height);

                var g = svg.select("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                g.select(".x.axis")
                    .call(xAxis);

                g.select(".line").attr('d',line);

                g.select(".line.summed").attr('d',cLine);

                g.select(".y.axis")
                    .call(yAxis);
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

    var Donuts = function(opts) {
        var defaults = { width: 800, height: 650, margin : {top: 20, right: 20, bottom: 20, left: 30}},
            conf = $.extend(defaults,opts),
            margin = conf.margin,

            height = conf.height - margin.bottom - margin.top,
            width = conf.width - margin.right - margin.left,
            radius = 74,
            color = d3.scale.ordinal().range(colorbrewer.Pastel1[7]);
            arc = d3.svg.arc().outerRadius(radius).innerRadius(radius - 30),
            pie = d3.layout.pie().sort(null).value(function(e){return e.value});

        function chart(selection) {
            selection.each(function(data) {

                data = data.sort(function (a, b) {
                    return order.indexOf(a.formation) - order.indexOf(b.formation);
                });

                color.domain(data[0].natures.map(function(e){return e.name}));

                    var legend = d3.select(this).append("svg")
                        .attr("class", "legend")
                        .attr("width", radius * 2)
                        .attr("height", radius * 2)
                        .selectAll("g")
                        .data(color.domain().slice().reverse())
                        .enter().append("g")
                        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

                    legend.append("rect")
                        .attr("width", 18)
                        .attr("height", 18)
                        .style("fill", color);

                    legend.append("text")
                        .attr("x", 24)
                        .attr("y", 9)
                        .attr("dy", ".35em")
                        .text(function(d) { return d; });

                    var svg = d3.select(this).selectAll(".pie")
                        .data(data)
                        .enter().append("svg")
                        .attr("class", "pie")
                        .attr("width", radius * 2)
                        .attr("height", radius * 2)
                        .append("g")
                        .attr("transform", "translate(" + radius + "," + radius + ")");

                    svg.selectAll(".arc")
                        .data(function(d) {
                            return pie(d.natures);
                        })
                        .enter().append("path")
                        .attr("class", "arc")
                        .attr("d", arc)
                        .style("fill", function(d) {
                            return color(d.data.name);
                        });

                    svg.append("text")
                        .attr("dy", ".35em")
                        .style("text-anchor", "middle")
                        .text(function(d) { return d.formation; });

                });

        }

        return chart;
    };


    var Stacked = function(options){
        var defaults = { width: 800, height: 650, margin : {top: 20, right: 20, bottom: 20, left: 20}},
            conf = $.extend(defaults,options),
            margin = conf.margin,
            height = conf.height - (margin.top + margin.bottom),
            width = conf.width - (margin.left + margin.right),

            parseDate = d3.time.format("%Y").parse,
            formatDate = function(d) { return d.getFullYear(); },

            y1 = d3.scale.linear(),
            x = d3.scale.ordinal().rangeRoundBands([0, width], .1, 0),
            xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(formatDate).tickSize(0),
            yAxis = d3.svg.axis().scale(y1).orient("left").tickSize(0),

            nest = d3.nest().key(function(d) { return d.group; }),

            stack = d3.layout.stack()
            .values(function(d) {return d.values;})
            .x(function(d) {return d.date;})
            .y(function(d) {return d.value; })
            .out(function(d, y0) {d.valueOffset = y0;}),

            tooltip = null;




        function chart(selection){
            selection.each(function(data) {

                data.forEach(function(d) {
                    d.date = parseDate(d.date);
                    d.value = +d.value;
                });
                var dataByGroup = nest.entries(data);

                x.domain(dataByGroup[0].values.map(function(d) { return d.date; }));
                var dataByYear = d3.nest().key(function (d) {return d.date}).rollup(function (aff) {
                    var reduction = aff.reduce(function (a, b) {
                        return a + b.value;
                    }, 0);
                    return  reduction;
                    }).entries(data);

                y1.domain([0, d3.max(dataByYear,function(d){ return d.values})]).range([height, 0]);

                stack(dataByGroup);

                var svg = d3.select(this).append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                var group = svg.selectAll(".group")
                    .data(dataByGroup)
                    .enter().append("g")
                    .attr("class", function(d){return "group " + d.key;});


                group.selectAll("rect")
                    .data(function(d) { return d.values; })
                    .enter().append("rect")
                    .attr("x", function(d) { return x(d.date); })
                    .attr("y", function(d) {return y1(d.value + d.valueOffset);})
                    .attr("width", x.rangeBand())
                    .attr("height", function(d) { return y1(0) - y1(d.value); })
                    .each(function(d){
                        $(this).tipsy({
                            title: function() {return tooltip(d);},
                            html : true,
                            fade: true,
                            gravity: 's'
                        });
                    });

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + (height) + ")")
                    .call(xAxis);

                svg.append("g").attr("class", "y axis")
                    .call(yAxis);

            });
        }
        chart.tooltip = function(_) {
            if (!arguments.length) return tooltip;
            tooltip = _;
            return chart;
        };
        return chart
    }
    ns.charts = {
        Pourritures : Pourritures,
        TimeSeries : TimeSeries,
        Donuts : Donuts,
        Stacked: Stacked
    }
}(window.pourritures = window.pourritures || {}, d3, jQuery));