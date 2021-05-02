import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';
import Login from "./components/Login";
import Search from "./components/search";
import RedirectPage from "./components/404";
import {withRouter} from 'react-router-dom';
import {handleUserStatus} from './actions/user';
var firebase = require("firebase/app");
require('firebase/auth');


class Router extends Component {

	constructor(props){
		super(props);
        this.state = {status: false};
	}

	componentDidMount(){
        setTimeout(() => {if(!firebase.auth().currentUser){
            this.props.handleUserStatus(false);
        } else {
            //if(this.props.userNames.length < 1){
            //    this.props.handleGrabNames();  
		    //}
        }}, 2000)
	}


    render() {
      return (
        <div>
        {(this.props.userStatus) ? <>
            <Switch>
                <Route exact path="/"><Search/></Route>
                <Route exact path="/login" component={Login} /> 
                <Route path="*"> 
                    <RedirectPage/>
                </Route>
                </Switch>
                </>
                : 
                <> 
                <Switch>
                <Route exact path="/login" component={Login} /> 
                <Redirect from="*" to="/login" />
                </Switch>
                </>}
                
        </div>
      );
   }
}

const mapStateToProps = state => {
	return{
        userStatus: state.userStatus,
        userNames: state.userNames
	}
}

export default withRouter(connect(mapStateToProps, {handleUserStatus})(Router));
