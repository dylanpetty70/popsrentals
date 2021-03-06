import {databaseRef} from '../firebaseAPI';
export const GRAB_NAMES = 'GRAB_NAMES';
export const HANDLE_USER_STATUS = 'HANDLE_USER_STATUS';

export const handleGrabNames = () => async dispatch => {

	databaseRef.child("usernames").on("value", snapshot => {
		dispatch({
			type: GRAB_NAMES,
			data: snapshot.val()
		})
	})
}

export const handleFirebaseCreateUser = (uid, name) => async dispatch => {
	databaseRef.child("usernames").update({[uid]: name});
	databaseRef.child("users/"+uid).update({name: name})
}

export function handleUserStatus(bool){
	return{
		type: HANDLE_USER_STATUS,
		bool
	}
}
