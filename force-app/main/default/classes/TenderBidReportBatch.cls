global class TenderBidReportBatch implements Database.Batchable<sObject> {

public string query = 'select Id,Tender_Number__c,CreatedById from Tender__c where isTenderOpen__c = true';

global database.querylocator start(Database.BatchableContext BC)
{
    return Database.getQueryLocator(query);
}

global void execute(Database.BatchableContext BC, list<Tender__c> scope)
{   
    SYSTEM.DEBUG('scope--------------->'+scope);
// String[] addr = new String[]{'Venkatesh.Sakthivel@transport.nsw.gov.au','Srikanth.Sunkara@transport.nsw.gov.au'}; // max 10 addresses
String[] addr = new String[]{'Venkatesh.Sakthivel@transport.nsw.gov.au'};
    
EmailTemplate template = [SELECT id, HtmlValue from EmailTemplate where ID ='00X0k000000dods'];

SYSTEM.DEBUG('template--------------->'+template);
    
	for (AggregateResult ar: [SELECT Bid_Status__c status, COUNT(Id) cnt
         FROM Tender_Bid__c WHERE Tender__c =: scope[0].ID GROUP BY Bid_Status__c ]) {
			 
        system.debug('ar---->'+  ar);
        SYSTEM.DEBUG('AR---->'+String.valueOf(ar.get('cnt')));
        system.debug('status--->'+ar.get('status'));
		
		 Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
                        email.setToAddresses(addr);
                        email.setSaveAsActivity(false);
                        email.setTargetObjectId(scope[0].CreatedById);
                        email.setTemplateId(template.ID);
                        //email.setWhatId(scope[0].ID);
						
						String htmlBody = template.HtmlValue; 
						htmlBody = htmlBody.replace('{!Tender__c.Tender_Number__c}', scope[0].Tender_Number__c);
						
             			if(String.valueOf(ar.get('status')) == 'Draft'){
                            system.debug('Inside Draft');
                             htmlBody = htmlBody.replace('{!Tender__c.Total_BIDS_Draft__c}', String.valueOf(ar.get('cnt')));
                         } else if (String.valueOf(ar.get('status')) == 'Submitted'){
                             system.debug('Submitted');
                             htmlBody = htmlBody.replace('{!Tender__c.Total_BIDS_Submitted__c}', String.valueOf(ar.get('cnt')));
                         } 
			
						system.debug(htmlBody);
						
						//mail.setHtmlBody(htmlBody);
						//mail.setPlainTextBody(htmlBody);
			
						email.setBccSender(false);
						email.setUseSignature(false);
						email.setSaveAsActivity(false);
			
        Messaging.sendEmail(new Messaging.SingleEmailMessage[] {email});
						 
    } 
	
}

global void finish(Database.BatchableContext BC) {

}
}