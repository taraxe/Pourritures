import React from 'react';
import CandidateItem from './CandidateItem';

const Candidates = (props) => {
        const style = {
            display : "flex",
            flexWrap: "wrap",
        };

        return (<div style={style}>
            {props.data.map(c =>
                <CandidateItem key={c.slug} {...c}/>
            )}
            <div className="clear"></div>
        </div>)};

export default Candidates;
