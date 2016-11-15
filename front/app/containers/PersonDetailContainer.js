import React from 'react';
import store from '../store/configureStore';
import PersonDetails from '../components/PersonDetails';
import { fetchPersonDetails } from '../actions';
import { connect } from 'react-redux';

class PersonDetailsContainer extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        store.dispatch(fetchPersonDetails({slug: this.props.params.slug}))
    }

    render(){
        if (this.props.isFetching){
            return <span>Loading</span>
        } else {
            return <PersonDetails data={this.props} />;
        }
    }
}

function mapStateToProps(state) {
    return state.ordureNode;
}

export default connect(mapStateToProps)(PersonDetailsContainer);
