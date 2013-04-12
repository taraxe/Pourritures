    var yF = function(d) {
            var date = new Date();
            date.setYear(d.annee);
            return date;
        },
        xF = function(d) {
            return d.formation
        },
        tooltipF = function(d){
            var template = $('#tooltip-tmpl').html();
            return _.template(template, d[2]);
        }
        chart = new PourrituresChart({ width: 400, height: 400}).x(xF).y(yF).tooltip(tooltipF);

    d3.json('/assets/data/ps.json', function(data) {
        console.log(data.length);

        d3.select("#chart")
            .datum(data)
            .call(chart);
    });