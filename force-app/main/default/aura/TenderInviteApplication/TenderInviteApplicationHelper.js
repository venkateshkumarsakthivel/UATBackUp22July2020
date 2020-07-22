({
	 inviteBidders : function(component, event) { 
		var action = component.get('c.inviteBidders');
        action.setParams({
            "tenderID": component.get("v.recordId")
        });
        action.setCallback(this,function(result) {
            
             var state = result.getState();      
            console.log('state-------->'+state);
             if (state == "SUCCESS") {
                    var response = result.getReturnValue();
                    console.log('Response');
                    console.log(response);
                 
                  if(response != undefined && response != null) {
                        if(response == 'Successfully Invited'){                    
                            component.set("v.isModalOpen", true);
                            component.set("v.isBidupdatesuccess", true);
                        } else if (response == 'Already Invited') {
                            component.set("v.isModalOpen", true);
                            component.set("v.InviteAlreadySent", true);
                        } 
                        else if (response == 'Successfully Invited Reserved Bids') {
                            component.set("v.isModalOpen", true);
                            component.set("v.InviteReservedTenderBids", true);
                        }
                      else if (response == 'No Topper bidders Identified, Please make the bids offered in order to Invite') {
                            component.set("v.isModalOpen", true);
                            component.set("v.NotOfferedYet", true);
                        } 
                      
                      else if (response == 'Please check the tender status, it is not closed yet!') {
                          console.log('Inside. Please check the tender status, it is not closed yet-------->');
                            component.set("v.isModalOpen", true);
                            component.set("v.TenderNotClosed", true);
                        } 
                      
            		}
             }
              else if(state == "ERROR"){
                 component.set("v.isModalError", true);    
          }
	  });
      $A.enqueueAction(action);
    }
})