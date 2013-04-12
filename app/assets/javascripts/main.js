(function(ns, d3, $){

    d3.json('/assets/data/pourritures.json', function(data) {

        var filtered = data.filter(function(e){
            return e.annee > 1995;
        });

        /* Main chart */
        var chart1 = new ns.PourrituresChart()
                .x(function(d) {
                    return d.formation;
                })
                .y(function(d) {
                    var date = new Date();
                    date.setYear(d.annee);
                    return date;
                })
                .tooltip(function(d){
                    var template = $('#tooltip-tmpl').html();
                    return _.template(template, d[0])
                });


        d3.select('.pourriture-chart')
            .datum(filtered)
            .call(chart1);

        /* Pourriture list */

        d3.nest()
            .key(function(d){return d.name})
            .entries(filtered)
            .forEach(function(e){

            });


        /* High score chart */
        var t = $('#highscore-tmpl').html();

        d3.nest()
            .key(function (d) { return d.name})
            .rollup(function (values) { return {
                condamnations: d3.sum(values, function (d) {
                    return +d.raison.length
                }),
                formation: values[0].formation,
                lower: d3.min(values, function (d) {
                    return d.annee
                }),
                upper: d3.max(values, function (d) {
                    return d.annee
                })
            }})
            .entries(filtered)
            .sort(function (a, b) {
                return b.values.condamnations - a.values.condamnations
            })
            .slice(0, 3)
            .forEach(function(e,i){
                var d = $.extend(e, e.values); // flatten the key and values
                d.rank = i+1;
                d.name = e.key;
                $('.high-score').append(_.template(t,d))
            });

         /* Cumulated chart */
        var cumulated = d3.nest()
            .key(function(d){return d.annee})
            .sortKeys(d3.ascending)
            .rollup(function(values){
                    var f = function (d) {return +d.raison.length},
                        filter = function(g){ return function(d){ return d.formation === g}};
                    return [
                        d3.sum(values, f),
                        d3.sum(values.filter(filter("ps")), f),
                        d3.sum(values.filter(filter("ump")), f),
                        d3.sum(values.filter(filter("fn")), f)
                    ]
            })
            .entries(filtered)
            .map(function(d, i, arr){
                d.values.push( (i > 0 ? arr[i-1].values[4] : 0) + d.values[0]);
                return d;
            });
        var chart2 = new ns.TimeSeriesChart({width: 400, height:200})
            .x(function(d){
                var date = new Date();
                date.setYear(d.key);
                return date;
            })
            .y(function (d) {return d.values[4]});

        d3.select('.cumulated-chart').datum(cumulated).call(chart2);
    });

}(window.pourritures = window.pourritures || {}, d3, jQuery));