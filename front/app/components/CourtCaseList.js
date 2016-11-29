import React from 'react';
import CourtCase  from './CourtCase';
import {slugify} from '../utils';
import take from 'lodash/take';

class CourtCaseList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: false
        }

    }

    onClick(event) {
        this.setState({expanded: true});
    }

    render() {
        const toShow = this.state.expanded ? this.props.data : take(this.props.data, 6);
        return (
            <div>
                <ul className="list-group">
                    {toShow.map(c => <CourtCase key={slugify(c.name)} {...c}/>)}
                </ul>
                { !this.state.expanded ? <a onClick={ (e) => this.onClick(e) }>Plus d'affaires</a> : ''}
            </div>
        )
    }
}

export default CourtCaseList;
