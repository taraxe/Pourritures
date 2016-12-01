import React from 'react';
import store from '../store/configureStore';
import GroupChart from '../components/GroupChart';
import { fetchGroups } from '../actions/internal';
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
      const data =  this.props.data[this.props.type];
      return <GroupChart data={data} />;
    }
  }
}

function mapStateToProps(state) {
  return state.groupsNode;
}

export default connect(mapStateToProps)(GroupChartContainer);
