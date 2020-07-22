global class TenderBidCheckPaymentBatch implements Database.Batchable<sObject>,Database.Stateful
{
    
    global  List<Tender_Bid__c> lstBidupdatedeclined  = new List<Tender_Bid__c>();
    global List<String> exception_List;
    global String strError= null;
    
    global Database.QueryLocator start(Database.BatchableContext BC)
    {
     String query = 'SELECT Id,No_of_Days_from_Offered__c,Offered_Date__c,Tender__r.Licence_Payment_within_days__c,Bid_Status__c FROM Tender_Bid__c where Bid_Status__c = \'' +  'Offered' + '\' and Tender__c != null and No_of_Days_from_Offered__c != null';
        system.debug('query --------------->'+query );
        return Database.getQueryLocator(query);
    }
    
     global void execute(Database.BatchableContext BC, List<Tender_Bid__c> scope)
    {
        for ( Tender_Bid__c bid : scope)
        {
          if(bid.No_of_Days_from_Offered__c > bid.Tender__r.Licence_Payment_within_days__c){
              bid.Bid_Status__c = 'Declined';
              bid.Bid_Comments__c = 'The Bid had been offered on ' + bid.Offered_Date__c + ' and the number of days with in the payment had to be made is' + bid.Tender__r.Licence_Payment_within_days__c + ' movind the bid status to declined on'+ System.today(); 
              
              lstBidupdatedeclined.add(bid);
        }

        }
    }
    
    global void finish(Database.BatchableContext BC)
    {
        system.debug('lstBidupdatedeclined Count----------->'+lstBidupdatedeclined.size());
        
        if(!lstBidupdatedeclined.isEmpty()){
            Database.SaveResult[] SaveResultList = Database.update(lstBidupdatedeclined,false);  
            for(integer i =0; i<lstBidupdatedeclined.size();i++){
                    String msg='';
                    If(!SaveResultList[i].isSuccess()){
                            msg += 'Error: "';        
                            for(Database.Error err: SaveResultList[i].getErrors()){  
                                 msg += err.getmessage()+'"\n\n';   
                        } 
                    }
                    if(msg!='')
                        exception_List.add(msg);
                        strError =  msg;
            } 
            
        // Mailing the error list   
        
        if(!exception_List.isEmpty()){
            Messaging.EmailFileAttachment csvAttc = new Messaging.EmailFileAttachment();
             blob csvBlob = Blob.valueOf(strError);
             string csvname= 'Error.xls';
             csvAttc.setFileName(csvname);
             csvAttc.setBody(csvBlob);
             Messaging.SingleEmailMessage email =new Messaging.SingleEmailMessage();
            
             String subject ='Error on Tender Bid Payment Decline';
             email.setSubject(subject);
            
             email.toAddresses = new String[] { 'venkatesh.sakthivel@transport.nsw.gov' };
                
            
             email.setPlainTextBody('Error occured during the batch run on Tender Bid Offered payment pending on 21 days batch');
             email.setFileAttachments(new Messaging.EmailFileAttachment[]{csvAttc});
             Messaging.SendEmailResult [] r = Messaging.sendEmail(new Messaging.SingleEmailMessage[] {email});
        }
             
        }
    }
    
        
}