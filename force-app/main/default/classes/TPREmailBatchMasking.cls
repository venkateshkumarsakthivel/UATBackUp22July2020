public class TPREmailBatchMasking implements Database.Batchable<SObject> {
    
    
    //Tax_Payer_Registration__c.Levy_Contact_Email__c
   //Tax_Payer_Registration__c.Applicant_Email_Address__c
    Map<Id,Tax_Payer_Registration__c> updateTPRrecord= new map<Id,Tax_Payer_Registration__c>();
    
   
    public Database.QueryLocator start( Database.BatchableContext context ) {
        return Database.getQueryLocator( 'select Id, Levy_Contact_Email__c, Applicant_Email_Address__c from Tax_Payer_Registration__c' );
    }
    
    public void execute( Database.BatchableContext context, List<Tax_Payer_Registration__c> NoticerecordList ) {
        
         
        
        for(Tax_Payer_Registration__c acc : NoticerecordList){
            
           if(acc.Levy_Contact_Email__c!=null){
                 acc.Levy_Contact_Email__c= acc.Levy_Contact_Email__c.substringBefore('@') + '=' +   acc.Levy_Contact_Email__c.substringAfter('@') + '@example.com';
                updateTPRrecord.put(acc.Id,acc);
                
            } 
            if(acc.Applicant_Email_Address__c!=null) {
                acc.Applicant_Email_Address__c= acc.Applicant_Email_Address__c.substringBefore('@') + '=' +   acc.Applicant_Email_Address__c.substringAfter('@') + '@example.com';
              updateTPRrecord.put(acc.Id,acc);
            }
            
                       
        }
        if(updateTPRrecord.Size() > 0)
            update updateTPRrecord.values();
        system.debug(updateTPRrecord.Size());
        
    }
    
    public void finish( Database.BatchableContext context ) {
        
    }
    
}