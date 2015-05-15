"use strict"
// Nombre de tablas.
var TABLE_USERS = 'users';
var TABLE_POSTS = 'posts';
var TABLE_COMMENTS = 'comments';

// Inicializa la base de datos.
var db = openDatabase('blog', '1.0', 'Blog DB', 2 * 1024 * 1024);

// Se crean las tablas en la base de datos si no existen.
(function createTables(){

    db.transaction(function (tx) {
    	//tx.executeSql('DROP TABLE IF EXISTS users');
    	tx.executeSql('CREATE TABLE IF NOT EXISTS '+TABLE_USERS+' ('+
			'id INTEGER PRIMARY KEY AUTOINCREMENT,'+
			'username VARCHAR(30) NOT NULL UNIQUE,'+
			'password VARCHAR(30) NOT NULL,'+
            'name VARCHAR(30) NOT NULL,'+
            'last_name VARCHAR(30) NOT NULL,'+
            'email VARCHAR(60) NOT NULL)'
		);
    });             
})();

// Obtiene un usuario de la base de datos.
function getUser(username, callback, errorCallback){
    db.readTransaction(function (tx) {
        tx.executeSql("SELECT * FROM "+TABLE_USERS+" WHERE username=?", [username], callback, errorCallback);
    });     
}

// Crea un nuevo usuario en la base de datos.
function createUser(username, password, name, last_name, email, callback, errorCallback){
    db.transaction(function (tx) {
        tx.executeSql("INSERT INTO "+TABLE_USERS+" (username, password, name, last_name, email) VALUES (?,?,?,?,?)", [username,password,name,last_name,email], callback, errorCallback);
    });     
}
