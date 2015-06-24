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
        //tx.executeSql('DROP TABLE IF EXISTS posts');
        tx.executeSql('CREATE TABLE IF NOT EXISTS '+TABLE_POSTS+' ('+
            'id INTEGER PRIMARY KEY AUTOINCREMENT,'+
            'user_id INTEGER NOT NULL,'+
            'date DATETIME NOT NULL DEFAULT (datetime(\'now\',\'localtime\')),'+
            'title VARCHAR(100) NOT NULL,'+
            'body VARCHAR(5000) NOT NULL,'+
            'visibility VARCHAR(30) NOT NULL DEFAULT (\'public\'),'+
            'image VARCHAR(100),'+
            'audio VARCHAR(100),'+
            'video VARCHAR(100),'+
            'tags VARCHAR(30))'
        );
        tx.executeSql('CREATE TABLE IF NOT EXISTS '+TABLE_COMMENTS+' ('+
            'post_id INTEGER NOT NULL,'+
            'user_id INTEGER NOT NULL,'+
            'date DATETIME NOT NULL DEFAULT (datetime(\'now\',\'localtime\')),'+
            'content VARCHAR(500) NOT NULL)'
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

// Crea un nuevo post en la base de datos.
function createPost(user_id, title, body, visibility, image, tags, audio, video, callback, errorCallback){
    db.transaction(function (tx) {
        tx.executeSql("INSERT INTO "+TABLE_POSTS+" (user_id, title, body, visibility, image, audio, video, tags) VALUES (?,?,?,?,?,?,?,?)", [user_id, title, body, visibility, image, audio, video, tags], callback, errorCallback);
    });     
}

// Obtiene la lista de posts visibles de la base de datos ordenados por fecha.
function getVisiblePostsList(limit, offset,callback, errorCallback){
    db.readTransaction(function (tx) {
        tx.executeSql("SELECT posts.id,date,title,body,image,tags,username author FROM "+TABLE_POSTS+" posts JOIN "+TABLE_USERS+" users ON user_id = users.id WHERE visibility = 'public' ORDER BY date DESC LIMIT ? OFFSET ?", [limit, offset], callback, errorCallback);
    });
}

function getPostById(postID,callback, errorCallback){
    db.readTransaction(function (tx) {
        tx.executeSql("SELECT posts.id,date,title,body,image,audio,video,tags,username author FROM "+TABLE_POSTS+" posts JOIN "+TABLE_USERS+" users ON user_id = users.id WHERE posts.id = ?", [postID], callback, errorCallback);
    });
}

function getPostComments(postID,callback, errorCallback){
    db.readTransaction(function (tx) {
        tx.executeSql("SELECT date,content,username author FROM "+TABLE_COMMENTS+" comments JOIN "+TABLE_USERS+" users ON user_id = users.id WHERE post_id = ? ORDER BY date", [postID], callback, errorCallback);
    });
}

// Crea un nuevo comentario sobre un post en la base de datos.
function createPostComment(postID, content, userID, callback, errorCallback){
    db.transaction(function (tx) {
        tx.executeSql("INSERT INTO "+TABLE_COMMENTS+" (post_id, user_id, content) VALUES (?,?,?)", [postID, userID, content], callback, errorCallback);
    });
}