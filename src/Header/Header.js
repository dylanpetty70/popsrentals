import React, {Component} from 'react';
import { connect } from 'react-redux';
import {withRouter} from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav';

class Header extends Component {

	constructor(props){
		super(props);
        this.state = {};
	}

	componentDidMount(){
		
	}

	render(){
		return(
			<div className="App">
				<Navbar collapseOnSelect expand="lg" style={{backgroundColor: '#FFFFFF', zIndex: 99999, outlineColor: 'lightGrey', outlineWidth: '2px', outlineStyle: 'solid'}}>
                  <Navbar.Brand href="/" style={{color: 'white'}}><img src='/images/title/logo.png' alt='logo' style={{height: '50px', padding: '0', margin: '0'}}/></Navbar.Brand>
                  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                  <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                      {(this.props.userStatus) ? <Nav.Link href="/" style={{color: 'black'}}>Search Property</Nav.Link> : <></>}
                    </Nav>
                    <Nav>
						<Nav.Link href="/login" style={{color: 'black'}}>{(this.props.userStatus) ? 'Log Out' : 'Log In'}</Nav.Link>
                    </Nav>
                  </Navbar.Collapse>
                </Navbar>
			</div>
		)
	}
}

const mapStateToProps = state => {
	return{
		userStatus: state.userStatus,
        user: state.user,
	}
}

export default withRouter(connect(mapStateToProps)(Header));