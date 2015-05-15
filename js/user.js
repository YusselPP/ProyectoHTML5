"use strict"
// User object.
var user;

function User(obj){

	if(!obj) obj = {};

	this.id = obj.id || 0;
	this.username = obj.username || null;
	this.password = obj.password || null;
	this.name = obj.name || null;
	this.last_name = obj.last_name || null;
	this.email = obj.email || null;
}

function register(){
	var username = document.getElementById('username').value;
	var password = document.getElementById('password').value;
	var password_confirm = document.getElementById('password_confirm').value;
	var name = document.getElementById('name').value;
	var last_name = document.getElementById('last_name').value;
	var email = document.getElementById('email').value;

	if(!username || !password || !name || !last_name || !email){
		alert('Es necesario llenar todos los campos.');
		return;
	}

	if(password != password_confirm){
		alert('La confirmación de contraseña no coincide.');
		return;
	}


	createUser(username, password, name, last_name, email, function(){

		alert('Usuario creado.');
		window.location = 'login.html';

	}, function(t, e){
		// Mensajes de error al acceder a la base de datos.
		if(e.code === e.CONSTRAINT_ERR){
			alert('Ya existe el usuario.');
		}
		else{
			alert(e.message);
		}
	});
}
