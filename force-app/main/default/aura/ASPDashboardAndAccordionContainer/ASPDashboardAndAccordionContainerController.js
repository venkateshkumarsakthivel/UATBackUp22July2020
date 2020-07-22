({
	doinit : function(component, event, helper) {
		component.set("v.showInfo",true);
        helper.checkDVDDowntime(component, event);
	},
    
    handleRemove : function(component, event, helper){
        component.set("v.showInfo",false);
    },
})