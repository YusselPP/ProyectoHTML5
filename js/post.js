"use strict"
var PREVIEW_BODY_LENGTH = 500;

function savePost(visibility){

	var title = document.getElementById('title').value;
	var post_content = document.getElementById('post_content').value;
	var tags = document.getElementById('tags').value;
	var image = document.getElementById('image').value;

	if(!title || !post_content){
		alert('Es necesario llenar los campos requeridos.');
		console.log(title+' '+post_content);
		return;
	}

	createPost(user.id, title, post_content, visibility, image, tags, function(){

		alert('Post publicado.');
		window.location = 'admin/index.html';

	}, function(t, e){
		// Mensajes de error al acceder a la base de datos.
		alert(e.message);
	});
}

function getLastPostsList(limit, offset){

	getVisiblePostsList(limit, offset, function(tx, result){

		var contentDiv = document.getElementById('content');
		//contentDiv.innerHTML='';
		var resultLength = result.rows.length;

		if(resultLength){
			
			for(var i=0; i<resultLength; i++){

				var post = result.rows.item(i);
				var body = '';

				if(post.body && post.body.length){
					if(post.body.length > PREVIEW_BODY_LENGTH){
						body = post.body.substring(0,PREVIEW_BODY_LENGTH);
					}
					else {
						body = post.body.substring(0,post.body.length);
					}
				}
				

				var htmlPost = createHTMLPost(post.id, post.title, body, post.image, post.date, post.author);

				contentDiv.insertBefore(htmlPost, contentDiv.firstChild);
			}
		}
		else{
			//contentDiv.innerHTML = 'No hay posts publicados.';
		}

	}, function(t, e){
		// Mensajes de error al acceder a la base de datos.
		alert(e.message);
	});
}

function createHTMLPost(id, title, body, image, date, username){

	var imageElement = '';
	
	if(image){
		imageElement = '<img src="'+image+'" alt="Post thumbnail" class="thumbnail" />';
	}

	var htmlPost = '<article class="post hentry">'+

		'<header class="entry-header">'+
			'<h1 class="entry-title">'+
				'<a href="post.html#'+id+'" title="Post Heading" rel="bookmark">'+title+'</a>'+
			'</h1>'+

			'<a href="post.html#'+id+'" title="Post Heading">'+imageElement+'</a>'+
		'</header> <!-- .entry-header -->'+

		'<div class="entry-content">'+
			'<p>'+body+'</p>'+

			'<p><a href="post.html#'+id+'" class="more-link">Continuar leyendo <span class="meta-nav">&rarr;</span></a></p>'+
		'</div> <!-- .entry-content -->'+

		'<footer class="entry-meta">'+
			'Publicado'+
			' el <time class="entry-date" datetime="2012-06-25" pubdate>'+date+'</time>'+
			' por <span class="author vcard"><a class="url fn n" href="#" title="Ver todos los posts por autor" rel="author">'+username+'</a></span>'+

			'<span class="edit-link"><a href="#" title="Edit entry">Editar &#9997;</a></span>'+
		'</footer>'+

	'</article> <!-- .post.hentry -->';

	var articleElement =  document.createElement('article');
	articleElement.className = 'post hentry';
	articleElement.innerHTML = htmlPost;

	return articleElement;
}

function getPost(){

	var urlHash = window.location.hash;

	if(!urlHash) {
		//Post no encontrado.
		document.getElementById('content').innerHTML = 'Post no encontrado';
		return;
	}

	var postID = urlHash.substring(1);

	getPostById(postID, function(tx, result){
		var resultLength = result.rows.length;

		if(resultLength){

			var post = result.rows.item(0);

			getPostComments(post.id, function(tx, result){
				var resultLength = result.rows.length;
				var comments = document.getElementById('post-comments');

				if(resultLength){
					for(var i=0; i<resultLength; i++){
						var comment = result.rows.item(i);
						var htmlComment = '<a href="#" class="user-link">'+comment.author+'</a>'+comment.content;
						var pElement = document.createElement('p');

						pElement.innerHTML = htmlComment;

						comments.appendChild(pElement);
					}
				}
				else {
					var pElement = document.createElement('p');

					pElement.id = 'no-comments';
					pElement.innerHTML = 'No hay comentarios.';
					comments.appendChild(pElement);
				}
			}, function(tx, e){
				alert(e.message);
			});

			document.getElementById('post-title').innerHTML = post.title;

			if(post.image){
				document.getElementById('post-image').innerHTML = '<img src="'+post.image+'" alt="Post thumbnail" class="thumbnail" />';
			}

			document.getElementById('post-content').innerHTML = post.body;
			document.getElementById('post-author').innerHTML = post.author;
			document.getElementById('post-date').innerHTML = post.date;

		}
		else {
			//Post no encontrado.
			document.getElementById('content').innerHTML = 'Post no encontrado';
		}
	}, function(tx, e){
		alert(e.message);
	});
}

function createComment(){
	var content = document.getElementById('comment').value;

	if(!content){
		alert('El campo de comentarios está vacio.');
		return;
	}

	var urlHash = window.location.hash;

	if(!urlHash) {
		console.error('Post no encontrado');
		return;
	}

	var postID = urlHash.substring(1);

	if(!user || !user.id){
		console.error('No hay un usuario autenticado.');
		return;
	}

	var htmlComment = '<a href="#" class="user-link">'+user.username+'</a>'+content;
	var pElement = document.createElement('p');

	pElement.innerHTML = htmlComment;

	var commentsDiv = document.getElementById('post-comments');
	commentsDiv.appendChild(pElement);

	var nocommentsDiv = document.getElementById('no-comments');
	if(nocommentsDiv){
		commentsDiv.removeChild(nocommentsDiv);
	}

	createPostComment(postID, content, user.id, function(tx, result){

	}, function(tx, e){
		var commentsDiv = document.getElementById('post-comments');

		commentsDiv.removeChild(commentsDiv.lastElementChild);
	});
}
