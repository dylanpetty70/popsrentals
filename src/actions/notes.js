import { databaseRef } from '../firebaseAPI';
export const GRAB_CAMPAIGN_OPTIONS = 'GRAB_CAMPAIGN_OPTIONS';
export const GRAB_CAMPAIGN = 'GRAB_CAMPAIGN';
var firebase = require("firebase/app");
require('firebase/auth');

export const handleGrabCampaignOptions = () => async dispatch => {
	let temp = {};
	let userId = firebase.auth().currentUser.uid;
	await databaseRef.child("users/"+userId+"/campaigns").on('value', async snapshot => {
		if(snapshot.val()){
			for(let i = 0; i < Object.keys(snapshot.val()).length; i++){
				await databaseRef.child("campaigns/"+Object.keys(snapshot.val())[i]+"/name").on('value', function(snapshot1) {
					if(snapshot1.val()){
						temp[String(Object.keys(snapshot.val())[i])] = String(snapshot1.val());
					}
					if(i === Object.keys(snapshot.val()).length - 1){
						dispatch({
							type: GRAB_CAMPAIGN_OPTIONS,
							data: temp
						})
					}
				})
			}
		}
	})
}

export const handleGrabCampaign = (id) => async dispatch => {
	await databaseRef.child('campaigns/'+ id).on('value', snapshot => {
		if(snapshot.val()){
			dispatch({
				type: GRAB_CAMPAIGN,
				data: snapshot.val(),
				id
			})
		} else {
			dispatch({
				type: GRAB_CAMPAIGN,
				data: {},
				id: ''
			})
		}
	})
}

export const handleNewCampaign = (name, creator) => async dispatch => {
	let userId = firebase.auth().currentUser.uid;	
	var data = {creator: userId, notepads: [], shared: [], name: name}
	var newCampaignKey = databaseRef.child("campaigns").push().key;

	let campaignPath = "campaigns/"+String(newCampaignKey);
	
	databaseRef.update({["users/"+userId+ "/campaigns/"+String(newCampaignKey)]: true});
	databaseRef.update({[campaignPath]: data});
}

export const handleDeleteCampaign = (id) => async dispatch => {
	let userId = firebase.auth().currentUser.uid;
	databaseRef.child("campaigns/"+id+"/creator").once('value').then(function(snapshot){
		if(snapshot.val() === userId){
			databaseRef.child("campaigns/"+id).remove();
		}
		databaseRef.child("users/"+userId+"/campaigns/"+id).remove();
	})
}

export const handleShareCampaign = (id, user) => async dispatch => {
	databaseRef.child("campaigns/"+id+"/creator").once('value').then(function(snapshot){
		if(snapshot.val() !== user){
			databaseRef.child("users/"+user+"/campaigns").once('value').then(function(snapshot1){
				if(snapshot1.val()){
					if(!Object.values(snapshot1.val()).includes(id)){
						databaseRef.update({["users/"+user+ "/campaigns/"+id]: true})
						databaseRef.update({["campaigns/"+id+"/shared/"+user]: true})
					}
				} else{
					databaseRef.update({["users/"+user+ "/campaigns/"+id]: true})
					databaseRef.update({["campaigns/"+id+"/shared/"+user]: true})
				}
			})
		}
	})
}

export const handleNewNotepad = (campaign, name) => async dispatch => {
	var data = {subnotepad: [], name: name, campaign: campaign};
	var newNotepadKey = databaseRef.child("campaigns/"+campaign+"/notepads").push().key;

	let notepadPath = "campaigns/"+campaign+"/notepads/"+String(newNotepadKey);

	databaseRef.update({[notepadPath]: data});
}

export const handleDeleteNotepad = (campaign, notepad) => async dispatch => {
	databaseRef.child("campaigns/"+campaign+"/notepads/" + notepad).remove();
}

export const handleNewSubnotepad = (campaign, notepad, name) => async dispatch => {
	var data = {name: name, notes: [], campaign: campaign, notepad: notepad};
	var newSubnotepadKey = databaseRef.child("campaigns/"+campaign+"/notepads/"+notepad+"/subnotepads").push().key;

	let subnotepadPath = "campaigns/"+campaign+"/notepads/"+notepad+"/subnotepads/"+String(newSubnotepadKey);

	databaseRef.update({[subnotepadPath]: data});
}

export const handleDeleteSubnotepad = (campaign, notepad, subnotepad) => async dispatch => {
	databaseRef.child("campaigns/"+campaign+"/notepads/"+notepad+"/subnotepads/"+subnotepad).remove();
}

export const handleNewNote = (campaign, notepad, subnotepad, object) => async dispatch => {
	var data = {object: object, pLeft: '200', pTop: '200', height: '20', width: '20', title: '', body: '', campaign: campaign, notepad: notepad, subnotepad: subnotepad};
	var newNoteKey = databaseRef.child("campaigns/"+campaign+"/notepads/"+notepad+"/subnotepads/"+subnotepad+"/notes").push().key;

	let notePath = "campaigns/"+campaign+"/notepads/"+notepad+"/subnotepads/"+subnotepad+"/notes/"+String(newNoteKey);

	databaseRef.update({[notePath]: data});
}

export const handleDeleteNote = (campaign, notepad, subnotepad, note) => async dispatch => {
	databaseRef.child("campaigns/"+campaign+"/notepads/"+notepad+"/subnotepads/"+subnotepad+"/notes/"+note).remove();
}


export const handleUpdateNote = (campaign, notepad, subnotepad, note, data) => async dispatch => {
	databaseRef.child("campaigns/"+campaign+"/notepads/"+notepad+"/subnotepads/"+subnotepad+"/notes/"+note).set(data);
}
