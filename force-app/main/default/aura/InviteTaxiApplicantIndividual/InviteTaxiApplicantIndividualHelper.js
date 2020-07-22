({   

    InviteApplicant : function(component, event) {
       
        var caseid = component.get("v.recordId");
         console.log("caseidcaseid in helper"+caseid);
        var action = component.get("c.processAccountForCaseIndividual");
        action.setParams({
            "caseId": caseid
        });
       // action.setStorable();
        
        action.setCallback(this,function(response){
            if(response.getState()=='SUCCESS'){
                //this.showToast(component,event,'Succes!','Invitation successfully sent.','success');
            		component.set("v.isModalOpen", true);
                    component.set("v.isBidupdatesuccess", true);
                    component.set("v.getBidOfferedCount",response);
            //this.hideSpinner(component, event);
            }
              if(response.getState() == "ERROR"){
        			component.set("v.isModalOpen", true);
                    component.set("v.isBidupdatesuccess", false);
    }
            
            
        });
       
        $A.enqueueAction(action);
    }
})