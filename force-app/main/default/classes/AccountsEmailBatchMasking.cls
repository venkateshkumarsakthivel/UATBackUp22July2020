public class AccountsEmailBatchMasking implements Database.Batchable<SObject> {
    
    //List<Account> updateAccounts = new List<Account>();
    
    Map<Id,Account> updateAccounts= new map<Id,Account>();
    
   
    public Database.QueryLocator start( Database.BatchableContext context ) {
        return Database.getQueryLocator( 'select Id, Notice_Email__c, Email__c,email_for_customer_Contact__c from Account' );
    }
    
    public void execute( Database.BatchableContext context, List<Account> accList ) {
        
         
        
        for(Account acc : accList){
            
           if(acc.Notice_Email__c!=null){
                 acc.Notice_Email__c= acc.Notice_Email__c.substringBefore('@') + '=' +   acc.Notice_Email__c.substringAfter('@') + '@example.com';
                updateAccounts.put(acc.Id,acc);
                
            } 
            if(acc.Email__c!=null) {
                acc.Email__c= acc.Email__c.substringBefore('@') + '=' +   acc.Email__c.substringAfter('@') + '@example.com';
              updateAccounts.put(acc.Id,acc);
            }
            if(acc.email_for_customer_Contact__c!=null){
                acc.email_for_customer_Contact__c= acc.email_for_customer_Contact__c.substringBefore('@') + '=' +   acc.email_for_customer_Contact__c.substringAfter('@') + '@example.com';
              updateAccounts.put(acc.Id,acc);
                
            }
                       
        }
        if(updateAccounts.Size() > 0)
            update updateAccounts.values();
        system.debug(updateAccounts.Size());
        
    }
    
    public void finish( Database.BatchableContext context ) {
        
    }
    
}