// copyright &copy 2016 Jaanga authors. MIT license.

	var user = 'jaanga';
	var tagLine ='your 3D happy place';
	var logo = '&#x2766';

/*
	var repo = 'jaanga.github.io';
	var branch = 'master';
//	var folder = 'cookbook-threejs/examples/';
	var folder = 'cookbook-html/examples/github-api-rss/';
*/

	var repo = 'terrain3';
	var branch = 'gh-pages';
	var folder = '';

	var urlGitHubTree = 'https://api.github.com/repos/' + user + '/' + repo + '/git/trees/' + branch + '?recursive=1';
	var urlGHPages = 'https://' + user + '.github.io/' + repo + '/';
	var urlSource = 'https://github.com/' + user + '/' + repo + '/tree/' + branch + '/';

	var filesAll, filesSelected;

	var b = '<br>';
	var converter = new showdown.Converter( { strikethrough: true, literalMidWordUnderscores: true, simplifiedAutoLink: true, tables: true });

	init();

	function init() {

		var css, menu;

		css = document.body.appendChild( document.createElement( 'style' ) );
		css.innerHTML =

			'html, body { font: 12pt monospace; height: 100%; margin: 0; }' +

			'a { text-decoration: none; }' +

			'button, input[type=button] { background-color: #eee; border: 2px #eee solid; color: #888; }' +

			'h2 a { color: crimson; }' +
//			'iframe { border: 1px solid red; height: 100%; overflow: hidden; width: 100%; }' +

			'summary h2, summary h3, #menuBreadCrumbs h3 { display: inline; }' +
			'summary { outline: none; }' +

			'#menu { box-sizing: border-box; background-color: #ccc; height: 100%; padding: 0 0 0 10px; overflow: auto; position: absolute; width: 300px; }' +
//			'#contents { border: 0px red solid; height: 100%; left: 350px; overflow: hidden; position: absolute; top: 0; width: ' + ( window.innerWidth - 370 ) + 'px; }' +
			'#contents { border: 0px red solid; left: 350px; position: absolute; top: 0; max-width: 800px; }' +

		'';

		menu = document.body.appendChild( document.createElement( 'div' ) );
		menu.id = 'menu';
		menu.innerHTML =

			'<div id=menuBreadCrumbs ></div>' +

			'<div id=menuFolderIndices ></div>' +

			'<div id=menuTestHash ></div>' +

			'<div id=menuDetailsPageActions ></div>' +

			'<div id=menuDetailsAbout ></div>' +

			'<hr>' +

			'<center>' +
				'<a href=javascript:window.scrollTo(0,0); style=text-decoration:none; title="' + user + ' - ' + tagLine + '" >' +
				'<h1>' + logo + '<h1>' +
			'</a></center>' +

		'';

		contents = document.body.appendChild( document.createElement( 'div' ) );
		contents.id = 'contents';

		window.addEventListener ( 'hashchange', onHashChange, false );

		setMenuDetailsPageActions();

		setMenuDetailsAbout();

		getGitHubAPITreeContents( folder );

	}


	function setMenuDetailsPageActions() {

		menuDetailsPageActions.innerHTML =

			'<hr>' +

			'<details open>' +

				'<summary><h3>page actions</h3></summary>' +

				'<p><a href=JavaScript:location.href=urlSource+location.hash.slice(1); >View source on GitHub</a></p>' +
				'<p><a href=JavaScript:window.open(urlGHPages+location.hash.slice(1),"_blank"); >Open page in new tab</a></p>' +
//				'<p><s><input type=checkbox > View all files in folder</s></p>' +

				'<p id=menuActionMessages ></p>' +

			'</details>' +

		'';

	}

	function setMenuDetailsAbout() {

		menuDetailsAbout.innerHTML =

			'<details>' +

				'<summary><h3>about</h3></summary>' +

				'<p>This menu/<a href=https://en.wikipedia.org/wiki/Content_management_system >cms</a> is created on-the-fly by:' + b + b +
					'<a href=http://jaanga.github.io/cookbook-html/examples/github-api-rss/github-api-files-in-folder/#readme.md >GitHub API Files-in-Folders</a></p>' +
				'<p>Copyright &copy; 2016 ' + user + ' authors. <a href=https://' + user + '.github.io/license.md >MIT license</a>.</p>' +

			'</details>' +

		'';

	}


	function getGitHubAPITreeContents() {

		var xhr;
		var response;

		xhr = new XMLHttpRequest();
		xhr.crossOrigin = 'anonymous';
		xhr.open( 'GET', urlGitHubTree, true );
		xhr.onload = callback;
		xhr.send( null );

		function callback() {

			response = JSON.parse( xhr.response );

			filesAll = response.tree.map( function( item ) { return item.path; } );

			onHashChange();

		}

	}


	function getFilesFromFolder( dir ) {

		var file, fileArray;

		filesSelected = [];

		for ( var i = 0; i < filesAll.length; i++ ) {

			file = filesAll[ i ];
			fileArray = file.split( '/' );

			if ( dir === '' ) {

				if ( fileArray.length > 2 ) { continue; }

			} else {

				if ( !file.startsWith( dir ) ) { continue; }
				if ( file.match( 'archive' ) ) { continue; }

			}

			if ( fileArray.pop() !== 'readme.md' ) { continue; }

			filesSelected.push( file );

		}

		createFolderNameTableOfContents( dir );

		menuActionMessages.innerHTML = 'Files in repo: ' + filesAll.length;

	}


	function createFolderNameTableOfContents( dir ) {

		var toc, file, fName, ffolder,

		toc = '<hr>' + '<p>subFolders:</p>';

		for ( var i = 0; i < filesSelected.length; i++ ) {

			file = filesSelected[ i ];

			if ( dir && dir.slice( -1 ) !== '/' ) { dir += '/'; }

			if ( file === dir + 'readme.md' ) {

				getMarkdown( urlGHPages + file, contents );

			} else {

				ffolder = file.split( '/' );
				ffolder.pop();
				fName = ffolder.slice( - 1 )[0].replace( /-/g, ' ' );

				toc += '<h3>&#x1f4c1; <a href=#' + ffolder.join( '/' ) + ' > ' + fName + '</a></h3>';

			}

		}

		menuFolderIndices.innerHTML = toc;

		setBreadCrumbs( dir );

	}


	function setBreadCrumbs( dir ) {

		var breadCrumbs, dirArray;

		dirArray = dir.split( '/' );

		breadCrumbs =

		'<h2>' +

			'<a href=http://' + user + '.github.io title="' + user + ' - ' + tagLine + '" >' + logo + ' ' + user + '</a>&raquo; ' +

			'<a href=# >' + repo + '</a>&raquo; </h2>' +

		'';

		for ( var i = 0; i < dirArray.length - 1; i++ ) {

			dirString = dirArray.slice( 0, i + 1 ).join( '/' );

			breadCrumbs += '<h3><a href=#' + dirString + ' >' + dirArray[ i ].replace( /-/g, ' ' ) + '</a>&raquo </h3>';

		}

		breadCrumbs += '<h4><a href=#' + dir + ' >' + dirArray[ i ].replace( /-/g, ' ' ) + '</a></h4>';

		menuBreadCrumbs.innerHTML = breadCrumbs;

	}


	function onHashChange() {

		var item;

		item = location.hash ? location.hash.slice( 1 ) : folder;

		if ( item.endsWith( '.md' ) === true ) {

			getMarkdown( item, contents );

			setBreadCrumbs( folder )

		} else {

			setBreadCrumbs( item );

			getFilesFromFolder( item );

		}

	}


// combine with getGitHubAPITreeContents

	function getMarkdown( fName, target ) {

		var xhr;

		xhr = new XMLHttpRequest();
		xhr.crossOrigin = 'anonymous';
		xhr.open( 'GET', fName, true );
		xhr.onload = function() {

			target.innerHTML = converter.makeHtml( xhr.responseText );
			target.style.overflow = 'auto';

		};

		xhr.send( null );

	}