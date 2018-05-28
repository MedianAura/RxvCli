define(['jquery', 'underscore', 'rxvClass'],
	function ($, _, RxvClass) {
		"use strict";
		
		return RxvClass.View.extend({
			"el": "#groups-container",
			
			parent: null,
			
			events: {},
			
			initialize: function (options) {
				this.parent = getProp(options, "parent", null);
			},
			render: function () {
				var self = this;
				
				var aContent = [];
				_.each(this.aCardGroups, function (oItem) {
					aContent.push(oItem.renderPromise());
				});

				$.when.apply($, aContent).then(function () {
					for (var i = 0; i < arguments.length; i++) {
						var oChildContent = arguments[i];
						self.$el.append(oChildContent.$el);
					}
					
					self.parent.getRxvI18n().applyTraduction(self.$el);
					self.parent.positionFooter();
				});
			},
			init: function (intrant) {
				this.reset();
			},
			reset: function () {
				this.$el.empty();
				this.aCardGroups = [];
			},
			
			// PUBLIC
			
			// PRIVATE
			
			// EVENTS
		});
	});