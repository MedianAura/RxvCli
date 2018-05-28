define(['jquery', 'underscore', 'rxvClass', 'rxvGlobal'],
	function ($, _, RxvClass) {
		"use strict";
		
		return RxvClass.View.extend({
			
			"tagName": "div",

			core: null,

			events: {},
			
			initialize: function (options) {
				this.core = getProp(options, "core", null);
			},
			render: function () {
				var deferred = $.Deferred();
				this.__render(deferred);
				return deferred.promise();
			},
            __render: function (deferred) {
                var self = this;

                self.core.getTemplateLoader()
                    .getTemplate(["<%= template %>.html:perspective"])
                    .then(function (fTmplBlock) {
                        self.$el.html(fTmplBlock({}));
                        deferred.resolve(self);
                    });
            },
			
			// PUBLIC
			
			// PRIVATE
			
			// EVENTS
		});
	});