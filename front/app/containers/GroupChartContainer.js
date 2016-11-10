import React from 'react';
import store from '../store/configureStore';
import GroupChart from '../components/GroupChart';
import { fetchGroupData } from '../actions';
import { connect } from 'react-redux';

class GroupChartContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    store.dispatch(fetchGroupData())
  }

  render() {
    if (this.props.isFetchingGroupData){
      return <span>Loading</span>
    } else {
      return <GroupChart data={this.props.groupData} />;
    }
  }
}

function mapStateToProps(state) {
  const data = state.data;
  return {data}
}

export default connect(mapStateToProps)(GroupChartContainer);
