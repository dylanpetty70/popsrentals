import { combineReducers } from 'redux';

import userStatus from './userStatus';
import userNames from './userNames';
import module from './module';

export default combineReducers({
	userStatus,
	userNames,
	module
})