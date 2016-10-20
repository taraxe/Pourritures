import React from 'react';
import * as d3 from 'd3';
import Faux from 'react-faux-dom';
import TimeSeries from '../utils/Chart';

const chart = React.createClass({
    mixins: [
        Faux.mixins.core,
        Faux.mixins.anim
    ],
    propTypes: {
        data: React.PropTypes.array,
        width: React.PropTypes.number,
        height: React.PropTypes.number
    },
    render(){
        const node = Faux.createElement('svg');
        const data = this.props.data;
        const conf = {width: this.props.width, height:this.props.height};

        const chart = new TimeSeries(conf)
            .x(function(d){
                var date = new Date();
                date.setYear(d.key);
                return date;
            })
            .y(function (d) {return d.value[0]})
            .y2(function(d){ return d.value[4]});

        d3.select(node).datum(data).call(chart);

        const svg = node.toReact();
        return (
            <div>
                <h2>Nombre de condamnations</h2>
                <div className='chart'>
                    {svg}
                </div>
            </div>
        )
    }
});
export default chart;
