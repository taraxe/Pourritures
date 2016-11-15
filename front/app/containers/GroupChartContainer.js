import React from 'react';
import store from '../store/configureStore';
import GroupChart from '../components/GroupChart';
import { fetchGroups } from '../actions';
import { connect } from 'react-redux';

class GroupChartContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    store.dispatch(fetchGroups())
  }

  render() {
    if (this.props.isFetching){
      return <span>Loading</span>
    } else {
      return <GroupChart data={this.props.data} />;
    }
  }
}

function mapStateToProps(state) {
  return state.groupsNode;
}

export default connect(mapStateToProps)(GroupChartContainer);
