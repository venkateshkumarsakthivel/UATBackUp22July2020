public class TenderCreateAuthorisation {
    
    public static void createAuthorisation(List<case> lstCase) {
    system.debug('lstCase--------------->'+lstCase);
     try {
		Map<ID,List<Authorisation__c>> mapCaseListAuth = new Map<ID,List<Authorisation__c>>();
		List<Authorisation__c> authorisationUpsert =  new List<Authorisation__c>();
	
	Id taxiAuthorisationRecordTypeId = Schema.SObjectType.Authorisation__c.getRecordTypeInfosByName().get(GlobalConstants.TAXI_LICENCE_AUTHORISATION).getRecordTypeId();	

	map <string,Taxi_Class__mdt> mapTaxiClass= new map<string,Taxi_Class__mdt>();

	for(Taxi_Class__mdt tsxClass: [select Licence_Class__c, Is_Renewable__c from Taxi_Class__mdt ] ){
		mapTaxiClass.put(tsxClass.Licence_Class__c,tsxClass);
		
	}
							  
	for(Case applicationCase: lstCase){
        if(applicationCase.Tender_Bid__c != null && applicationCase.Tender__c !=null ){
							Authorisation__c authorisation = new Authorisation__c();

								authorisation.Application__c = applicationCase.Id;
							   authorisation.Authorisation_Type__c = GlobalConstants.AUTHORISATION_TYPE_TAXI_LICENCE;
							   authorisation.Service_Provider__c = applicationCase.AccountId;
							   authorisation.Status__c = GlobalConstants.AUTHORISATION_STATUS_NEW;
							   //authorisation.Start_Date__c = System.today();
							   //authorisation.End_Date__c = System.today().addYears(Integer.valueOf(Label.Default_Taxi_Term_period));
							   authorisation.Service_Provider_Notice_Email__c = applicationCase.Notice_Email__c;
							   authorisation.SNSW_Plate_Pickup_Location__c = applicationCase.SNSW_Plate_Pickup_Location__c;
							   authorisation.Existing_Plate_Number__c = applicationCase.Existing_Plate_Number__c;
							   authorisation.RecordTypeId = taxiAuthorisationRecordTypeId;
							   authorisation.Licence_Fee__c = applicationCase.Licence_Fee_Due__c;
							   authorisation.Operating_Locations__c = applicationCase.Operating_Locations__c;
							   authorisation.Operation_Area__c = applicationCase.Operation_Area__c;
							   authorisation.Licence_Class__c = applicationCase.Licence_Class__c;
							   authorisation.Licence_Type__c = applicationCase.Licence_Type__c;
           	  
							   if (authorisation.Licence_Class__c != null){   
								if(mapTaxiClass.containskey(authorisation.Licence_Class__c)){
									if(mapTaxiClass.get(authorisation.Licence_Class__c).Is_Renewable__c == 'yes' && authorisation.Licence_Fee__c != 0){
										  authorisation.Payment_Frequency__c = 'At Renewal';   
									  }
									  else{
										  authorisation.Payment_Frequency__c = 'Not Applicable'; 
									  }
								}
							   
							   }else if(authorisation.Licence_Fee__c == 0){
								authorisation.Payment_Frequency__c = 'Not Applicable';										   
						  
								}
								authorisationUpsert.add(authorisation);
    	}
     } 
	 system.debug('authorisationUpsert---------------------->'+authorisationUpsert);
	 
	 upsert authorisationUpsert;  
         
         List<Case> lstUpdateAuthIDbacktoCase = new List<Case>();
         
         for(Authorisation__c auth: [Select id,Application__c from Authorisation__c where ID IN:authorisationUpsert]){
             case cas = new case();
             cas.Id = auth.Application__c;
             cas.Authorisation__c= auth.Id;
             lstUpdateAuthIDbacktoCase.add(cas);
         }         
         
         if(!lstUpdateAuthIDbacktoCase.isEmpty()){
             update lstUpdateAuthIDbacktoCase;
         }
         
        
     }catch(exception e){
		 System.debug('Exception: '+e);
      ApplicationLogUtility.logMessage(GlobalConstants.ERROR, 'TaxiFormSectionDataController', 'createAuthorisation', e.getMessage(), e);
	}
	
}
}