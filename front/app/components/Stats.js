import React from 'react';

class Stats extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
      return (
          <p>
              <span className="h4">{this.props.totalElected}</span> élus concernés par <span className="h4">{this.props.totalFiles}</span> affaires, dont <span className="h4">{this.props.totalConvicted}</span> condamnations (en première instance ou en appel). Soit une moyenne de <span className="h4">{this.props.avConvictedByElected}</span> affaire / élu.
          </p>
      )
  }
}

export default Stats
