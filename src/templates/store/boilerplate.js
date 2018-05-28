define(['jquery', 'underscore', 'rxvClass', 'myModel'],
	function ($, _, RxvClass, Alerte) {
		"use strict";
		
		var MyStore = RxvClass.Model.extend({
			
			__store: null,
			
			initialize: function () {
				this.reset();
			},
			reset: function () {
				this.__store = [];
			},
			populateStore: function (intrant) {
				this.reset();
				
				// LOAD DATA
				
				return this;
			},
			
			// GETTER
			getData: function () {
				return this.__store;
			},
			
			// PRIVATE
		});
		
		/**
		 * @class
		 */
		return new MyStore();
	});