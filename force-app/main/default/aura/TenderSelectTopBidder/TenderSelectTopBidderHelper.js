({
	 getBidCalculator : function(component, event) { 
		var action = component.get('c.calculateTopBidders');
        action.setParams({
            "tenderID": component.get("v.recordId")
        });
        action.setCallback(this,function(result) {
            
             var state = result.getState();      
            console.log('state-------->'+state);

             if (state == "SUCCESS") {
                    var response = result.getReturnValue();
                    console.log('Response---->'+ response);
        
                    var driversMap = {};
                    if(response != undefined && response != null) {
                        
                        if (response == 'Tender is Not Closed Yet!'){
                            component.set("v.isModalOpen", true);
                            component.set("v.isTenderNotClosed", true);                    
                        }else if (response == 'BID already offered!'){
                            component.set("v.isModalOpen", true);
                            component.set("v.isBidsAlreadyOffered", true);                    
                        }else if (response == 'No Bids Found'){
                            component.set("v.isModalOpen", true);
                            component.set("v.isBidNoBids", true);
                        }else if (response == 'Reserved Tender Bid are made Offered!'){
                            component.set("v.isModalOpen", true);
                            component.set("v.isReserverdBidsuccess", true);
                        } else{        
                            component.set("v.isModalOpen", true);
                            component.set("v.isBidupdatesuccess", true);
                            component.set("v.getBidOfferedCount",response);
                       
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