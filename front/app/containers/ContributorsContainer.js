import React from 'react';
import store from '../store/configureStore';
import ContributorsList from '../components/ContributorsList';
import { fetchContributors } from '../actions/external';
import { connect } from 'react-redux';

class ContributorsContainer extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        store.dispatch(fetchContributors())
    }

    render() {
        return <ContributorsList data={this.props.data}/>;
    }
}

function mapStateToProps(state) {
    return state.contributorsNode;
}

export default connect(mapStateToProps)(ContributorsContainer);
