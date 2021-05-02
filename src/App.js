import React from 'react';
import './App.css';
import Router from "./Router";
import { BrowserRouter } from 'react-router-dom';
import Header from './Header/Header';
import { connect } from 'react-redux';
import {useMediaQuery} from 'react-responsive';
import Image from 'react-bootstrap/Image';
var logo = "/images/title/logo.png";

const Desktop = ({ children }) => {
  const isDesktop = useMediaQuery({ minWidth: 768 })
  return isDesktop ? children : null
}

const Mobile = ({ children }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 })
  return isMobile ? children : null
}


class App extends React.Component {	
  
  render(){
      return (
        <div>
            <Desktop>
                <BrowserRouter>
    	        <div className="App">
                  <header>
                    <Header/>
                  </header>
		        </div>
                    <Router/>
                </BrowserRouter>
            </Desktop>
            <Mobile>
                  <BrowserRouter>
                      <div className="App">
                          <header>
                              <Header />
                          </header>
                      </div>
                      <Router />
                  </BrowserRouter>
            </Mobile>
        </div>
      );
  }
}

const mapStateToProps = state => {
	return{
		user: state.user,
        userStatus: state.userStatus,
	}
}

export default connect(mapStateToProps, {
})(App);
