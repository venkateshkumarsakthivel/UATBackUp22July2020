/*Requirement : After the tender bid is inserted, the associated contact gets mapped to the Tender BID, if it is existing in the system.
 * Else a new contact is created and then mapped to the tender bit.
 * 
 * 
 * Called from Trigger on After Insert : In order to make sure, no contact is inserted before the actual bid is inserted.
  */

public class ExisitingAccountContactCheck {
	
     @InvocableMethod(label='Get Contact Info' description='the associated contact gets mapped to the Tender BID, if it is existing in the system')
  
    public static void checkExisitngAccountContactinfo(List<Tender_Bid__c> lstTenderbids){
        system.debug('lstTenderbids---------->'+lstTenderbids);
        
        
        map<id,string> mapTenderBidDriverlicence = new map<id,string>();
        map<id,string> mapTenderBidIndividualAccountNoDriverlicence = new map<id,string>();
        
        map<id,string> mapTenderBidFirstName = new map<id,string>();
        map<id,string> mapTenderBidLastName = new map<id,string>();
        map<id,string> mapTenderBidEmail = new map<id,string>();
        map<id,string> mapTenderBidPhone = new map<id,string>();
        
        map<id,string> mapTenderBidACN = new map<id,string>();
        
        map<string,id> mapDriverlicencecontact = new map<string,id>();
        map<string,id> mapLastNamecontact = new map<string,id>();
        
        
        map<string,id> mapTenderBidwithNewContact = new map<string,id>();
        map<string,id> mapTenderBidLNwithNewContact = new map<string,id>();
        
        
        list<Tender_Bid__c> lstTenderbidupdate =  new list<Tender_Bid__c>();
        list<Contact> lstContactInsert = new list<Contact>();
        List<string> newContactdriverslicence = new List<string>();
        
        List<string> newLastName = new List<string>();
        
        map<ID,ID> mapConAccID = new map<ID,ID>();
        
         map<id,id> mapTenderBidContact = new map<id,id>();
        
        map<string,string> mapACNNew = new map<string,string>();
        map<string,string> mapACNNewCorpName = new map<string,string>();
        
        
        User u = [SELECT Id, IsActive FROM User WHERE name = 'System User'];
		Id BidIndividualRecType = Schema.SObjectType.Tender_Bid__c.getRecordTypeInfosByName().get('Individual').getRecordTypeId();
        Id BidCorporateRecType = Schema.SObjectType.Tender_Bid__c.getRecordTypeInfosByName().get('Corporation').getRecordTypeId();
        system.debug('BidIndividualRecType---------->'+BidIndividualRecType);
        
        
        for(Tender_Bid__c bid: lstTenderbids){
            
             mapTenderBidEmail.put(bid.id,bid.Contact_Email__c);
             mapTenderBidPhone.put(bid.id,bid.Business_Hours_Phone__c);
            
            
            if(bid.Driver_Licence_Number__c != null && bid.RecordTypeId == BidIndividualRecType){
                system.debug('Passed Indi---------->'+bid.Driver_Licence_Number__c);
                  	mapTenderBidDriverlicence.put(bid.id,bid.Driver_Licence_Number__c);
                mapTenderBidIndividualAccountNoDriverlicence.put(bid.id,bid.Driver_Licence_Number__c);
                
                    mapTenderBidFirstName.put(bid.id,bid.First_Name__c);
                    mapTenderBidLastName.put(bid.id,bid.Last_Name__c);
            } else if ( bid.Nominated_Contact_Driver_Licence_Number__c != null && bid.RecordTypeId == BidCorporateRecType ){
                 system.debug('Passed corp---------->'+bid.Nominated_Contact_Driver_Licence_Number__c);
                    mapTenderBidDriverlicence.put(bid.id,bid.Nominated_Contact_Driver_Licence_Number__c);   
                    mapTenderBidFirstName.put(bid.id,bid.Nominated_Contact_First_Name__c);
                    mapTenderBidLastName.put(bid.id,bid.Nominated_Contact_Last_Name__c);
                	mapTenderBidACN.put(bid.id,bid.ACN__c);
                    system.debug('mapTenderBidACN---------->'+mapTenderBidACN);    
            } else{
                   system.debug('bid.Primary_Joint_Holder__c ---------->'+bid.Primary_Joint_Holder__c );    

                 if( bid.Primary_Joint_Holder__c == 'Individual'){
                     	mapTenderBidDriverlicence.put(bid.id,bid.Driver_Licence_Number__c);
                     mapTenderBidIndividualAccountNoDriverlicence.put(bid.id,bid.Driver_Licence_Number__c);
                    	mapTenderBidFirstName.put(bid.id,bid.First_Name__c);
                    	mapTenderBidLastName.put(bid.id,bid.Last_Name__c);
                 } else {
                     	mapTenderBidDriverlicence.put(bid.id,bid.Nominated_Contact_Driver_Licence_Number__c); 
                      mapTenderBidIndividualAccountNoDriverlicence.put(bid.id,bid.Driver_Licence_Number__c);
                    	mapTenderBidFirstName.put(bid.id,bid.Nominated_Contact_First_Name__c);
                    	mapTenderBidLastName.put(bid.id,bid.Nominated_Contact_Last_Name__c);  
                 }
                
            }
        }
        system.debug('mapTenderBidDriverlicence---------->'+mapTenderBidDriverlicence);
         system.debug('mapTenderBidIndividualAccountNoDriverlicence---------->'+mapTenderBidIndividualAccountNoDriverlicence);
        
        system.debug('mapTenderBidFirstName---------->'+mapTenderBidFirstName);
        system.debug('mapTenderBidLastName---------->'+mapTenderBidLastName);
        system.debug('mapTenderBidACN---------->'+mapTenderBidACN);
        system.debug('mapTenderBidEmail---------->'+mapTenderBidEmail);
        system.debug('mapTenderBidPhone---------->'+mapTenderBidPhone);
        
        
        map<string,id> mapACNAcc = new map<string,id>();
        map<string,id> mapDriversLicenseAcc = new map<string,id>();
        
        if(!mapTenderBidACN.isEmpty()){
            
            
            //CORPORATE
            for(Account acc: [select id,ACN__c from Account where ACN__c IN: mapTenderBidACN.VALUES()]){
            mapACNAcc.put(acc.ACN__c,acc.Id );
        	}
            
            // Invidu account
           // Driving Lice Licence : 
           
            for(Account acc: [select id,Driver_Licence_Number__c from Account where Driver_Licence_Number__c IN: mapTenderBidIndividualAccountNoDriverlicence.VALUES()]){
            mapDriversLicenseAcc.put(acc.Driver_Licence_Number__c,acc.Id );
        	}
        }
        
        system.debug('mapACNAcc---------->'+mapACNAcc);
        
        
        for(Contact con:[select id,Australian_Driver_Licence_Number__c,accountId,firstname,lastname,email from contact where Australian_Driver_Licence_Number__c IN: mapTenderBidDriverlicence.VALUES() and lastname IN: mapTenderBidLastName.VALUES() ]){
            mapDriverlicencecontact.put(con.Australian_Driver_Licence_Number__c, con.id);  
            mapLastNamecontact.put(con.lastname, con.id);
            mapConAccID.put(con.id,con.accountId);
            
        }
 		system.debug('mapDriverlicencecontact---------->'+mapDriverlicencecontact);	    
        system.debug('mapLastNamecontact---------->'+mapLastNamecontact);	  
        
          for(Tender_Bid__c tenderbid : lstTenderbids){
              
              // if the contact is already exisiting with the drivers license provided
             // if(mapLastNamecontact.containskey(mapTenderBidLastName.get(tenderbid.id))){
              if(mapDriverlicencecontact.containskey( mapTenderBidDriverlicence.get(tenderbid.id))){
                  //tenderbid.Contact__c = mapDriverlicencecontact.get(mapTenderBidDriverlicence.get(tenderbid.id));
                 // lstTenderbidupdate.add(tenderbid);
                  system.debug('InsideCheck---------->');

                 // mapTenderBidContact.put(tenderbid.id,mapLastNamecontact.get(mapTenderBidLastName.get(tenderbid.id)));
                  mapTenderBidContact.put(tenderbid.id,mapDriverlicencecontact.get(mapTenderBidDriverlicence.get(tenderbid.id)));
                  
              }else{
                  contact conNew = new contact();
                  
                  if(tenderbid.Driver_Licence_Number__c != null){
                          conNew.Australian_Driver_Licence_Number__c = tenderbid.Driver_Licence_Number__c;
                  }else{
                          conNew.Australian_Driver_Licence_Number__c = tenderbid.Nominated_Contact_Driver_Licence_Number__c;
                  }
              
                  
                  conNew.Email = tenderbid.Contact_Email__c;
                  conNew.Phone = tenderbid.Business_Hours_Phone__c;
                  conNew.Contact_Type__c = 'General Contact';
                  
                  if( tenderbid.Entity__c  == 'Individual'){
                       conNew.FirstName = tenderbid.First_Name__c;
                       conNew.LastName = tenderbid.Last_Name__c;
                       conNew.Other_given_name__c = tenderbid.Other_Names__c;   
                        mapTenderBidwithNewContact.put(tenderbid.Driver_Licence_Number__c,tenderbid.id);
                      
                      	mapTenderBidLNwithNewContact.put(tenderbid.Last_Name__c,tenderbid.id);
                  		newContactdriverslicence.add(tenderbid.Driver_Licence_Number__c);
                      	newLastName.add(tenderbid.Last_Name__c);
                      
                      
                          if(mapDriversLicenseAcc.containskey(tenderbid.Driver_Licence_Number__c)){
                         conNew.accountId = mapDriversLicenseAcc.get(tenderbid.Driver_Licence_Number__c);
                      }
                      
                  } else if (tenderbid.Entity__c  == 'Corporation'){
                      conNew.FirstName = tenderbid.Nominated_Contact_First_Name__c;
                      conNew.LastName = tenderbid.Nominated_Contact_Last_Name__c;
                      conNew.Other_given_name__c = tenderbid.Nominated_Contact_Other_Names__c;
                      mapTenderBidwithNewContact.put(tenderbid.Nominated_Contact_Driver_Licence_Number__c,tenderbid.id);
                      mapTenderBidLNwithNewContact.put(tenderbid.Nominated_Contact_Last_Name__c,tenderbid.id);
                  	  newContactdriverslicence.add(tenderbid.Nominated_Contact_Driver_Licence_Number__c);
                      newLastName.add(tenderbid.Nominated_Contact_Last_Name__c);
                      
                      if(mapACNAcc.containskey(tenderbid.ACN__c)){
                         conNew.accountId = mapACNAcc.get(tenderbid.ACN__c);
                      } else {
                          mapACNNew.put(conNew.LastName + tenderbid.Nominated_Contact_Driver_Licence_Number__c ,tenderbid.ACN__c );
                          mapACNNewCorpName.put(conNew.LastName + tenderbid.Nominated_Contact_Driver_Licence_Number__c ,tenderbid.Corporation_Name__c );
                      }
                      
                  } else if (tenderbid.Entity__c  == 'Joint holders'){
                      if( tenderbid.Primary_Joint_Holder__c == 'Individual'){
                        conNew.FirstName = tenderbid.First_Name__c;
                       	conNew.LastName = tenderbid.Last_Name__c;
                       	conNew.Other_given_name__c = tenderbid.Other_Names__c; 
                          mapTenderBidwithNewContact.put(tenderbid.Driver_Licence_Number__c,tenderbid.id);
                          mapTenderBidLNwithNewContact.put(tenderbid.Last_Name__c,tenderbid.id);
                  		newContactdriverslicence.add(tenderbid.Driver_Licence_Number__c);
                          newLastName.add(tenderbid.Last_Name__c);
                          
                          if(mapDriversLicenseAcc.containskey(tenderbid.Driver_Licence_Number__c)){
                         conNew.accountId = mapDriversLicenseAcc.get(tenderbid.Driver_Licence_Number__c);
                      }
                          
                      } else if (tenderbid.Primary_Joint_Holder__c == 'Corporation'){
						conNew.FirstName = tenderbid.Nominated_Contact_First_Name__c;
                      	conNew.LastName = tenderbid.Nominated_Contact_Last_Name__c;
                      	conNew.Other_given_name__c = tenderbid.Nominated_Contact_Other_Names__c;      
                           mapTenderBidwithNewContact.put(tenderbid.Nominated_Contact_Driver_Licence_Number__c,tenderbid.id);
                          mapTenderBidLNwithNewContact.put(tenderbid.Nominated_Contact_Last_Name__c,tenderbid.id);
                  		newContactdriverslicence.add(tenderbid.Nominated_Contact_Driver_Licence_Number__c);
                          newLastName.add(tenderbid.Nominated_Contact_Last_Name__c);
                          
                          
                          if(mapDriversLicenseAcc.containskey(tenderbid.Nominated_Contact_Driver_Licence_Number__c)){
                         conNew.accountId = mapDriversLicenseAcc.get(tenderbid.Nominated_Contact_Driver_Licence_Number__c);
                      }else {
                          //mapACNNew.put(conNew.LastName + tenderbid.Nominated_Contact_Driver_Licence_Number__c ,tenderbid.ACN__c );
                          mapACNNewCorpName.put(conNew.LastName + tenderbid.Nominated_Contact_Driver_Licence_Number__c ,tenderbid.Corporation_Name__c );
                      } 
                          
                      }
                  }

                  lstContactInsert.add(conNew);
                
                
              }
            
        }
        system.debug('mapTenderBidContact------------->'+mapTenderBidContact);
        system.debug('mapTenderBidwithNewContact-------------------->'+mapTenderBidwithNewContact);
        system.debug('lstContactInsert-------------------->'+lstContactInsert);
        
        
         system.debug('mapACNNew------------------->'+mapACNNew);  
        
        
        if(!lstContactInsert.isEmpty()){
            insert lstContactInsert;
        }
        
       List<Account> lstAccountInsert = new List<Account>();
       Map<string,id> mapConFNLNID = new  Map<string,id>();
       List<Contact> lstConAccIDUpdate = new List<Contact>();
        
        List<ID> accountACNinserted = new List<ID>();
        
        id AcctenderRecTypeID = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Tender').getRecordTypeId();
         system.debug('AcctenderRecTypeID-------------------->'+AcctenderRecTypeID);
        
        if(!lstContactInsert.isEmpty() ){
            for(contact con: [SELECT id,Australian_Driver_Licence_Number__c,FirstName,LastName,accountId,account.Name from contact where Australian_Driver_Licence_Number__c IN: newContactdriverslicence and LastName IN: newLastName] ){
              system.debug('con.accountId-------------------->'+con.accountId);  
                
                 system.debug('mapACNNew------------------->'+mapACNNew);  
                if(con.accountId == null){
                    
                    if(!mapACNNew.containskey(con.LastName+con.Australian_Driver_Licence_Number__c) ){
                        Account Acc = new Account();
                        Acc.Name = con.FirstName +' '+con.LastName;
                        Acc.RecordTypeId = AcctenderRecTypeID;
                        Acc.OwnerID= u.id;
                        lstAccountInsert.add(Acc);
                        mapConFNLNID.put(con.FirstName +' '+con.LastName, con.id);
                    } else{
                        Account Acc = new Account();
                        Acc.Name = mapACNNewCorpName.get(con.LastName+con.Australian_Driver_Licence_Number__c);
                        Acc.ACN__c = mapACNNew.get(con.LastName+con.Australian_Driver_Licence_Number__c) ;
                        Acc.RecordTypeId = AcctenderRecTypeID;
                        Acc.OwnerID= u.id;
                        lstAccountInsert.add(Acc);
                        mapConFNLNID.put(mapACNNewCorpName.get(con.LastName+con.Australian_Driver_Licence_Number__c), con.id);
                    }
                
                } else {
                     mapConAccID.put(con.id ,con.accountId);
                    accountACNinserted.add(con.accountId);
                    mapConFNLNID.put(con.FirstName +' '+con.LastName, con.id);
                     mapConFNLNID.put(con.account.Name, con.id);
                }
                
               // mapTenderBidContact.put( mapTenderBidwithNewContact.get(con.Australian_Driver_Licence_Number__c),con.id);
                
                if(!mapTenderBidContact.containskey( mapTenderBidLNwithNewContact.get(con.LastName))){
                    mapTenderBidContact.put( mapTenderBidLNwithNewContact.get(con.LastName),con.id);
                }
                
         
               
               // Tender_Bid__c tenderbid = new Tender_Bid__c(id = mapTenderBidwithNewContact.get(con.Australian_Driver_Licence_Number__c));
               // tenderbid.Contact__c = con.id;
                //lstTenderbidupdate.add(tenderbid);
            }
        }
        system.debug('mapTenderBidContact------------->'+mapTenderBidContact);
         system.debug('lstAccountInsert------------->'+lstAccountInsert);
         system.debug('mapConFNLNID------------->'+mapConFNLNID);
        
        if(!lstAccountInsert.isEmpty()){
            insert lstAccountInsert;
        }
        
        
        
         if(!lstAccountInsert.isEmpty()){
                for(Account acc : [Select Name from Account where ID IN: lstAccountInsert or ID IN: accountACNinserted ]){
                    system.debug('acc------------->'+acc);
                    
            system.debug('acc.Name------------->'+acc.Name);
                    
                    contact con = new contact (ID= mapConFNLNID.get(acc.Name));
                    con.AccountId= acc.ID;
                    lstConAccIDUpdate.add(con);
                    mapConAccID.put(mapConFNLNID.get(acc.Name),acc.id);
                    
                }
                 system.debug('lstConAccIDUpdate------------->'+lstConAccIDUpdate);
              system.debug('mapConAccID------------->'+mapConAccID);
             
             if(!lstConAccIDUpdate.isEmpty()){
                 update lstConAccIDUpdate;
             }
         }
        
        List <Tender_Bid__c> lstTenderBidToUpdate = new List<Tender_Bid__c>();
       try{
             if(!mapTenderBidContact.isEmpty()){
                 
                 for(Tender_Bid__c tendbidupdate : [select id,Contact__c from Tender_Bid__c where id IN: mapTenderBidContact.keySet()]){
               		 tendbidupdate.Contact__c = mapTenderBidContact.get(tendbidupdate.id);
                      tendbidupdate.Account__c = mapConAccID.get(mapTenderBidContact.get(tendbidupdate.id));
                     lstTenderBidToUpdate.ADD(tendbidupdate);
                 }
             }
            system.debug('lstTenderBidToUpdate------------->'+lstTenderBidToUpdate);
           if(!lstTenderBidToUpdate.isEmpty()){
               update lstTenderBidToUpdate;
           }
        } catch(exception ex){
            system.debug('Exception occured during the contact Info update on Tender Bid--------->'+ex);
        } 
      
    }
    
}