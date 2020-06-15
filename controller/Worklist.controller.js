sap.ui.define(["./BaseController","sap/ui/model/json/JSONModel","../model/formatter","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/MessageBox"],function(e,t,a,l,i,r){"use strict";return e.extend("com.mass.compchange.zmasscomponentchange.controller.Worklist",{formatter:a,onInit:function(){var e,a,l=this.byId("table");a=l.getBusyIndicatorDelay();this._aTableSearchState=[];e=new t({worklistTableTitle:this.getResourceBundle().getText("worklistTableTitle"),worklistTableTitleBOM:this.getResourceBundle().getText("worklistTableTitleBOM"),saveAsTileTitle:this.getResourceBundle().getText("saveAsTileTitle",this.getResourceBundle().getText("worklistViewTitle")),shareOnJamTitle:this.getResourceBundle().getText("worklistTitle"),shareSendEmailSubject:this.getResourceBundle().getText("shareSendEmailWorklistSubject"),shareSendEmailMessage:this.getResourceBundle().getText("shareSendEmailWorklistMessage",[location.href]),tableNoDataText:this.getResourceBundle().getText("tableNoDataText"),bomMaterialTableCount:0,bomMaterialReplTableCount:0,bomMaterialDellTableCount:0,bomComponentTableCount:0,tableBusyDelay:0});this.setModel(e,"worklistView");l.attachEventOnce("updateFinished",function(){e.setProperty("/tableBusyDelay",a)});var i=this.byId("tableCompReplace");i.attachEventOnce("onUpdateFinishedRepComp",function(){e.setProperty("/tableBusyDelay",a)});var r=this.byId("tableDel");r.attachEventOnce("onUpdateFinishedRepComp",function(){e.setProperty("/tableBusyDelay",a)});this.addHistoryEntry({title:this.getResourceBundle().getText("worklistViewTitle"),icon:"sap-icon://table-view",intent:"#BillOfMaterialApp-display"},true);this.BOMComp="";this.jModelDelTblAllItems=new sap.ui.model.json.JSONModel;this.jModelDelTblAllItemsOdata=new sap.ui.model.json.JSONModel},onUpdateFinished:function(e){var t,a=e.getSource(),l=e.getParameter("total");if(l&&a.getBinding("items").isLengthFinal()){t=this.getResourceBundle().getText("worklistTableTitleCount",[l])}else{t=this.getResourceBundle().getText("worklistTableTitle")}this.getModel("worklistView").setProperty("/worklistTableTitle",t);this.getModel("worklistView").setProperty("/bomMaterialTableCount",[l])},onUpdateFinishedRepComp:function(e){var t,a=e.getSource(),l=e.getParameter("total");if(l&&a.getBinding("items").isLengthFinal()){t=this.getResourceBundle().getText("worklistTableTitleCountBOM",[l])}else{t=this.getResourceBundle().getText("worklistTableTitleBOM")}this.getModel("worklistView").setProperty("/worklistTableTitle",t);this.getModel("worklistView").setProperty("/bomMaterialReplTableCount",[l])},onUpdateFinishedDelComp:function(e){var t,a=e.getSource(),l=e.getParameter("total");if(l&&a.getBinding("items").isLengthFinal()){t=this.getResourceBundle().getText("worklistTableTitleCountDelComp",[l])}else{t=this.getResourceBundle().getText("worklistTableTitleBOM")}this.getModel("worklistView").setProperty("/worklistTableTitle",t);this.getModel("worklistView").setProperty("/bomMaterialDellTableCount",[l])},onPress:function(e){this._showObject(e.getSource())},onShareInJamPress:function(){var e=this.getModel("worklistView"),t=sap.ui.getCore().createComponent({name:"sap.collaboration.components.fiori.sharing.dialog",settings:{object:{id:location.href,share:e.getProperty("/shareOnJamTitle")}}});t.open()},onSearch:function(e){if(e.getParameters().refreshButtonPressed){this.onRefresh()}else{var t=[];var a=e.getParameter("query");if(a&&a.length>0){var l=sap.ui.model.FilterOperator.Contains;var i=a.toLowerCase();var r=a.toUpperCase();var o=a[0].toUpperCase()+a.substr(1).toLowerCase();var s=a.replace(/\b\w/g,function(e){return e.toUpperCase()});t=[new sap.ui.model.Filter([new sap.ui.model.Filter("Material",l,a),new sap.ui.model.Filter("Material",l,i),new sap.ui.model.Filter("Material",l,r),new sap.ui.model.Filter("Material",l,o),new sap.ui.model.Filter("Material",l,s),new sap.ui.model.Filter("BillOfMaterial",l,a),new sap.ui.model.Filter("BillOfMaterial",l,i),new sap.ui.model.Filter("BillOfMaterial",l,r),new sap.ui.model.Filter("BillOfMaterial",l,o),new sap.ui.model.Filter("BillOfMaterial",l,s),new sap.ui.model.Filter("BillOfMaterialComponent",l,a),new sap.ui.model.Filter("BillOfMaterialComponent",l,i),new sap.ui.model.Filter("BillOfMaterialComponent",l,r),new sap.ui.model.Filter("BillOfMaterialComponent",l,o),new sap.ui.model.Filter("BillOfMaterialComponent",l,s)],false)]}this._applySearch(t)}},onSearchRepComp:function(e){if(e.getParameters().refreshButtonPressed){this.onRefresh()}else{var t=[];var a=e.getParameter("query");if(a&&a.length>0){var l=sap.ui.model.FilterOperator.Contains;var i=a.toLowerCase();var r=a.toUpperCase();var o=a[0].toUpperCase()+a.substr(1).toLowerCase();var s=a.replace(/\b\w/g,function(e){return e.toUpperCase()});t=[new sap.ui.model.Filter([new sap.ui.model.Filter("Material",l,a),new sap.ui.model.Filter("Material",l,i),new sap.ui.model.Filter("Material",l,r),new sap.ui.model.Filter("Material",l,o),new sap.ui.model.Filter("Material",l,s),new sap.ui.model.Filter("BillOfMaterial",l,a),new sap.ui.model.Filter("BillOfMaterial",l,i),new sap.ui.model.Filter("BillOfMaterial",l,r),new sap.ui.model.Filter("BillOfMaterial",l,o),new sap.ui.model.Filter("BillOfMaterial",l,s),new sap.ui.model.Filter("BillOfMaterialComponent",l,a),new sap.ui.model.Filter("BillOfMaterialComponent",l,i),new sap.ui.model.Filter("BillOfMaterialComponent",l,r),new sap.ui.model.Filter("BillOfMaterialComponent",l,o),new sap.ui.model.Filter("BillOfMaterialComponent",l,s)],false)]}this._applySearchRepComp(t)}},onSearchDelComp:function(e){if(e.getParameters().refreshButtonPressed){this.onRefresh()}else{var t=[];var a=e.getParameter("query");if(a&&a.length>0){var l=sap.ui.model.FilterOperator.Contains;var i=a.toLowerCase();var r=a.toUpperCase();var o=a[0].toUpperCase()+a.substr(1).toLowerCase();var s=a.replace(/\b\w/g,function(e){return e.toUpperCase()});t=[new sap.ui.model.Filter([new sap.ui.model.Filter("Material",l,a),new sap.ui.model.Filter("Material",l,i),new sap.ui.model.Filter("Material",l,r),new sap.ui.model.Filter("Material",l,o),new sap.ui.model.Filter("Material",l,s),new sap.ui.model.Filter("BillOfMaterial",l,a),new sap.ui.model.Filter("BillOfMaterial",l,i),new sap.ui.model.Filter("BillOfMaterial",l,r),new sap.ui.model.Filter("BillOfMaterial",l,o),new sap.ui.model.Filter("BillOfMaterial",l,s),new sap.ui.model.Filter("BillOfMaterialComponent",l,a),new sap.ui.model.Filter("BillOfMaterialComponent",l,i),new sap.ui.model.Filter("BillOfMaterialComponent",l,r),new sap.ui.model.Filter("BillOfMaterialComponent",l,o),new sap.ui.model.Filter("BillOfMaterialComponent",l,s)],false)]}this._applySearchDelComp(t)}},onLiveChange:function(e){var t=e.getSource().getValue();this.getView().byId("idPlant").setValue(t.toUpperCase())},onLiveChangeMaterial:function(e){var t=e.getSource().getValue();this.getView().byId("idMaterial").setValue(t.toUpperCase())},onLiveChangeEditBOMComp:function(e){var t=e.getSource().getParent();var a=t.getParent();var l=a.indexOfItem(t);var i=a.getItems()[l];var r=i.getCells()[3].getValue();i.getCells()[3].setValue(r.toUpperCase())},onRefresh:function(){var e=this.byId("table");e.getBinding("items").refresh()},_showObject:function(e){this.getRouter().navTo("object",{objectId:e.getBindingContext().getProperty("BillOfMaterialCategory")})},_applySearch:function(e){var t=this.byId("table"),a=this.getModel("worklistView");t.getBinding("items").filter(e,"Application");if(e.length!==0){a.setProperty("/tableNoDataText",this.getResourceBundle().getText("worklistNoDataWithSearchText"))}},_applySearchRepComp:function(e){var t=this.byId("tableCompReplace"),a=this.getModel("worklistView");t.getBinding("items").filter(e,"Application");if(e.length!==0){a.setProperty("/tableNoDataText",this.getResourceBundle().getText("worklistNoDataWithSearchText"))}},_applySearchDelComp:function(e){var t=this.byId("tableDel"),a=this.getModel("worklistView");t.getBinding("items").filter(e,"Application");if(e.length!==0){a.setProperty("/tableNoDataText",this.getResourceBundle().getText("worklistNoDataWithSearchText"))}},onSearchMaterial:function(){var e=new sap.m.BusyDialog;e.open();var t=this.getView().byId("idMaterial").getValue();var a=this.getView().byId("idPlant").getValue();var l=this.getView().byId("idBOMUsage").getValue();if(t.length===0||a.length===0){sap.m.MessageBox.warning("Please enter all mandatory fields.");e.close()}else{this.jsonModel=new sap.ui.model.json.JSONModel;this.jModelDelTblselectedItem=new sap.ui.model.json.JSONModel;var i=this;var r="/OPENSAP/sap/opu/odata/sap/API_BILL_OF_MATERIAL_SRV;v=2";var o=new sap.ui.model.odata.ODataModel(r,true);o.setDefaultBindingMode("TwoWay");o.setUseBatch(false);o.setHeaders({"Content-Type":"application/json",Accept:"application/json",APIKey:"Tge468DCMvqH4P9uxzAZCdJXHsiMYL5b"});var s=new Array;s[0]=new sap.ui.model.Filter("BillOfMaterialComponent",sap.ui.model.FilterOperator.EQ,t);s[1]=new sap.ui.model.Filter("BOMItemIsSalesRelevant",sap.ui.model.FilterOperator.EQ,"X");s[2]=new sap.ui.model.Filter("Plant",sap.ui.model.FilterOperator.EQ,a);o.read("/MaterialBOMItem",{filters:s,urlParameters:{$select:"BillOfMaterial,BillOfMaterialItemUUID,Material,BillOfMaterialComponent,ComponentDescription,BillOfMaterialItemQuantity,BOMItemRecordCreationDate,BOMItemInternalChangeCount,InheritedNodeNumberForBOMItem,BillOfMaterialComponent,BillOfMaterialItemCategory,BillOfMaterialItemNumber,BillOfMaterialItemUnit,BillOfMaterialItemQuantity,ComponentDescription,BOMItemIsSalesRelevant,BillOfMaterialCategory,BillOfMaterialVariant,BillOfMaterialVersion,BillOfMaterialItemNodeNumber,HeaderChangeDocument,Plant,ObjectType"},async:false,success:function(e,t){for(var a=0;a<e.results.length;a++){e.results[a].EditBOMComponent="";e.results[a].EditBOMQuantity=""}i.jsonModel.setData(e);i.jModelDelTblAllItems.setData(e);i.jModelDelTblAllItemsOdata.setData(e);i.getModel("worklistView").setProperty("/bomComponentTableCount",e.results.length)},error:function(e){sap.m.MessageBox.error(e.message)}});i.getView().setModel(i.jsonModel,"itemModel");i.getView().setModel(this.jsonModel,"itemModelBOMComp");e.close()}},handleIconTabBarSelect:function(e){var t=new sap.m.BusyDialog;t.open();var a=this;var l=e.getParameter("key");if(l==="replaceCompTabKey"){this.byId("idUpdateBOMComp").setVisible(true);this.byId("idDeleteBOMComp").setVisible(false)}else if(l==="infoTabKey"){var i=a.getView().byId("iconTabBar");i.setSelectedKey("infoTabKey");this.byId("idUpdateBOMComp").setVisible(false);this.byId("idDeleteBOMComp").setVisible(false);t.close()}else if(l==="DelTabKey"){this.byId("idUpdateBOMComp").setVisible(false);this.byId("idDeleteBOMComp").setVisible(true)}t.close()},onSelectionChange:function(e){var t=e.getSource().getSelectedContexts()[0].sPath.substring(9);var a=this.byId("table");this.oBOMComp=a.getSelectedContexts()[0].getModel().getData().results[t].BillOfMaterialComponent},onUpdateBOMComp:function(e){var t=this.byId("tableCompReplace");var a=t.getSelectedItems();this.oSelectedCompSetRev=[];if(a.length>0){var l=this.getView();var i=l.byId("updateDialog");if(!i){i=sap.ui.xmlfragment(l.getId(),"com.mass.compchange.zmasscomponentchange.view.UpdateDialog",this);l.addDependent(i)}i.open()}else{sap.m.MessageBox.error("Please select a record to update.")}},onCancelUpdateComp:function(){this.getView().byId("updateDialog").close()},onOkUpdateComp:function(e){var t=new sap.m.BusyDialog;t.open();this.getView().byId("updateDialog").close();var a=this.byId("tableCompReplace");var l=a.getSelectedItems();this.oSelectedCompSet=[];var i="/OPENSAP/sap/opu/odata/sap/API_BILL_OF_MATERIAL_SRV;v=2";var r=new sap.ui.model.odata.ODataModel(i,true);r.setDefaultBindingMode("TwoWay");r.setUseBatch(true);r.setHeaders({"Content-Type":"application/json",Accept:"application/json",APIKey:"Tge468DCMvqH4P9uxzAZCdJXHsiMYL5b","If-Match":"*"});var a=this.byId("tableCompReplace");var l=a.getSelectedItems();var o=[];for(var s=0;s<l.length;s++){var n=a.getSelectedContexts()[s].getPath().substring(9);var p=a.getSelectedContexts()[0].getModel().getData().results[n];this.oSelectedCompSet.push(p);var d=p.BillOfMaterial;var m=p.BillOfMaterialCategory;var u=p.BillOfMaterialVariant;var c=p.BillOfMaterialVersion;var g=p.BillOfMaterialItemNodeNumber;var M=p.HeaderChangeDocument;var h=p.Material;var f=p.Plant;var B=p.BOMItemInternalChangeCount;var O=p.InheritedNodeNumberForBOMItem;if(p.BillOfMaterialComponent.toString().length>0){var C=p.EditBOMComponent}else{var C=p.BillOfMaterialComponent}var v=p.BillOfMaterialItemCategory;var b=p.BillOfMaterialItemNumber;var w=p.BillOfMaterialItemUnit;if(p.EditBOMQuantity.toString().length>0){var I=p.EditBOMQuantity}else{var I=p.BillOfMaterialItemQuantity}var y=p.ComponentDescription;var T=p.BOMItemIsSalesRelevant;var S=p.ObjectType;var D={BillOfMaterial:d,BillOfMaterialCategory:m,BillOfMaterialVariant:u,BillOfMaterialVersion:c,BillOfMaterialItemNodeNumber:g,HeaderChangeDocument:M,Material:h,Plant:f,BOMItemInternalChangeCount:B,InheritedNodeNumberForBOMItem:O,BillOfMaterialComponent:C,BillOfMaterialItemCategory:v,BillOfMaterialItemNumber:b,BillOfMaterialItemUnit:w,BillOfMaterialItemQuantity:I,ComponentDescription:y,BOMItemIsSalesRelevant:T,ObjectType:S};var F={BillOfMaterial:"00013681",BillOfMaterialCategory:"M",BillOfMaterialVariant:"1",BillOfMaterialVersion:"",BillOfMaterialItemNodeNumber:"2",HeaderChangeDocument:"",Material:"762336",Plant:"IT01",BOMItemInternalChangeCount:"4",InheritedNodeNumberForBOMItem:"2",BillOfMaterialComponent:"D1024645",BillOfMaterialItemCategory:"L",BillOfMaterialItemNumber:"0001",BillOfMaterialItemUnit:"PC",BillOfMaterialItemQuantity:"2",BOMItemIsSalesRelevant:"X"};var P="/MaterialBOMItem(BillOfMaterial='"+d+"',BillOfMaterialCategory='"+m+"',BillOfMaterialVariant='"+u+"',BillOfMaterialVersion='"+c+"',BillOfMaterialItemNodeNumber='"+g+"',HeaderChangeDocument='"+M+"',Material='"+h+"',Plant='"+f+"')";o.push(r.createBatchOperation(P,"PUT",D,null))}r.setUseBatch(true);r.addBatchChangeOperations(o);var V=this;r.submitBatch(function(e,a,l){t.close();if(a.body.search("error")>0){var i=jQuery.parseJSON(l[0].response.body).error.message.value;sap.m.MessageBox.show(i,{icon:sap.m.MessageBox.Icon.ERROR,title:"Error",actions:["OK"],onClose:function(e){if(e==="OK"){}},initialFocus:"OK"})}else{sap.m.MessageBox.show("Records updated successfully.",{icon:sap.m.MessageBox.Icon.SUCCESS,title:"Success",actions:["OK"],onClose:function(e){if(e==="OK"){V.onNavToIconTabBarInfo();V.onSearchMaterial()}},initialFocus:"OK"})}},function(e){t.close();sap.m.MessageBox.error(e)})},onDeleteBOMComp:function(e){var t=this.byId("tableDel");var a=t.getSelectedItems();this.oSelectedCompSet=[];if(a.length>0){var l=this.getView();var i=l.byId("deleteDialog");if(!i){i=sap.ui.xmlfragment(l.getId(),"com.mass.compchange.zmasscomponentchange.view.DeleteDialog",this);l.addDependent(i)}i.open()}else{sap.m.MessageBox.error("Please select a record to delete")}},onOkDeleteComp:function(e){var t=new sap.m.BusyDialog;t.open();this.getView().byId("deleteDialog").close();var a=this.byId("tableDel");var l=a.getSelectedItems();this.oSelectedCompSet=[];for(var i=0;i<l.length;i++){var r=a.getSelectedContexts()[i].getPath().substring(9);var o=a.getSelectedContexts()[0].getModel().getData().results[r];this.oSelectedCompSet.push(o)}var s="/OPENSAP/sap/opu/odata/sap/API_BILL_OF_MATERIAL_SRV;v=2";var n=new sap.ui.model.odata.ODataModel(s,true);n.setDefaultBindingMode("TwoWay");n.setUseBatch(true);n.setHeaders({"Content-Type":"application/json",Accept:"application/json",APIKey:"Tge468DCMvqH4P9uxzAZCdJXHsiMYL5b","If-Match":"*"});var a=this.byId("tableDel");var l=a.getSelectedItems();var p=[];var d={};for(var m=0;m<l.length;m++){var r=a.getSelectedContexts()[m].getPath().substring(9);var o=a.getSelectedContexts()[0].getModel().getData().results[r];this.oSelectedCompSet.push(o);var u=o.BillOfMaterial;var c=o.BillOfMaterialCategory;var g=o.BillOfMaterialVariant;var M=o.BillOfMaterialVersion;var h=o.BillOfMaterialItemNodeNumber;var f=o.HeaderChangeDocument;var B=o.Material;var O=o.Plant;var C=o.BOMItemInternalChangeCount;var v=o.InheritedNodeNumberForBOMItem;var b=o.BillOfMaterialComponent;var w=o.BillOfMaterialItemCategory;var I=o.BillOfMaterialItemNumber;var y=o.BillOfMaterialItemUnit;var T=o.BillOfMaterialItemQuantity;var S=o.ComponentDescription;var D=o.BOMItemIsSalesRelevant;d.groupId="deleteGroup";var F="/MaterialBOMItem(BillOfMaterial='"+u+"',BillOfMaterialCategory='"+c+"',BillOfMaterialVariant='"+g+"',BillOfMaterialVersion='"+M+"',BillOfMaterialItemNodeNumber='"+h+"',HeaderChangeDocument='"+f+"',Material='"+B+"',Plant='"+O+"')";p.push(n.createBatchOperation(F,"DELETE"))}n.setUseBatch(true);n.addBatchChangeOperations(p);var P=this;n.submitBatch(function(e,a,l){t.close();if(a.body.search("error")>0){var i=jQuery.parseJSON(l[0].response.body).error.message.value;sap.m.MessageBox.show(i,{icon:sap.m.MessageBox.Icon.ERROR,title:"Error",actions:["OK"],onClose:function(e){if(e==="OK"){}},initialFocus:"OK"})}else{sap.m.MessageBox.show("Records Deleted successfully.",{icon:sap.m.MessageBox.Icon.SUCCESS,title:"Success",actions:["OK"],onClose:function(e){if(e==="OK"){P.onNavToIconTabBarInfo();P.onSearchMaterial()}},initialFocus:"OK"})}},function(e){t.close();sap.m.MessageBox.error(e)})},onNavToIconTabBarInfo:function(){this.onRefresh();var e=this;var t=e.getView().byId("iconTabBar");var a=new sap.ui.base.Event("customSelect",t,{key:"infoTabKey",item:t.getItems()[0]});e.handleIconTabBarSelect(a);t.setSelectedKey("infoTabKey")},onCancelDeleteComp:function(e){this.getView().byId("deleteDialog").close();this.getView().byId("deleteDialog").destroy()}})});