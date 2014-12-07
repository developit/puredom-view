define(['puredom'], function($) {

	/**	A generic view class.
	 *	@class
	 *	@augments puredom.EventEmitter
	 *	@param {Object} options
	 *	@param {String} options.name		A name for the view
	 *	@param {String} options.template	HTML template to render
	 *	@param {HTMLElement} options.parent		An Element (or puredom.NodeSelection) into which the view should be rendered
	 *	@param {puredom.ViewManager} options.viewManager		A ViewManager instance into which Views should be registered
	 *	@param {Object} [data={}]			Initial data for the view
	 */
	function View(options) {
		if (!(this instanceof View) || this===View) {
			return new View(options);
		}

		$.EventEmitter.call(this);

		this.data = {};
		this.events = {};
		for (var i in options) {
			if (options.hasOwnProperty(i) && i!=='load' && i!=='unload') {
				this[i] = options[i];
			}
		}

		// remap load/unload
		if (options.load) {
			this.userload = options.load;
		}
		if (options.unload) {
			this.userunload = options.unload;
		}
	}

	$.inherits(View, $.EventEmitter);

	$.extend(View.prototype, /** @lends View# */ {

		data : {},

		events : {},

		load : function(options) {
			var self = this,
				vm = options.viewManager || options.views;
			this.params = options.params || {};

			if (vm) {
				this.viewManager = vm;
			}
			if (options.parent) {
				this.parent = options.parent;
			}

			this._invoke('beforeload', options);

			if (!this.base) {
				this.base = $({
					className : 'view view-'+this.name
				}).attr('data-view', this.name);

				this.viewManager.addView(this.name, this.template);

				this._wireEvents(this.events);
			}

			this.populate(this.data);
			this.base.insertInto(this.parent);

			this._invoke('userload', options);
			this._invoke('afterload', options);
			this._invoke('fetch', options.params, function() {
				self._invoke.apply(self, ['afterfetch'].concat($.toArray(arguments)));
			});
		},

		unload : function() {
			this._invoke('beforeunload');
			this._invoke('userunload');
			this._invoke('kill');
			if (this.base) {
				this.base.remove();
			}
			this._invoke('afterunload');
		},

		populate : function(data) {
			this.data = data;
			if (this.ui) {
				this.ui.destroy();
			}
			this.ui = this.viewManager.template(this.name, this.data, this.base);
		},

		_wireEvents : function(events) {
			var self = this;
			$.forEach(events, function(handler, key) {
				var fn = handler;
				key = key.split(' ');
				if (typeof handler==='string') {
					fn = function(e) {
						return self[handler](e, this);
					};
				}
				self.base.on(key[0], key.slice(1).join(' '), fn);
			});
		},

		/** Invoke the given method with arguments if it is defined.
		 *	@param {String} method		The method name
		 *	@param {Any} [args ..]		Arguments to pass to the method
		 *	@private
		 */
		_invoke : function(method, args) {
			var func = this[method];
			if (typeof func==='function') {
				return func.apply(this, args);
			}
		}

	});

	View.View = View.create = View.view = View;

	return View;
});
