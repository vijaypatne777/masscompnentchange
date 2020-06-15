/* global QUnit */

QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function() {
	"use strict";

	sap.ui.require([
		"com/mass/compchange/zmasscomponentchange/test/integration/AllJourneys"
	], function() {
		QUnit.start();
	});
});