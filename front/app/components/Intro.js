import React from 'react';
import {Link} from 'react-router';

const Intro = (props) =>
    (
        <div>
            <p>
            La défiance des Français à l'égard de leurs représentant est profonde.<br/>
            Comment <strong>dénoncer les abus des élus</strong> sans tomber dans le « tous pourris » ?</p>
            <p>C'est l'objet de cette plateforme :
                <ul>
                    <li>Informer sur les affaires.</li>
                    <li><Link to="/contribute">Contribuer</Link> à leur recensement.</li>
                    <li><Link to="/impulse">Faire pression</Link> pour changer les règles et <strong>en finir avec l'impunité.</strong></li>
                </ul>
                Nous voulons des <strong>représentants irréprochables</strong>.
            </p>
        </div>
    );


export default Intro