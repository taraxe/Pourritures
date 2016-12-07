import React from 'react';
import store from '../store/configureStore';
import Stats from '../components/Stats';
import { fetchStats } from '../actions/internal';
import { connect } from 'react-redux';

class StatsContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    store.dispatch(fetchStats())
  }

  render() {
    if (this.props.isFetching){
      return <span>Loading</span>
    } else {
      return <Stats {...this.props.data}/>;
    }
  }
}

function mapStateToProps(state) {
  return state.statsNode;
}

export default connect(mapStateToProps)(StatsContainer);
