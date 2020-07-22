({
	doInit:function(component,event,helper){
        console.log('doInit is invoked');
   		  var caseid = component.get("v.recordId");
         console.log("caseidcaseid in controller"+caseid);
       
        
  	},
    InviteApplicant:function(component,event,helper){
          var caseid = component.get("v.recordId");
         console.log("caseidcaseid in controller"+caseid);
        	helper.InviteApplicant(component, event);
        
    },
    closeModel: function(component, event, helper) {
      // Set isModalOpen attribute to false  
      component.set("v.isModalOpen", false);
   },
  
   submitDetails: function(component, event, helper) {
      // Set isModalOpen attribute to false
      //Add your code to call apex method or do some processing
      component.set("v.isModalOpen", false);
   }
})