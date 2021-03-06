import {databaseRef} from '../firebaseAPI';
import api from '../APIFactory';
export const GRAB_MODULE_ENV = 'GRAB_MODULE_ENV';
export const GRAB_MODULE_OPTIONS = 'GRAB_MODULE_OPTIONS';
export const GRAB_MODULE_ENV_OPTIONS = 'GRAB_MODULE_ENV_OPTIONS';
export const GRAB_MODULE_PLAYERS = 'GRAB_MODULE_PLAYERS';
export const SET_MODULE = 'SET_MODULE';
export const GRAB_MAPS = 'GRAB_MAPS';
export const GRAB_MAP_CURRENT = 'GRAB_MAP_CURRENT';
export const GRAB_MODULE_CHAT = 'GRAB_MODULE_CHAT';
export const GRAB_CALL_URL = 'GRAB_CALL_URL';
var firebase = require("firebase/app");
require('firebase/auth');


export const handleGrabModuleEnv = (module, id) => async dispatch => {
	await databaseRef.child('modules/' + module + '/environments/'+ id).on('value', snapshot => {
		if(snapshot.val()){
			dispatch({
				type: GRAB_MODULE_ENV,
				data: snapshot.val(),
				id
			})
		} else {
			dispatch({
				type: GRAB_MODULE_ENV,
				data: {},
				id: ''
			})
		}
	})
}

export const handleGrabModuleOptions = () => async dispatch => {
	let temp = {};
	let userId = firebase.auth().currentUser.uid;
	await databaseRef.child("users/"+userId+"/modules").on('value', async snapshot => {
		if(snapshot.val()){
			for(let i = 0; i < Object.keys(snapshot.val()).length; i++){
				await databaseRef.child("modules/"+Object.keys(snapshot.val())[i]+"/name").on('value', function(snapshot1) {
					if(snapshot1.val()){
						temp[String(Object.keys(snapshot.val())[i])] = String(snapshot1.val());
					}
					if(i === Object.keys(snapshot.val()).length - 1){
						dispatch({
							type: GRAB_MODULE_OPTIONS,
							data: temp
						})
					}
				})
			}
		}
	})
}

export const handleGrabModuleEnvOptions = (module) => async dispatch => {
	let temp = {};
	await databaseRef.child("modules/" + module + "/environments").on('value', async snapshot => {
		if(snapshot.val()){
			for(let i = 0; i < Object.keys(snapshot.val()).length; i++){
				await databaseRef.child("modules/" + module + "/environments/"+Object.keys(snapshot.val())[i]+"/name").on('value', function(snapshot1) {
					if(snapshot1.val()){
						temp[String(Object.keys(snapshot.val())[i])] = String(snapshot1.val());
					}
					if(i === Object.keys(snapshot.val()).length - 1){
						dispatch({
							type: GRAB_MODULE_ENV_OPTIONS,
							data: temp
						})
					}
				})
			}
		}
	})
}

export const handlePlayerGrabModuleEnv = (module) => async dispatch => {
	await databaseRef.child('modules/' + module + '/currentEnv').on('value', async snapshot => {
		await databaseRef.child('modules/' + module + '/environments/'+ snapshot.val()).on('value', async snapshot1 => {
			await databaseRef.child('modules/' + module + '/currentEnv').once('value', snapshot2 => {
				if(snapshot.val() === snapshot2.val()){
					if(snapshot1.val()){
					dispatch({
						type: GRAB_MODULE_ENV,
						data: snapshot1.val(),
						id: snapshot.val()
					})
					} else {
						dispatch({
							type: GRAB_MODULE_ENV,
							data: {},
							id: ''
						})
					}
				}
			})
		})
	})
}

export const handleModuleAddNewItem = (module, id, item) => async dispatch => {
	databaseRef.child("modules/" + module + "/environments/"+id+"/items").push(item);
}

export const handleModuleDeleteItem = (module, id, item) => async dispatch => {
	databaseRef.child("modules/" + module + "/environments/"+id+"/items/"+item).remove();
}

export const handleModuleUpdateItem = (module, id, item, data) => async dispatch => {
	databaseRef.child("modules/" + module + "/environments/"+id+"/items").update({[item]: data});
}

export const handleUpdateModuleCurrent = (module, id, data) => async dispatch => {
	databaseRef.child("modules/" + module + "/environments/"+id+"/items").set(data);
}

export const handleUpdateModuleOther = (module, id, data) => async dispatch => {
	await databaseRef.child("modules/" + module + "/environments/" + id + "/items").once('value', async snapshot => {
		if(snapshot.val()){
			let temp = snapshot.val();
			temp.push(...data);
			databaseRef.child("modules/" + module + "/environments/"+id+"/items").set(temp);
		} else {
			databaseRef.child("modules/" + module + "/environments/"+id+"/items").set(data);
		}
	})
}

export const handleGrabModuleChat = (module) => async dispatch => {
	await databaseRef.child('modules/' + module + '/chat').on('value', async snapshot => {
		if(snapshot.val()){
		dispatch({
			type: GRAB_MODULE_CHAT,
			data: snapshot.val()
		})
		} else {
			dispatch({
				type: GRAB_MODULE_CHAT,
				data: {}
			})
		}
	})
}

export const handleNewMessage = (id, text) => async dispatch => {
	let userId = firebase.auth().currentUser.uid;	
	let date = Date.now()

	var data = {creator: userId, time: date, text: text}
	var newTextKey = databaseRef.child("modules/" + id + "/chat").push().key;

	let textPath = "modules/" + id + "/chat/" + String(newTextKey);

	databaseRef.update({[textPath]: data});
}

export const handleDeleteMessage = (mod, id) => async dispatch => {
	databaseRef.child("modules/"+mod+"/chat/"+id).remove();
}

export const handleNewCallURL = (module) => async dispatch => {
	let result = await api.post('https://api.daily.co/v1/rooms',{}, {
		headers: {
			"authorization": "Bearer d9bea36199efcbc41a426ffbe3d608bda460e79ed707ca464db6cc41589e3805",
			"content-type": "application/json",
		}}
	)
	databaseRef.child("modules/" + module + "/callURL").set(result.data.url);
}

export const handleDeleteCallURL = (module, name) => async dispatch => {
	await api.delete('https://api.daily.co/v1/rooms/'+ name.replace('https://dndonestop.daily.co/',''),{
		headers: {
			'authorization': 'Bearer d9bea36199efcbc41a426ffbe3d608bda460e79ed707ca464db6cc41589e3805'
		}}
	)
	databaseRef.child("modules/" + module + "/callURL").set('');
}

export const handleGrabCallURL = (module) => async dispatch => {
	await databaseRef.child('modules/' + module + '/callURL').on('value', async snapshot => {
		if(snapshot.val()){
		dispatch({
			type: GRAB_CALL_URL,
			data: snapshot.val()
		})
		} else {
			dispatch({
				type: GRAB_CALL_URL,
				data: ''
			})
		}
	})
}

export const handleGrabMaps = (module) => async dispatch => {
	await databaseRef.child('modules/' + module + '/maps').on('value', snapshot => {
		if(snapshot.val()){
			dispatch({
				type: GRAB_MAPS,
				data: snapshot.val()
			})
		} else {
			dispatch({
				type: GRAB_MAPS,
				data: {}
			})
		}
	})
}

export const handleGrabMapCurrent = (module) => async dispatch => {
	await databaseRef.child('modules/' + module + '/currentMap').on('value', snapshot => {
		if(snapshot.val()){
			dispatch({
				type: GRAB_MAP_CURRENT,
				data: snapshot.val()
			})
		} else {
			dispatch({
				type: GRAB_MAP_CURRENT,
				data: ''
			})
		}
	})
}

export const handleUpdateMaps = (module, map, data) => async dispatch => {
	databaseRef.child("modules/" + module + "/maps/" + map).set(data);
}

export const handleNewMap = (module, name) => async dispatch => {
	var data = {name: name, scale: 30}
	var newMapsKey = databaseRef.child("modules/" + module + "/maps").push().key;

	let mapPath = "modules/" + module + "/maps/"+String(newMapsKey);
	
	databaseRef.update({[mapPath]: data});
}

export const handleSetCurrentModuleEnv = (module, id) => async dispatch => {
	databaseRef.child("modules/" + module).update({currentEnv: id});
}

export const handleSetCurrentModuleMap = (module, id) => async dispatch => {
	databaseRef.child("modules/" + module).update({currentMap: id});
}

export const handleChangeMapScale = (module, map, scale) => async dispatch => {
	databaseRef.child("modules/" + module + "/maps/" + map).update({scale: scale});
}

export const handleNewModuleEnvironment = (module, name) => async dispatch => {
	let userId = firebase.auth().currentUser.uid;	
	var data = {creator: userId, items: [], name: name, scale: '30'}
	var newEnvironmentKey = databaseRef.child("modules/" + module + "/environments").push().key;

	let environmentPath = "modules/" + module + "/environments/"+String(newEnvironmentKey);
	
	databaseRef.update({[environmentPath]: data});
}

export const handleNewModule = (name) => async dispatch => {
	let userId = firebase.auth().currentUser.uid;	
	var data = {creator: userId, items: [], name: name}
	var newModuleKey = databaseRef.child("modules").push().key;

	let modulePath = "modules/"+String(newModuleKey);
	
	databaseRef.update({["users/"+userId+ "/modules/"+String(newModuleKey)]: true});
	databaseRef.update({[modulePath]: data});
}

export const handleChangeModuleEnvScale = (module, id, scale) => async dispatch => {
	databaseRef.child("modules/" + module + "/environments/"+id+"/scale").set(scale);
}

export const handleDeleteModuleEnvironment = (module, id) => async dispatch => {
	databaseRef.child("modules/" + module + "/environments/"+id).remove();
}

export const handleDeleteModule = (module) => async dispatch => {
	let userId = firebase.auth().currentUser.uid;
	databaseRef.child("modules/"+module+"/creator").once('value').then(function(snapshot){
		if(snapshot.val() === userId){
			databaseRef.child("modules/"+module).remove();
		}
		databaseRef.child("users/"+userId+"/modules/"+module).remove();
	})
}

export const handleGrabModulePlayers = () => async dispatch => {
	databaseRef.child("modules/" + module + "/players").once('value').then(function(snapshot){
		dispatch({
			type: GRAB_MODULE_PLAYERS,
			data: snapshot.val()
		})
	})
}

export const handleSetModule = (module) => dispatch => {
	dispatch({
		type: SET_MODULE,
		id: module
	})
}