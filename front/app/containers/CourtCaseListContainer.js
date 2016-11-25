import React from 'react';
import store from '../store/configureStore';
import CourtCaseList from '../components/CourtCaseList';
import { fetchCourtCases } from '../actions/internal';
import { connect } from 'react-redux';

class CourtCaseListContainer extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        store.dispatch(fetchCourtCases())
    }

    render() {
        if (this.props.isFetching){
            return <span>Loading</span>
        } else {
            return <CourtCaseList data={this.props.data}/>;
        }
    }
}

function mapStateToProps(state) {
    return state.courtCasesNode;
}

export default connect(mapStateToProps)(CourtCaseListContainer);
