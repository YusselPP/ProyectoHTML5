"use strict"

var storage = {};

Object.defineProperty(storage, 'TYPE_SESSION', {value:1});
Object.defineProperty(storage, 'TYPE_LOCAL', {value:2});


storage.type = storage.TYPE_SESSION;


storage.setStorageType = function (type) {
	if(type === storage.TYPE_SESSION || type === storage.TYPE_LOCAL){
		storage.type = type;
	}
	else {
		console.error(storage.msgInvalidType);
	}
}

storage.save = function (key, value, type) {

	if(type){

		if(type === storage.TYPE_SESSION){
			window.sessionStorage.setItem(key, JSON.stringify(value));
		}
		else if(type === storage.TYPE_LOCAL){
			window.localStorage.setItem(key, JSON.stringify(value));
		}
		else {
			console.error(storage.msgInvalidType);
		}
	} else {
		if(storage.type === storage.TYPE_SESSION){
			window.sessionStorage.setItem(key, JSON.stringify(value));
		}
		else if(storage.type === storage.TYPE_LOCAL){
			window.localStorage.setItem(key, JSON.stringify(value));
		}
		else {
			console.error(storage.msgInvalidType);
		}
	}
}

storage.delete = function (key, type) {

	if(type){

		if(type === storage.TYPE_SESSION){
			window.sessionStorage.removeItem(key);
		}
		else if(type === storage.TYPE_LOCAL){
			window.localStorage.removeItem(key);
		}
		else {
			console.error(storage.msgInvalidType);
		}
	} else {

		if(storage.type === storage.TYPE_SESSION){
			window.sessionStorage.removeItem(key);
		}
		else if(storage.type === storage.TYPE_LOCAL){
			window.localStorage.removeItem(key);
		}
		else {
			console.error(storage.msgInvalidType);
		}
	}
}

storage.get = function (key, type) {

	var value = null;

	if(type){

		if(type === storage.TYPE_SESSION){
			value = JSON.parse(window.sessionStorage.getItem(key));
		}
		else if(type === storage.TYPE_LOCAL){
			value = JSON.parse(window.localStorage.getItem(key));
		}
		else {
			console.error(storage.msgInvalidType);
		}
	} else {
		
		if(storage.type === storage.TYPE_SESSION){
			value = JSON.parse(window.sessionStorage.getItem(key));
		}
		else if(storage.type === storage.TYPE_LOCAL){
			value = JSON.parse(window.localStorage.getItem(key));
		}
		else {
			console.error(storage.msgInvalidType);
		}
	}

	return value;
}

storage.msgInvalidType = 'Storage: Invalid storage type. Valid values: \'storage.TYPE_SESSION\' or \'storage.TYPE_LOCAL\'.';