import React from 'react';

const courtCase = (props) =>
    <div className="courtcase">
        {props.data.name} - {props.data.description}
    </div>;

export default courtCase
