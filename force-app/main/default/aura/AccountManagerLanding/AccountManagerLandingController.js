({
    myAction : function(component, event, helper) {
        
    },
    
    handleRemove : function(component, event, helper){
        component.set("v.showInfo",false);
    },
    
    doInit : function(component, event, helper) {
        component.set("v.showInfo",true);
    },
})