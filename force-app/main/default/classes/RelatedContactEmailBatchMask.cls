public class RelatedContactEmailBatchMask implements Database.Batchable<SObject> {
    
    List<Related_Contact__c> updateContacts = new List<Related_Contact__c>();
    public Database.QueryLocator start( Database.BatchableContext context ) {
        return Database.getQueryLocator( 'SELECT Id, email__c from Related_Contact__c' );
    }
    
    public void execute( Database.BatchableContext context, List<Related_Contact__c> contactList ) {
        
        for(Related_Contact__c con : contactList){
            if(con.email__c!=null) {
                con.email__c= con.email__c.substringBefore('@') + '=' +   con.email__c.substringAfter('@') + '@example.com';
                updateContacts.add(con);
            }
        }
        if(updateContacts.Size() > 0)
            update updateContacts;
        system.debug(updateContacts.Size());
        
    }
    
    public void finish( Database.BatchableContext context ) {
        
    }
}