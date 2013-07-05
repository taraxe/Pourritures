(function(ns, d3, $){

    d3.json('/import.json', function(data){
    d3.json('/assets/data/alternance.json', function(alter){

        var filtered = data.filter(function(e){
            return e.annee >= 1995;
        });

        /* Main chart */
        (function(data, alter){

            var chart1 = new ns.charts.Pourritures({ alter:  alter})
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


            d3.select('.pourriture .chart')
                .datum(data)
                .call(chart1);
        })(filtered, alter);

        /* Pourriture list */
        (function(data){
            var f = $('.pourriture .filter-box'),
                c = f.find('.by-name'),
                a = '.pourriture .content circle',
                $a = $(a);

            d3.nest()
                .key(function(d){return d.name})
                .sortKeys(d3.ascending)
                .entries(data)
                .forEach(function(e){
                    c.append($('<li class="pourri"><label><input type="checkbox" name="'+ e.key.toLowerCase()+'">'+ e.key+'</label></li>'));
                });

            f.on('click','a', function(e){
                e.preventDefault();
                $('li.pourri input[type="checkbox"]').prop('checked',false);
                resetNameFilter();
            });
            f.on('change','li.pourri input', function(){
                var $this = $(this),
                    toShow = f.find('li.pourri input:checked').map(function(){ return $this.prop('name')}).toArray();

                if(toShow.length > 0) {
                    d3.selectAll(a)
                        .classed('hidden',true)
                        .filter(function(){
                            return toShow.indexOf(d3.select(this).attr("name")) >= 0;
                        }).classed('hidden',false);

                    if($this.is(':checked')) $a.tipsy('hide').filter('[name="'+$this.attr('name')+'"]').first().tipsy('show');
                    else $a.tipsy('hide')
                } else resetNameFilter();
            });
            function resetSearch() {
                c.find('input[type="checkbox"]').closest('li').fadeIn('fast');
            }
            function resetNameFilter() {
                d3.selectAll(a).classed('hidden', false);
                $a.tipsy('hide');
            }
            f.find('input[type="search"]').on('keyup', function(e){
                if($(this).val() === "") resetSearch();
                else c.find('li').show()
                    .find('input[type="checkbox"]:not(input[name*="'+$(this).val().toLowerCase()+'"])')
                    .closest('li').hide();
            });
            f.find('input[type="search"]').on('search', function(e){
                if($(this).val() === "") resetSearch();
            });
        })(filtered);

        /* High score chart */
        (function(data){
            var t = $('#highscore-tmpl').html();

            d3.nest()
                .key(function (d) { return d.name})
                .rollup(function (values) { return {
                    condamnations: d3.sum(values, function (d) {
                        return +d.infractions.length
                    }),
                    formation: values[0].formation,
                    lower: d3.min(values, function (d) {
                        return d.annee
                    }),
                    upper: d3.max(values, function (d) {
                        return d.annee
                    })
                }})
                .entries(data)
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

        })(filtered);


        /* Cumulated chart */
        (function(data){
            var cumulated = d3.nest()
                .key(function(d){return d.annee})
                .sortKeys(d3.ascending)
                .rollup(function(values){
                    var f = function (d) {return +d.infractions.length},
                        filter = function(g){ return function(d){ return d.formation === g}};
                    return [
                        d3.sum(values, f), // todo make this generic for every group
                        d3.sum(values.filter(filter("ps")), f),
                        d3.sum(values.filter(filter("ump")), f),
                        d3.sum(values.filter(filter("fn")), f)
                    ]
                })
                .entries(data)
                .map(function(d, i, arr){
                    d.values.push( (i > 0 ? arr[i-1].values[4] : 0) + d.values[0]);
                    return d;
                });

            var chart2 = new ns.charts.TimeSeries({width: 400, height:200})
                .x(function(d){
                    var date = new Date();
                    date.setYear(d.key);
                    return date;
                })
                .y(function (d) {return d.values[0]})
                .y2(function(d){ return d.values[4]});

            d3.select('.cumulated').datum(cumulated).call(chart2);
        })(filtered)

    });
    });

}(window.pourritures = window.pourritures || {}, d3, jQuery));