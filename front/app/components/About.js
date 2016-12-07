import React from 'react';
import ContributorsContainer from '../containers/ContributorsContainer'
import DocumentTitle from 'react-document-title';

const about = (props) =>
    <DocumentTitle title={window.pourritures.title+' : A propos'}>
            <div className="container">
                    <div className="row">
                            <h1>Motivation</h1>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    </div>
                    <div className="row">
                            <h1>Comment participer</h1>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    </div>
                    <div className="row">
                            <h1>Contributeurs</h1>
                            <p>D'après <a href="//github.com/taraxe/Pourritures" target="_blank">Github</a></p>
                            <ContributorsContainer/>
                    </div>
            </div>
    </DocumentTitle>;


export default about