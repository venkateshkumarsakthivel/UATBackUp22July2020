public class NoticerecordEmailBatchMasking implements Database.Batchable<SObject> {
    
    //List<Account> updateAccounts = new List<Account>();
    
    Map<Id,Notice_record__c> updateNoticerecord= new map<Id,Notice_record__c>();
    
   
    public Database.QueryLocator start( Database.BatchableContext context ) {
        return Database.getQueryLocator( 'select Id, Issued_to_Email__c, Auditor_Email__c from Notice_record__c' );
    }
    
    public void execute( Database.BatchableContext context, List<Notice_record__c> NoticerecordList ) {
        
         
        
        for(Notice_record__c acc : NoticerecordList){
            
           if(acc.Issued_to_Email__c!=null){
                 acc.Issued_to_Email__c= acc.Issued_to_Email__c.substringBefore('@') + '=' +   acc.Issued_to_Email__c.substringAfter('@') + '@example.com';
                updateNoticerecord.put(acc.Id,acc);
                
            } 
            if(acc.Auditor_Email__c!=null) {
                acc.Auditor_Email__c= acc.Auditor_Email__c.substringBefore('@') + '=' +   acc.Auditor_Email__c.substringAfter('@') + '@example.com';
              updateNoticerecord.put(acc.Id,acc);
            }
            
                       
        }
        if(updateNoticerecord.Size() > 0)
            update updateNoticerecord.values();
        system.debug(updateNoticerecord.Size());
        
    }
    
    public void finish( Database.BatchableContext context ) {
        
    }
    
}