import React from 'react';
import {Link} from 'react-router';
import { withRouter } from 'react-router'

const MenuItem = (props) =>
        <li className={props.router.isActive(props.path, true) ? 'active' : ''}>
            <Link to={props.path} role='button' aria-expanded='false'>{props.label}</Link>
        </li>;

const header = (props) =>

    <div className='row border-bottom'>
        <nav className='navbar navbar-static-top' role='navigation'>
            <div className='navbar-header'>
                <button aria-controls='navbar' aria-expanded='false' data-target='#navbar' data-toggle='collapse' className='navbar-toggle collapsed' type='button'>
                    <i className='fa fa-reorder'></i>
                </button>
                <Link to="/" className='navbar-brand'>{window.pourritures.title}</Link>
            </div>
            <div className='navbar-collapse collapse' id='navbar'>
                <ul className='nav navbar-nav'>
                    <MenuItem path="/" label="Accueil" {...props}/>
                    <MenuItem path="/contribute" label="Contribuer" {...props}/>
                    <MenuItem path="/impulse" label="Influer" {...props}/>
                    <MenuItem path="/about" label="A propos" {...props}/>

                    {/*<li className='dropdown'>
                        <a aria-expanded='false' role='button' href='#' className='dropdown-toggle' data-toggle='dropdown'> Menu item <span className='caret'></span></a>
                        <ul role='menu' className='dropdown-menu'>
                            <li><a href=''>Menu item</a></li>
                            <li><a href=''>Menu item</a></li>
                            <li><a href=''>Menu item</a></li>
                            <li><a href=''>Menu item</a></li>
                        </ul>
                    </li>
                    <li className='dropdown'>
                        <a aria-expanded='false' role='button' href='#' className='dropdown-toggle' data-toggle='dropdown'> Menu item <span className='caret'></span></a>
                        <ul role='menu' className='dropdown-menu'>
                            <li><a href=''>Menu item</a></li>
                            <li><a href=''>Menu item</a></li>
                            <li><a href=''>Menu item</a></li>
                            <li><a href=''>Menu item</a></li>
                        </ul>
                    </li>
                    <li className='dropdown'>
                        <a aria-expanded='false' role='button' href='#' className='dropdown-toggle' data-toggle='dropdown'> Menu item <span className='caret'></span></a>
                        <ul role='menu' className='dropdown-menu'>
                            <li><a href=''>Menu item</a></li>
                            <li><a href=''>Menu item</a></li>
                            <li><a href=''>Menu item</a></li>
                            <li><a href=''>Menu item</a></li>
                        </ul>
                    </li>
                    <li className='dropdown'>
                        <a aria-expanded='false' role='button' href='#' className='dropdown-toggle' data-toggle='dropdown'> Menu item <span className='caret'></span></a>
                        <ul role='menu' className='dropdown-menu'>
                            <li><a href=''>Menu item</a></li>
                            <li><a href=''>Menu item</a></li>
                            <li><a href=''>Menu item</a></li>
                            <li><a href=''>Menu item</a></li>
                        </ul>
                    </li>*/}
                </ul>
                {/*<ul className='nav navbar-top-links navbar-right'>
                    <li>
                        <a href='login.html'>
                            <i className='fa fa-sign-out'></i> Log out
                        </a>
                    </li>
                </ul>*/}
            </div>
        </nav>
    </div>;


export default withRouter(header);
