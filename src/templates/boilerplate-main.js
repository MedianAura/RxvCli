var urlArgsRequireJs = (new Date()).getTime();

requirejs.config({
    packages: [
        {
            name: "rxvlibrairies",
            main: "rxvlibrairies-main"
        },
        {
            name: "vendor",
            main: "vendor-main"
        }
    ],
    paths: {
        //Data
        //Store
        AppStore: "<%= storePath %>",

        //Service
        Service: null,

        //Controller
        coreController: "<%= corePath %>",

        //Component
        Component: null,

        //Model
        Model: null,

        //Labels
        labels: "data/labels",

        //Config des modules
        rxVigilanceModule: "../config/rxvShowMe",
        rxVigilanceConfig: "vigilance_config",
        rxVAppConfig: "app_config",

        //Version de l'application
        appVersion: "rxv_version",
        dataVersion: "data/rxv_data"
    },
    baseDir: "<%= rootDir %>",
    waitSeconds: 0,
    urlArgs: "bust=" + urlArgsRequireJs
});

require(['rxvlibrairies', 'vendor'], function () {
	require(["coreController"], function (CoreController) {
		require(['rxVigilanceModule', 'rxVigilanceConfig', 'rxVAppConfig', 'appVersion', 'dataVersion'], function () {
			new CoreController();
		});
	});
});