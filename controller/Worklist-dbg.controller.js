sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageBox"
], function (BaseController, JSONModel, formatter, Filter, FilterOperator, MessageBox) {
	"use strict";

	return BaseController.extend("com.mass.compchange.zmasscomponentchange.controller.Worklist", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function () {

			var oViewModel,
				iOriginalBusyDelay,
				oTable = this.byId("table");

			// Put down worklist table's original value for busy indicator delay,
			// so it can be restored later on. Busy handling on the table is
			// taken care of by the table itself.
			iOriginalBusyDelay = oTable.getBusyIndicatorDelay();
			// keeps the search state
			this._aTableSearchState = [];

			// Model used to manipulate control states
			oViewModel = new JSONModel({
				worklistTableTitle: this.getResourceBundle().getText("worklistTableTitle"),
				worklistTableTitleBOM: this.getResourceBundle().getText("worklistTableTitleBOM"),
				saveAsTileTitle: this.getResourceBundle().getText("saveAsTileTitle", this.getResourceBundle().getText("worklistViewTitle")),
				shareOnJamTitle: this.getResourceBundle().getText("worklistTitle"),
				shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
				shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
				tableNoDataText: this.getResourceBundle().getText("tableNoDataText"),
				bomMaterialTableCount: 0,
				bomComponentTableCount: 0,
				tableBusyDelay: 0
			});
			this.setModel(oViewModel, "worklistView");

			// Make sure, busy indication is showing immediately so there is no
			// break after the busy indication for loading the view's meta data is
			// ended (see promise 'oWhenMetadataIsLoaded' in AppController)
			oTable.attachEventOnce("updateFinished", function () {
				// Restore original busy indicator delay for worklist's table
				oViewModel.setProperty("/tableBusyDelay", iOriginalBusyDelay);
			});
			oTable.attachEventOnce("onUpdateFinishedCompList", function () {
				// Restore original busy indicator delay for worklist's table
				oViewModel.setProperty("/tableBusyDelay", iOriginalBusyDelay);
			});
			// Add the worklist page to the flp routing history
			this.addHistoryEntry({
				title: this.getResourceBundle().getText("worklistViewTitle"),
				icon: "sap-icon://table-view",
				intent: "#BillOfMaterialApp-display"
			}, true);

			this.BOMComp = "";
			this.jModelDelTblAllItems = new sap.ui.model.json.JSONModel();
			this.jModelDelTblAllItemsOdata = new sap.ui.model.json.JSONModel();

		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Triggered by the table's 'updateFinished' event: after new table
		 * data is available, this handler method updates the table counter.
		 * This should only happen if the update was successful, which is
		 * why this handler is attached to 'updateFinished' and not to the
		 * table's list binding's 'dataReceived' method.
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
		onUpdateFinished: function (oEvent) {
			// update the worklist's object counter after the table update
			var sTitle,
				oTable = oEvent.getSource(),
				iTotalItems = oEvent.getParameter("total");
			// only update the counter if the length is final and
			// the table is not empty
			if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
			} else {
				sTitle = this.getResourceBundle().getText("worklistTableTitle");
			}
			this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
			this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
			this.getModel("worklistView").setProperty("/bomMaterialTableCount", [iTotalItems]);
		},
		onUpdateFinishedCompList: function (oEvent) {
			// update the worklist's object counter after the table update
			var sTitle,
				oTable = oEvent.getSource(),
				iTotalItems = oEvent.getParameter("total");
			// only update the counter if the length is final and
			// the table is not empty
			if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText("worklistTableTitleCountBOM", [iTotalItems]);
			} else {
				sTitle = this.getResourceBundle().getText("worklistTableTitleBOM");
			}

		},

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onPress: function (oEvent) {
			// The source is the list item that got pressed
			this._showObject(oEvent.getSource());
		},

		/**
		 * Event handler when the share in JAM button has been clicked
		 * @public
		 */
		onShareInJamPress: function () {
			var oViewModel = this.getModel("worklistView"),
				oShareDialog = sap.ui.getCore().createComponent({
					name: "sap.collaboration.components.fiori.sharing.dialog",
					settings: {
						object: {
							id: location.href,
							share: oViewModel.getProperty("/shareOnJamTitle")
						}
					}
				});
			oShareDialog.open();
		},

		onSearch: function (oEvent) {
			if (oEvent.getParameters().refreshButtonPressed) {
				// Search field's 'refresh' button has been pressed.
				// This is visible if you select any master list item.
				// In this case no new search is triggered, we only
				// refresh the list binding.
				this.onRefresh();
			} else {
				var aTableSearchState = [];
				var sQuery = oEvent.getParameter("query");

				if (sQuery && sQuery.length > 0) {
					var contains = sap.ui.model.FilterOperator.Contains;
					// Make case sensitive start
					var sQueryLower = sQuery.toLowerCase();
					var sQueryUpper = sQuery.toUpperCase();
					var sQueryUpLow = sQuery[0].toUpperCase() + sQuery.substr(1).toLowerCase(); // Scentence case
					var sQueryAllFirstLtrUp = sQuery.replace(/\b\w/g, function (l) {
						return l.toUpperCase();
					});
					/*oTableSearchState = [new Filter("PARTNUM", FilterOperator.Contains, sQuery)];*/

					aTableSearchState = [new sap.ui.model.Filter([
						new sap.ui.model.Filter("Material", contains, sQuery),
						new sap.ui.model.Filter("Material", contains, sQueryLower),
						new sap.ui.model.Filter("Material", contains, sQueryUpper),
						new sap.ui.model.Filter("Material", contains, sQueryUpLow),
						new sap.ui.model.Filter("Material", contains, sQueryAllFirstLtrUp),

						new sap.ui.model.Filter("BillOfMaterial", contains, sQuery),
						new sap.ui.model.Filter("BillOfMaterial", contains, sQueryLower),
						new sap.ui.model.Filter("BillOfMaterial", contains, sQueryUpper),
						new sap.ui.model.Filter("BillOfMaterial", contains, sQueryUpLow),
						new sap.ui.model.Filter("BillOfMaterial", contains, sQueryAllFirstLtrUp),

						new sap.ui.model.Filter("BillOfMaterialComponent", contains, sQuery),
						new sap.ui.model.Filter("BillOfMaterialComponent", contains, sQueryLower),
						new sap.ui.model.Filter("BillOfMaterialComponent", contains, sQueryUpper),
						new sap.ui.model.Filter("BillOfMaterialComponent", contains, sQueryUpLow),
						new sap.ui.model.Filter("BillOfMaterialComponent", contains, sQueryAllFirstLtrUp)
					], false)];
				}
				this._applySearch(aTableSearchState);
			}

		},
		onLiveChange: function (oEvent) {
			var oPlant = oEvent.getSource().getValue();
			this.getView().byId("idPlant").setValue(oPlant.toUpperCase());
		},
		onLiveChangeMaterial: function (oEvent) {
			var oMaterial = oEvent.getSource().getValue();
			this.getView().byId("idMaterial").setValue(oMaterial.toUpperCase());
		},
		onLiveChangeEditBOMComp: function (oEvent) {

			var oRow = oEvent.getSource().getParent(); //Get Row
			var oTable = oRow.getParent(); // Get Table
			var iRowIndex = oTable.indexOfItem(oRow); //Get Row index
			var oFirstItem = oTable.getItems()[iRowIndex];
			var oCellValue = oFirstItem.getCells()[3].getValue();
			oFirstItem.getCells()[3].setValue(oCellValue.toUpperCase());
			//this.formatter.toUpperCase(oCellValue);
			//idProductsTable will be your table ID

		},

		/**
		 * Event handler for refresh event. Keeps filter, sort
		 * and group settings and refreshes the list binding.
		 * @public
		 */
		onRefresh: function () {
			var oTable = this.byId("table");
			oTable.getBinding("items").refresh();
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Shows the selected item on the object page
		 * On phones a additional history entry is created
		 * @param {sap.m.ObjectListItem} oItem selected Item
		 * @private
		 */
		_showObject: function (oItem) {
			this.getRouter().navTo("object", {
				objectId: oItem.getBindingContext().getProperty("BillOfMaterialCategory")
			});
		},

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
		 * @private
		 */
		_applySearch: function (aTableSearchState) {
			var oTable = this.byId("table"),
				oViewModel = this.getModel("worklistView");
			oTable.getBinding("items").filter(aTableSearchState, "Application");
			// changes the noDataText of the list in case there are no filter results
			if (aTableSearchState.length !== 0) {
				oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
			}
		},
		onSearchMaterial: function () {
			var oBusyDialog = new sap.m.BusyDialog();
			oBusyDialog.open();
			// Start the oData Service -  Start

			var oMaterial = this.getView().byId("idMaterial").getValue();
			var oPlant = this.getView().byId("idPlant").getValue();
			var oBomUsage = this.getView().byId("idBOMUsage").getValue();
			if (oMaterial.length === 0 || oPlant.length === 0) {
				//var oMatNoMsg = this.getView().byId().getModel("i18n").getResourceBundle().getText("matNoMandatory");
				sap.m.MessageBox.warning("Please enter all mandatory fields.");
				oBusyDialog.close();
			} else {
				this.jsonModel = new sap.ui.model.json.JSONModel();
				this.jModelDelTblselectedItem = new sap.ui.model.json.JSONModel();

				var that = this;
				var url = "/OPENSAP/sap/opu/odata/sap/API_BILL_OF_MATERIAL_SRV;v=2";
				var oModel = new sap.ui.model.odata.ODataModel(url, true);
				oModel.setDefaultBindingMode("TwoWay");
				oModel.setUseBatch(false);
				oModel.setHeaders({
					"Content-Type": "application/json",
					"Accept": "application/json",
					"APIKey": "Tge468DCMvqH4P9uxzAZCdJXHsiMYL5b"
				});
				var oFilter = new Array();
				//oFilter[0] = new sap.ui.model.Filter("BillOfMaterial", sap.ui.model.FilterOperator.EQ, "21193");
				oFilter[0] = new sap.ui.model.Filter("BillOfMaterialComponent", sap.ui.model.FilterOperator.EQ, oMaterial); //D1020373G
				oFilter[1] = new sap.ui.model.Filter("BOMItemIsSalesRelevant", sap.ui.model.FilterOperator.EQ, "X");
				oFilter[2] = new sap.ui.model.Filter("Plant", sap.ui.model.FilterOperator.EQ, oPlant);

				/*oFilter[0] = new sap.ui.model.Filter("BillOfMaterialComponent", sap.ui.model.FilterOperator.EQ, oMaterial);
				oFilter[1] = new sap.ui.model.Filter("Plant", sap.ui.model.FilterOperator.EQ, oPlant);
				oFilter[2] = new sap.ui.model.Filter("BOMItemIsSalesRelevant", sap.ui.model.FilterOperator.EQ, "X");*/

				//oFilter[0] = new sap.ui.model.Filter("BillOfMaterialComponent", sap.ui.model.FilterOperator.EQ, oBomMaterial);
				oModel.read("/MaterialBOMItem", { // Get all valid material
					filters: oFilter,
					urlParameters: {
						"$select": "BillOfMaterial,BillOfMaterialItemUUID,Material,BillOfMaterialComponent,ComponentDescription,BillOfMaterialItemQuantity,BOMItemRecordCreationDate,BOMItemInternalChangeCount,InheritedNodeNumberForBOMItem,BillOfMaterialComponent,BillOfMaterialItemCategory,BillOfMaterialItemNumber,BillOfMaterialItemUnit,BillOfMaterialItemQuantity,ComponentDescription,BOMItemIsSalesRelevant,BillOfMaterialCategory,BillOfMaterialVariant,BillOfMaterialVersion,BillOfMaterialItemNodeNumber,HeaderChangeDocument,Plant,ObjectType"
					},

					async: false,
					success: function (oData, response) {
						for (var t = 0; t < oData.results.length; t++) {
							oData.results[t].EditBOMComponent = "";
							oData.results[t].EditBOMQuantity = "";
						}

						that.jsonModel.setData(oData);
						that.jModelDelTblAllItems.setData(oData);
						that.jModelDelTblAllItemsOdata.setData(oData);

						that.getModel("worklistView").setProperty("/bomComponentTableCount", oData.results.length);
						//that.getModel("worklistView").setProperty("/bomMaterialTableCount", oData.results.length);

						//	alert(" Record Found - " + oData.results.length);

					},
					error: function (oError) {

						sap.m.MessageBox.error(oError.message);
					}
				});

				that.getView().setModel(that.jsonModel, "itemModel");
				that.getView().setModel(this.jsonModel, "itemModelBOMComp");

				//	GET <host>/sap/opu/odata/SAP/API_BILL_OF_MATERIAL_SRV;v=2/MaterialBOMItem(BillOfMaterial='00029377',BillOfMaterialCategory='M',BillOfMaterialVariant='1',BillOfMaterialVersion='',BillOfMaterialItemNodeNumber='1',HeaderChangeDocument='',Material='AA_BDL_API_COMP',Plant='0001')

				// Start the oData Service  - End
				oBusyDialog.close();
			}

		},
		handleIconTabBarSelect: function (oEvent) {
			var oBusyDialog = new sap.m.BusyDialog();
			oBusyDialog.open();
			var that = this;
			var sKey = oEvent.getParameter("key");

			if (sKey === "replaceCompTabKey") {
				// End
				this.byId("idUpdateBOMComp").setVisible(true);
				this.byId("idDeleteBOMComp").setVisible(false);
			} else if (sKey === "infoTabKey") {
				var oIconTabBar = that.getView().byId("iconTabBar");
				oIconTabBar.setSelectedKey("infoTabKey");
				// End
				this.byId("idUpdateBOMComp").setVisible(false);
				this.byId("idDeleteBOMComp").setVisible(false);
				oBusyDialog.close();
			} else if (sKey === "DelTabKey") {
				// End
				this.byId("idUpdateBOMComp").setVisible(false);
				this.byId("idDeleteBOMComp").setVisible(true);
			}
			oBusyDialog.close();
		},
		onSelectionChange: function (oEvent) {
			var oIndex = oEvent.getSource().getSelectedContexts()[0].sPath.substring(9);
			//alert(" Index - " + oIndex);
			var oTable = this.byId("table");
			//var persnoVal = oTable.getSelectedItem().getBindingContext().getProperty("DOCNUM");
			this.oBOMComp = oTable.getSelectedContexts()[0].getModel().getData().results[oIndex].BillOfMaterialComponent;
			//alert("Bom Component - "+this.BOMComp);

		},
		onUpdateBOMComp: function (oEvent) {
			var oTable = this.byId("tableCompReplace");
			var selectedItems = oTable.getSelectedItems();
			this.oSelectedCompSetRev = [];
			if (selectedItems.length > 0) {

				var oView = this.getView();
				var oDialog = oView.byId("updateDialog");
				// create dialog lazily
				if (!oDialog) {
					// create dialog via fragment factory
					oDialog = sap.ui.xmlfragment(oView.getId(), "com.mass.compchange.zmasscomponentchange.view.UpdateDialog", this);
					// connect dialog to view (models, lifecycle)
					oView.addDependent(oDialog);
				}
				
				// Reveiew screen show all selected

				/*var oModelRevTbl = new sap.ui.model.json.JSONModel();
				var oTable = this.byId("tableCompReplace");
				for (var index = 0; index < selectedItems.length; index++) {
					var RowIndex = oTable.getSelectedContexts()[index].getPath().substring(9);
					var oItemData = oTable.getSelectedContexts()[0].getModel().getData().results[RowIndex];
					this.oSelectedCompSetRev.push(oItemData);
				}

				oModelRevTbl.setData(this.oSelectedCompSetRev);
				var oModelRevTblFinal = new sap.ui.model.json.JSONModel(oModelRevTbl);
				oDialog.open();
				this.getView().setModel(oModelRevTblFinal, "itemModelUpdateRev");*/

				oDialog.open();

				/*
					var oIconTabBar = this.getView().byId("iconTabBar");
										var oEventBOM = new sap.ui.base.Event("customSelect", oIconTabBar, {
											"key": "infoTabKey",
											"item": oIconTabBar.getItems()[0]
										});
										this.handleIconTabBarSelect(oEventBOM);
										oIconTabBar.setSelectedKey("addNotesTabKey");
				*/
			} else {

				sap.m.MessageBox.error("Please select a record to update.");

			}
		},
		onCancelUpdateComp: function () {

			this.getView().byId("updateDialog").close();
		},

		onOkUpdateComp: function (oEvent) {
			var oBusyDialog = new sap.m.BusyDialog();
			oBusyDialog.open();
			this.getView().byId("updateDialog").close();
			// Loop through the table to get teh selected record -  Start
			var oTable = this.byId("tableCompReplace");
			var selectedItems = oTable.getSelectedItems();
			this.oSelectedCompSet = [];
			/*for (var index = 0; index < selectedItems.length; index++) {
				var selectedRowIndex = oTable.getSelectedContexts()[index].getPath().substring(9);
				var oItemData = oTable.getSelectedContexts()[0].getModel().getData().results[selectedRowIndex];
				this.oSelectedCompSet.push(oItemData);
			}*/
			// Loop through the table to get teh selected record -  End

			// Start the batch operation - Start

			var url = "/OPENSAP/sap/opu/odata/sap/API_BILL_OF_MATERIAL_SRV;v=2";
			var oModel = new sap.ui.model.odata.ODataModel(url, true);
			oModel.setDefaultBindingMode("TwoWay");
			oModel.setUseBatch(true);
			oModel.setHeaders({
				"Content-Type": "application/json",
				"Accept": "application/json",
				"APIKey": "Tge468DCMvqH4P9uxzAZCdJXHsiMYL5b",
				"If-Match": "*"
			});

			var oTable = this.byId("tableCompReplace");
			var selectedItems = oTable.getSelectedItems();
			//alert("Selected Items: - " + selectedItems.length);
			var batchChanges = [];

			for (var i = 0; i < selectedItems.length; i++) {

				var selectedRowIndex = oTable.getSelectedContexts()[i].getPath().substring(9);
				var oItemData = oTable.getSelectedContexts()[0].getModel().getData().results[selectedRowIndex];
				this.oSelectedCompSet.push(oItemData);

				var oBillOfMaterial = oItemData.BillOfMaterial;
				var oBillOfMaterialCategory = oItemData.BillOfMaterialCategory;
				var oBillOfMaterialVariant = oItemData.BillOfMaterialVariant;
				var oBillOfMaterialVersion = oItemData.BillOfMaterialVersion;
				var oBillOfMaterialItemNodeNumber = oItemData.BillOfMaterialItemNodeNumber;
				var oHeaderChangeDocument = oItemData.HeaderChangeDocument;
				var oMaterial = oItemData.Material;
				var oPlant = oItemData.Plant;
				var oBOMItemInternalChangeCount = oItemData.BOMItemInternalChangeCount;
				var oInheritedNodeNumberForBOMItem = oItemData.InheritedNodeNumberForBOMItem;
				if (oItemData.BillOfMaterialComponent.toString().length > 0) {
					var oBillOfMaterialComponent = oItemData.EditBOMComponent; //oItemData.BillOfMaterialComponent;
				} else {
					var oBillOfMaterialComponent = oItemData.BillOfMaterialComponent; //oItemData.BillOfMaterialComponent;
				}

				var oBillOfMaterialItemCategory = oItemData.BillOfMaterialItemCategory;
				var oBillOfMaterialItemNumber = oItemData.BillOfMaterialItemNumber;
				var oBillOfMaterialItemUnit = oItemData.BillOfMaterialItemUnit;
				if (oItemData.EditBOMQuantity.toString().length > 0) {
					var oBillOfMaterialItemQuantity = oItemData.EditBOMQuantity; //oItemData.BillOfMaterialItemQuantity;
				} else {
					var oBillOfMaterialItemQuantity = oItemData.BillOfMaterialItemQuantity; //oItemData.BillOfMaterialItemQuantity;
				}

				var oComponentDescription = oItemData.ComponentDescription;
				var oBOMItemIsSalesRelevant = oItemData.BOMItemIsSalesRelevant;
				var oObjectType = oItemData.ObjectType;
				// Request Payload -  Start
				var oRequestPayLoadFinal = { // Working perfectly for Sales BOM -  After long discussion

					//Modified Data set -  Minimum Data required for json model
					"BillOfMaterial": oBillOfMaterial, // "00013681", //"00013272",
					"BillOfMaterialCategory": oBillOfMaterialCategory, // "M",
					"BillOfMaterialVariant": oBillOfMaterialVariant, //"1",
					"BillOfMaterialVersion": oBillOfMaterialVersion, // "",
					"BillOfMaterialItemNodeNumber": oBillOfMaterialItemNodeNumber, // "2",
					"HeaderChangeDocument": oHeaderChangeDocument, //"",
					"Material": oMaterial, // "762336", //"2300670",
					"Plant": oPlant, //"IT01",
					"BOMItemInternalChangeCount": oBOMItemInternalChangeCount, //"4",
					"InheritedNodeNumberForBOMItem": oInheritedNodeNumberForBOMItem, // "2",
					"BillOfMaterialComponent": oBillOfMaterialComponent, // "D1024645", //"PC00810",//"D1024645",
					"BillOfMaterialItemCategory": oBillOfMaterialItemCategory, // "L",
					"BillOfMaterialItemNumber": oBillOfMaterialItemNumber, // "0001",
					"BillOfMaterialItemUnit": oBillOfMaterialItemUnit, //"PC",
					"BillOfMaterialItemQuantity": oBillOfMaterialItemQuantity, //"2",
					"ComponentDescription": oComponentDescription, //"TANK ASSEMBLY 915 E , FG, 9\"X36\", ACME,",
					"BOMItemIsSalesRelevant": oBOMItemIsSalesRelevant, //"X"
					"ObjectType": oObjectType

				};

				var oRequestPayLoad = { // Working perfectly for Sales BOM -  After long discussion

					//Modified Data set -  Minimum Data required for json model
					"BillOfMaterial": "00013681", //"00013272",
					"BillOfMaterialCategory": "M",
					"BillOfMaterialVariant": "1",
					"BillOfMaterialVersion": "",
					"BillOfMaterialItemNodeNumber": "2",
					"HeaderChangeDocument": "",
					"Material": "762336", //"2300670",
					"Plant": "IT01",
					"BOMItemInternalChangeCount": "4",
					"InheritedNodeNumberForBOMItem": "2",
					"BillOfMaterialComponent": "D1024645", //"PC00810",//"D1024645",
					"BillOfMaterialItemCategory": "L",
					"BillOfMaterialItemNumber": "0001",
					"BillOfMaterialItemUnit": "PC",
					"BillOfMaterialItemQuantity": "2",
					"BOMItemIsSalesRelevant": "X"

				};
				// Request Payload -  End

				// Search the BomUsage -  Start    '" + param + "'

				//var oSpath ="/MaterialBOM(BillOfMaterial='00025899',BillOfMaterialCategory='M',BillOfMaterialVariant='1',BillOfMaterialVersion='',EngineeringChangeDocument='',Material='2301139',Plant='IT01')";
				/*var oSpath = "/MaterialBOM(BillOfMaterial='" + oBillOfMaterial + "',BillOfMaterialCategory='" + oBillOfMaterialCategory +
					"',BillOfMaterialVariant='" + oBillOfMaterialVariant + "',BillOfMaterialVersion='" + oBillOfMaterialVersion +
					"',BillOfMaterialItemNodeNumber='" + oBillOfMaterialItemNodeNumber + "',HeaderChangeDocument='" + oHeaderChangeDocument + "',Material='" + oMaterial + "',Plant='" + oPlant +
					"')";*/

				var sPathWithParam =
					"/MaterialBOMItem(BillOfMaterial='" + oBillOfMaterial + "',BillOfMaterialCategory='" + oBillOfMaterialCategory +
					"',BillOfMaterialVariant='" + oBillOfMaterialVariant + "',BillOfMaterialVersion='" + oBillOfMaterialVersion +
					"',BillOfMaterialItemNodeNumber='" + oBillOfMaterialItemNodeNumber + "',HeaderChangeDocument='" + oHeaderChangeDocument +
					"',Material='" + oMaterial + "',Plant='" + oPlant +
					"')";
				batchChanges.push(oModel.createBatchOperation(sPathWithParam, "PUT", oRequestPayLoadFinal, null));

			}

			// Start the batch - 

			oModel.setUseBatch(true);
			oModel.addBatchChangeOperations(batchChanges);
			var that = this;
			oModel.submitBatch(
				function (oRecData, oRecResponse, aErrorResponses) { // request successfully sent

					oBusyDialog.close();

					if (oRecResponse.body.search("error") > 0) {
						var erroeMsg = jQuery.parseJSON(aErrorResponses[0].response.body).error.message.value;
						sap.m.MessageBox.show(
							erroeMsg, {
								icon: sap.m.MessageBox.Icon.ERROR,
								title: "Error",
								actions: ["OK"],
								onClose: function (oAction) {
									if (oAction === "OK") {
										//that.onNavBack();
										//that.getRouter().navTo("worklist", {});
										//that.getOwnerComponent().getComponentData().srcPage = that.getView().getViewName();
										//that.getRouter().navTo("object", {}, true);
									}
								},
								initialFocus: "OK"
							}
						);

					} else {

						sap.m.MessageBox.show(
							"Records updated successfully.", {
								icon: sap.m.MessageBox.Icon.SUCCESS,
								title: "Success",
								actions: ["OK"],
								onClose: function (oAction) {
									if (oAction === "OK") {
										that.onNavToIconTabBarInfo();
										that.onSearchMaterial();
									}
								},
								initialFocus: "OK"
							}
						);
					}

				},
				function (aErrorResponses) {
					oBusyDialog.close();
					sap.m.MessageBox.error(aErrorResponses);

				}
			);

			// Start teh batch operation  - End

		},
		onDeleteBOMComp: function (oEvent) {
			var oTable = this.byId("tableDel");
			var selectedItems = oTable.getSelectedItems();
			this.oSelectedCompSet = [];
			if (selectedItems.length > 0) {

				var oView = this.getView();
				var oDialog = oView.byId("deleteDialog");
				// create dialog lazily
				if (!oDialog) {
					// create dialog via fragment factory
					oDialog = sap.ui.xmlfragment(oView.getId(), "com.mass.compchange.zmasscomponentchange.view.DeleteDialog", this);
					// connect dialog to view (models, lifecycle)
					oView.addDependent(oDialog);
				}

				oDialog.open();


			} else {
				sap.m.MessageBox.error("Please select a record to delete");
			}

			/*
				var oIconTabBar = this.getView().byId("iconTabBar");
									var oEventBOM = new sap.ui.base.Event("customSelect", oIconTabBar, {
										"key": "infoTabKey",
										"item": oIconTabBar.getItems()[0]
									});
									this.handleIconTabBarSelect(oEventBOM);
									oIconTabBar.setSelectedKey("addNotesTabKey");
			*/
		},
		onOkDeleteComp: function (oEvent) {

			var oBusyDialog = new sap.m.BusyDialog();
			oBusyDialog.open();
			this.getView().byId("deleteDialog").close();
			// Loop through the table to get teh selected record -  Start
			var oTable = this.byId("tableDel");
			var selectedItems = oTable.getSelectedItems();
			this.oSelectedCompSet = [];
			for (var index = 0; index < selectedItems.length; index++) {
				var selectedRowIndex = oTable.getSelectedContexts()[index].getPath().substring(9);
				var oItemData = oTable.getSelectedContexts()[0].getModel().getData().results[selectedRowIndex];
				this.oSelectedCompSet.push(oItemData);
			}
			// Loop through the table to get teh selected record -  End

			// Start the batch operation - Start

			var url = "/OPENSAP/sap/opu/odata/sap/API_BILL_OF_MATERIAL_SRV;v=2";
			var oModel = new sap.ui.model.odata.ODataModel(url, true);
			oModel.setDefaultBindingMode("TwoWay");
			oModel.setUseBatch(true);
			oModel.setHeaders({
				"Content-Type": "application/json",
				"Accept": "application/json",
				"APIKey": "Tge468DCMvqH4P9uxzAZCdJXHsiMYL5b",
				"If-Match": "*"
			});

			var oTable = this.byId("tableDel");
			var selectedItems = oTable.getSelectedItems();
			//alert("Selected Items: - " + selectedItems.length);
			var batchChanges = [];
			var mParameters = {};

			for (var i = 0; i < selectedItems.length; i++) {

				var selectedRowIndex = oTable.getSelectedContexts()[i].getPath().substring(9);
				var oItemData = oTable.getSelectedContexts()[0].getModel().getData().results[selectedRowIndex];
				this.oSelectedCompSet.push(oItemData);

				var oBillOfMaterial = oItemData.BillOfMaterial;
				var oBillOfMaterialCategory = oItemData.BillOfMaterialCategory;
				var oBillOfMaterialVariant = oItemData.BillOfMaterialVariant;
				var oBillOfMaterialVersion = oItemData.BillOfMaterialVersion;
				var oBillOfMaterialItemNodeNumber = oItemData.BillOfMaterialItemNodeNumber;
				var oHeaderChangeDocument = oItemData.HeaderChangeDocument;
				var oMaterial = oItemData.Material;
				var oPlant = oItemData.Plant;
				var oBOMItemInternalChangeCount = oItemData.BOMItemInternalChangeCount;
				var oInheritedNodeNumberForBOMItem = oItemData.InheritedNodeNumberForBOMItem;
				var oBillOfMaterialComponent = oItemData.BillOfMaterialComponent;
				var oBillOfMaterialItemCategory = oItemData.BillOfMaterialItemCategory;
				var oBillOfMaterialItemNumber = oItemData.BillOfMaterialItemNumber;
				var oBillOfMaterialItemUnit = oItemData.BillOfMaterialItemUnit;
				var oBillOfMaterialItemQuantity = oItemData.BillOfMaterialItemQuantity;
				var oComponentDescription = oItemData.ComponentDescription;
				var oBOMItemIsSalesRelevant = oItemData.BOMItemIsSalesRelevant;
				// Request Payload -  Start

				// Request Payload -  End
				// set group id with any name
				mParameters.groupId = "deleteGroup";

				var sPathWithParam =
					"/MaterialBOMItem(BillOfMaterial='" + oBillOfMaterial + "',BillOfMaterialCategory='" + oBillOfMaterialCategory +
					"',BillOfMaterialVariant='" + oBillOfMaterialVariant + "',BillOfMaterialVersion='" + oBillOfMaterialVersion +
					"',BillOfMaterialItemNodeNumber='" + oBillOfMaterialItemNodeNumber + "',HeaderChangeDocument='" + oHeaderChangeDocument +
					"',Material='" + oMaterial + "',Plant='" + oPlant +
					"')";
				batchChanges.push(oModel.createBatchOperation(sPathWithParam, "DELETE"));
				//oModel.remove(sPathWithParam,null); // this code is working for remove

			}

			// Start the batch - 
			oModel.setUseBatch(true);
			oModel.addBatchChangeOperations(batchChanges);
			var that = this;
			oModel.submitBatch(
				function (oRecData, oRecResponse, aErrorResponses) { // request successfully sent

					oBusyDialog.close();

					if (oRecResponse.body.search("error") > 0) {
						var erroeMsg = jQuery.parseJSON(aErrorResponses[0].response.body).error.message.value;
						sap.m.MessageBox.show(
							erroeMsg, {
								icon: sap.m.MessageBox.Icon.ERROR,
								title: "Error",
								actions: ["OK"],
								onClose: function (oAction) {
									if (oAction === "OK") {
										//that.onNavBack();
										//that.getRouter().navTo("worklist", {});
										//that.getOwnerComponent().getComponentData().srcPage = that.getView().getViewName();
										//that.getRouter().navTo("object", {}, true);
									}
								},
								initialFocus: "OK"
							}
						);

					} else {

						sap.m.MessageBox.show(
							"Records Deleted successfully.", {
								icon: sap.m.MessageBox.Icon.SUCCESS,
								title: "Success",
								actions: ["OK"],
								onClose: function (oAction) {
									if (oAction === "OK") {
										that.onNavToIconTabBarInfo();
										that.onSearchMaterial();
									}
								},
								initialFocus: "OK"
							}
						);
					}

				},
				function (aErrorResponses) {
					oBusyDialog.close();
					sap.m.MessageBox.error(aErrorResponses);

				}
			);

		},
		onNavToIconTabBarInfo: function () {

			this.onRefresh();
			var that = this;
			var oIconTabBar = that.getView().byId("iconTabBar");
			var oEventBOM = new sap.ui.base.Event("customSelect", oIconTabBar, {
				"key": "infoTabKey",
				"item": oIconTabBar.getItems()[0]
			});
			that.handleIconTabBarSelect(oEventBOM);
			oIconTabBar.setSelectedKey("infoTabKey");
		},

		onCancelDeleteComp: function (oEvent) {
			this.getView().byId("deleteDialog").close();
			this.getView().byId("deleteDialog").destroy();
		}

	});
});