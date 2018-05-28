define(['jquery', 'underscore', 'rxvApp', 'AppStore', 'labels'],
	function ($, underscore, RxvApp, AppStore) {
		"use strict";
		
		var CoreController = RxvApp.extend({
			el: "body",
			events: {},
			
			init: function () {
				this.getTemplateLoader().addNamespace("<%= namespace %>", "<%= namespacePath %>");
				this.getRxvI18n().addDictionnaire(oLabels);
				this.getRxvI18n().applyTraduction($('html'));
				this.setTitle("app-name", "app-sub-title");
				
				if (!this.hasValidIntrant || !this.hasValidBrowser) return;
				
				var self = this;
				//this.hasDebugPanel().then(function () {
					self.setRouting();
				//});
			},
			
			// OVERIDE
			
			// PUBLIC
			setRouting: function () {
				this.setIntrant();
			},
			setIntrant: function () {
				this.$el.find("#main-container").show();
				this.$el.find("#error-container").hide();
				
				AppStore.init(this.intrant, this);
				
				// Si l'initialisation de l'intrant s'est fait correctement on initialise le feuillets
				this.moduleLoaded();
			},
			hasDebugPanel: function () {
				var deferred = $.Deferred();
				
				var isDebugMode = getProp(this.intrant.query, "debug", null);
				if (isDebugMode === 1 || this.isDebugOn) {
					try {
						this.loadDebugInfo.call(this);
					} catch (e) {
						console.error("La fonction CoreController:loadDebugInfo ne semble pas exister dans le module en cours.");
					}
					
					deferred.resolve(true);
				} else {
					deferred.resolve(false);
				}
				
				return deferred;
			},
			loadDebugInfo: function () {
				var that = this;
				require(['json!workingIntrant/workingIntrant.json'], function (workingIntrant) {
					workingIntrant.sort(function (a, b) {
						return a.description > b.description ? 1 : -1;
					});
					
					that.oDebugCtrl = that.initDebugController(workingIntrant);
				});
			},
			applyTraduction: function () {
				this.rxvI18n.applyTraduction($('html'));
			},
			
			// PRIVATE
			
			// EVENT
		});
		
		return CoreController;
	});
