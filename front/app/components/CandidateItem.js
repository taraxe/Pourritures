import React from 'react';
import {Link} from 'react-router';
import { pluralize} from '../utils';
import DocumentTitle from 'react-document-title';

const candidate = (props) => {
    const style = {
        flex: "1 0 200px"
    };

    const imgStyle = {
        backgroundImage: "url("+props.image+")",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat"
    };

    return (
      <DocumentTitle title={window.pourritures.title+' : '+ props.name}>
          <div className="p-md m-l-md m-r-md m-t-md m-b-md border-left-right border-top-bottom" style={style}>
              <div className="text-center">
                  <Link to={"/ordures/" + props.slug}>
                      <img className="img-lg img-circle m-b-sm" style={imgStyle}/>
                  </Link>
                  <span className="clear"/>
                  <small>{props.party}</small>
                  <Link to={"/ordures/" + props.slug}>
                      <h2 className="m-t-none">{props.name}</h2>
                      {props.fileCount < 1 ? "": <p className="text-danger">{props.fileCount} {pluralize(props.fileCount, "affaire", "affaires")},<br/>{props.convictedCount} {pluralize(props.convictedCount, "condamnation", "condamnations")}</p>}
                  </Link>
              </div>
          </div>
        </DocumentTitle>
    );
};

export default candidate
