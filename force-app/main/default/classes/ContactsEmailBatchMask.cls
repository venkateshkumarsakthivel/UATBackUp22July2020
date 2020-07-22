public class ContactsEmailBatchMask implements Database.Batchable<SObject> {
    
    List<Contact> updateContacts = new List<Contact>();
    public Database.QueryLocator start( Database.BatchableContext context ) {
        return Database.getQueryLocator( 'SELECT Id, email from contact' );
    }
    
    public void execute( Database.BatchableContext context, List<Contact> contactList ) {
        
        for(Contact con : contactList){
            if(con.Email!=null) {
                con.Email= con.Email.substringBefore('@') + '=' +   con.Email.substringAfter('@') + '@example.com';
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