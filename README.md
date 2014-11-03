puredom-view [![NPM Version](https://img.shields.io/npm/v/puredom-view.svg?style=flat)](https://www.npmjs.org/package/puredom-view) [![Bower Version](https://img.shields.io/bower/v/puredom-view.svg?style=flat)](http://bower.io/search/?q=puredom-view)
============

A simple view-presenter base class/mixin for puredom.

Acts as a glue between [puredom](http://puredom.org)'s [RouteManager](http://puredom.org/docs/symbols/puredom.RouteManager.html) and [ViewManager](http://puredom.org/docs/symbols/puredom.RouteManager.html).


---


Instantiation
-------------

**Using AMD:**  

```JavaScript
define(['puredom-view'], function(view) {
	return view({
		template : 'Hello, world!'
	});
});
```

**Without AMD:**  

```HTML
<script src="puredom-rest.js"></script>
<script>
	var routes = new puredom.RouteManager();

	var route = view({
		url : '/hello',
		template : 'Hello.'
	});

	routes.register('hello', route);
</script>
```


---


Usage
-----


```JavaScript
define(['puredom-view'], function(view) {

	// the caller just registers this as a route/controller
	return view({

		// for the router:
		name : 'about',
		title : 'About',
		customUrl : '/about',

		// View template, usually obtained via a text dependency:
		template : '{{#terms}}<a class="term" href="{{url}}">{{name}}</a>{{/terms}}',

		// Event delegation mappings
		events : {
			'click a.term' : 'openThing'
		},

		// Delegated handler, called in response to clicks on <a class="term">
		openThing : function(e) {
			window.open( e.target.href );
			return e.cancel();
		},

		// Some default data to populate with. Real data can be passed to .populate()
		data : {
			terms : [
				{ name:'Dinosaur', url:'http://wikipedia.org/wiki/Dinosaur' },
				{ name:'Koala', url:'http://wikipedia.org/wiki/Koala' },
				{ name:'Thu`um', url:'http://wikipedia.org/wiki/Skyrim' }
			]
		}

	});

});
```
