import React from 'react';
import DocumentTitle from 'react-document-title';

class IframeComponent extends React.Component {

  render(){
    var Iframe=this.props.iframe;

    return(
      <div>
       <Iframe src={this.props.src} height={this.props.height} width={this.props.width} frameBorder={this.props.frameBorder} marginHeight={this.props.marginHeight} marginWidth={this.props.marginWidth} />
      </div>
    )
  }
};

const Contribute = (props) =>
    <DocumentTitle title={window.pourritures.title+' : Contribuer'}>
            <div className="container">
              <IframeComponent iframe='iframe' src="https://docs.google.com/forms/d/e/1FAIpQLSeEHzRIn4yi93uKvZbauZXRtVlptO3sgfnC-j29XcHNBiXseA/viewform?embedded=true" height="600px" width="100%" frameBorder="0" marginHeight="0" marginWidth="0" />
            </div>
    </DocumentTitle>;


export default Contribute
