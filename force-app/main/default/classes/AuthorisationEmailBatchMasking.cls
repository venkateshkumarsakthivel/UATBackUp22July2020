public class AuthorisationEmailBatchMasking implements Database.Batchable<SObject> {
    
    List<Authorisation__c> updateAuthList = new List<Authorisation__c>();
    public Database.QueryLocator start( Database.BatchableContext context ) {
        return Database.getQueryLocator( 'SELECT Id, Service_Provider_Notice_Email__c FROM Authorisation__c where Service_Provider_Notice_Email__c!=null' );
    }
    
    public void execute( Database.BatchableContext context, List<Authorisation__c> authList ) {
        
        for(Authorisation__c auth : authList){
            if(auth.Service_Provider_Notice_Email__c!=null) {
                auth.Service_Provider_Notice_Email__c= auth.Service_Provider_Notice_Email__c.substringBefore('@') + '=' +   auth.Service_Provider_Notice_Email__c.substringAfter('@') + '@example.com';
                updateAuthList.add(auth);
            }
        }
        if(updateAuthList.Size() > 0)
            update updateAuthList;
        system.debug(updateAuthList.Size());
        
    }
    
    public void finish( Database.BatchableContext context ) {
        
    }
}