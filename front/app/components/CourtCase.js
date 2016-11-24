import React from 'react';
import {Link} from 'react-router';
import { pluralize } from '../utils';

const courtCase = (props) =>
    <li className="list-group-item">
        <h2 className="list-group-item-heading">{props.name}</h2>
        <div className="list-group-item-text">
            <p>{props.description}</p>

            <h4>{pluralize(props.pourritures, "Elu impliqué", "Elus impliqués")}:</h4>
            <ul className="unstyled">
                {props.pourritures.map(p =>
                    <li key={p.slug}><Link to={"/ordures/"+p.slug}>{p.name}</Link> <small>{p.conviction} pour {p.charges.join(", ")}</small></li>
                )}
            </ul>
            <span className="pull-right"><a href={props.link} target="_blank">En savoir plus</a></span>
        </div>
    </li>;

export default courtCase
