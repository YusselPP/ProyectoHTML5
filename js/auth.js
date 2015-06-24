"use strict"

var auth = {};

// Valida que el usuario y la contraseña sean correctos.
auth.validateCredentials = function () {

	var username = document.getElementById('username').value;
	var password = document.getElementById('password').value;

	getUser(username, function(tx, result){
		
		if(result.rows.length){
			user = new User(result.rows.item(0));

			if(user.password !== password){
				alert('La contraseña es incorrecta.');
			}
			else{
				auth.login(user);
			}
		}
		else{
			alert('El usuario no existe.');
		}
	}, function(tx, e){
		// Mensaje de error al acceder a la base de datos.
		alert(e.message);
	});
};

// Crea la sesión del usuario
auth.login = function(user){
	storage.save('user', user);
	window.location = 'index.html';
};

// Cierra la sesión del usuario
auth.logout = function(){
	storage.delete('user');
	window.location = 'login.html';
};

// Si no se tiene una sesión activa redirige al login.
auth.verifySession = function(){

	user = storage.get('user');

	if(!user){
		window.location = 'login.html';
	}
};

auth.getSession = function(){
	user = storage.get('user');
};