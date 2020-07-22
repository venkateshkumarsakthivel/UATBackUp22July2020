({
	doInit:function(component,event,helper){
        console.log('doInit is invoked');
   		console.log('recordid'+component.get("v.recordId"));
         helper.getBidCalculator(component, event);
        
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