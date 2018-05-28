define([
		'jquery',
		'underscore',
		'rxvClass',
		'rxvGlobal'
	],
	function ($, _, RxvClass) {
		"use strict";
		
		var AppStore = RxvClass.Model.extend({
			// __myStore: null,
			
			init: function (intrant, core) {
				// this.__myStore = MyStore.populateStore(intrant);
			},
			
			getMyStore: function () {
				// return this.__myStore;
			}
		});
		
		/**
		 * @class
		 */
		return new AppStore();
	});