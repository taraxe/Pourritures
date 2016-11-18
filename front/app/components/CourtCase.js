import React from 'react';

const courtCase = (props) =>
    <div className="courtcase">
        <a href={props.data.link} target="_blank">{props.data.name}</a><br /><br />
        <p>{props.data.description}</p>
    </div>;

export default courtCase
