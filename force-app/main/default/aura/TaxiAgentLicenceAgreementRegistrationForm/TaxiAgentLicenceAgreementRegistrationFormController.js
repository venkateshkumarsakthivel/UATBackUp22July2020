({
    updateSectionHandlers : function(component, event, helper) {
                
        var sectionToRender = event.getParam("sectionName");
        var registrationDataRelatedContact = event.getParam("recordDataRelatedContact");
        var registrationDataCase = event.getParam("recordDataCase");
        var uliUploadStatus = event.getParam("uliUploadStatus");
        var identityCheck = event.getParam("identityCheck");
        var accountId = event.getParam("accountId");
        
        component.set('v.RelatedContactList', registrationDataRelatedContact);
        component.set('v.caseId', registrationDataCase);
        component.set('v.sectionNameToRender', sectionToRender);
        component.set('v.uliUploadStatus', uliUploadStatus);
        component.set('v.identityCheck', identityCheck);
        component.set('v.accountId', accountId);
        
         
         console.log('registrationDataRelatedContact---->'+ component.get('v.RelatedContactList'));
        
        
          console.log('registrationDataCase---->'+ component.get('v.caseId'));
       
        console.log('uliUploadStatus---->'+component.get('v.uliUploadStatus'));
        
         console.log('identityCheck---->'+ component.get('v.identityCheck'));
      
         console.log('accountId---->'+component.get('v.accountId'));
        console.log('sectionNameToRender---->'+ component.get('v.sectionNameToRender'));

         
      console.log('sectionNameToRender---->'+ component.get('v.sectionNameToRender'));

        
        window.scrollTo(0, 0);
    }
})