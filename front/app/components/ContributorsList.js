import React from 'react';

const ContributorsList = function(props) {
    const contributor = (c) =>
        <li className="col-lg-4">
            <a href={c.url}><img className="img-rounded img-md" src={c.avatar} alt={c.name}/></a>
        </li>;


    return (
        <ul>
            {props.data.map(contributor)}
        </ul>
    );
};
export default ContributorsList;
