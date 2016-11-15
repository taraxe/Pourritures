import React from 'react';
import store from '../store/configureStore';
import CandidateList from '../components/CandidateList';
import { fetchCandidates } from '../actions';
import { connect } from 'react-redux';

class CandidateListContainer extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        store.dispatch(fetchCandidates())
    }

    render() {
        if (this.props.isFetching){
            return <span>Loading</span>
        } else {
            return <CandidateList data={this.props.data}/>;
        }
    }
}

function mapStateToProps(state) {
    return state.candidatesNode;
}

export default connect(mapStateToProps)(CandidateListContainer);
