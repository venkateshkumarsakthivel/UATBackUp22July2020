public class CasesEmailBatchmask implements Database.Batchable<SObject> {
    
    Map<Id,Case> updatecases= new map<Id,Case>();
    public Database.QueryLocator start( Database.BatchableContext context ) {
        String quey = 'SELECT Id, Email_For_Customer_Contact__c, Email__c, Notice_Email__c, SuppliedEmail,Buyer_email__c FROM Case';
        
        //system.debug('quey>>>>'+quey);
        
         return Database.getQueryLocator(quey);
    }
    
    public void execute( Database.BatchableContext context, List<Case> CaseList ) {
        
        for(Case c : CaseList){
            
            if(c.Email_For_Customer_Contact__c!=null && !c.Email_For_Customer_Contact__c.contains('%@example.com%')){
                c.Email_For_Customer_Contact__c= c.Email_For_Customer_Contact__c.substringBefore('@') + '=' +   c.Email_For_Customer_Contact__c.substringAfter('@') + '@example.com';
                updatecases.put(c.Id,c);
            }
            
            if(c.Email__c!=null && !c.Email__c.contains('%@example.com%')){
                c.Email__c= c.Email__c.substringBefore('@') + '=' +   c.Email__c.substringAfter('@') + '@example.com';
                updatecases.put(c.Id,c);
            }
            
            if(c.Notice_Email__c!=null && !c.Notice_Email__c.contains('%@example.com%')){
                c.Notice_Email__c= c.Notice_Email__c.substringBefore('@') + '=' +   c.Notice_Email__c.substringAfter('@') + '@example.com';
                updatecases.put(c.Id,c);
            }
            if(c.SuppliedEmail!=null && !c.SuppliedEmail.contains('%@example.com%')){
                c.SuppliedEmail= c.SuppliedEmail.substringBefore('@') + '=' +   c.SuppliedEmail.substringAfter('@') + '@example.com';
                updatecases.put(c.Id,c);
            } 
            if(c.Buyer_email__c!=null && !c.Buyer_email__c.contains('%@example.com%')){
                c.Buyer_email__c= c.Buyer_email__c.substringBefore('@') + '=' +   c.Buyer_email__c.substringAfter('@') + '@example.com';
                updatecases.put(c.Id,c);
            } 
            
        }
        if(updatecases.Size() > 0)
            update updatecases.Values();
        
    }
    
    public void finish( Database.BatchableContext context ) {
        
    }
}