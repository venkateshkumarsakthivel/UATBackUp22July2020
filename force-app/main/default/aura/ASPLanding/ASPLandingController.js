({
	doInit : function(component, event, helper) {
		helper.renderManageProfile(component);
        component.set("v.showInfo",true);
    },
    
    handleRemove : function(component, event, helper){
        component.set("v.showInfo",false);
    }
})