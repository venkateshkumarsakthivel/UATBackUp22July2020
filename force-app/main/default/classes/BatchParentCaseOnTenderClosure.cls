global class BatchParentCaseOnTenderClosure implements Database.Batchable<sObject>{
    global final String Query;
   public static final String ERROR ='Error';//logging level
    
    //Constructor
    global BatchParentCaseOnTenderClosure() {
        Datetime dateGMT=System.now();  
        Datetime d1=Date.valueOf(dateGMT);
        string dateTimeFormat =d1.format('yyyy-MM-dd');
        
        //dateGMT.format('yyyy-MM-dd\'T\'HH:mm:ss')
        //
        
        try{ // Fetch those Authorisation records whose Application status is 'Withdrawn'. 
            Query = 'SELECT Id, End_DateTime__c , Extension_DateTime__c ,isTenderOpen__c , Tender_Status__c, isParentCasePresent__c, Tender_Case__c   FROM Tender__c  WHERE (End_DateTime__c <= : dateGMT'+
                    ' OR Extension_DateTime__c <= : dateGMT' +
                 	' ) AND isParentCasePresent__c  = false ' +
                	' AND Tender_Case__c  = NULL';
            
            system.debug('Query---------------->'+Query);
            
        } catch (Exception ex) {
            ApplicationLogUtility.logMessage(ERROR,'BatchParentCaseOnTenderClosure','BatchParentCaseOnTenderClosure',ex.getMessage(),ex);
        }
        
    }
    
    //Start method
    global Database.QueryLocator start(Database.BatchableContext BC){
        system.debug('Query---------------->'+Query);
        Datetime dateGMT=System.now(); 
        return Database.getQueryLocator(Query);
    }
    
    //Execute method
    global void execute(Database.BatchableContext BC, List<Tender__c> scope) {
        List<Tender__c> tenderParentCasecreationUpdate = new List<Tender__c>();
        List<Tender_Bid__c> lstTenderBidlistSorting = new List<Tender_Bid__c>();
        List<Tender_Order__c> lstOrdupdate = new List<Tender_Order__c>();
        List<Tender_Bid_Partner__c> lstBidPartneupdate = new List<Tender_Bid_Partner__c>();
        
        try{
           
            for(Tender__c ten: scope){
                if(ten.Tender_Status__c == 'Closed' &&  ten.isTenderOpen__c == false ){
                    ten.isParentCasePresent__c = true;
                    tenderParentCasecreationUpdate.add(ten);
                }
            }
            system.debug('tenderParentCasecreationUpdate----------->'+tenderParentCasecreationUpdate);
            
            if(!tenderParentCasecreationUpdate.isEmpty()){
                update tenderParentCasecreationUpdate;

                 for(Tender_Bid__c  tendbid : [select ID, isSharingOpen__c  from Tender_Bid__c where Tender__c IN: tenderParentCasecreationUpdate and isSharingOpen__c  = false]){
                     tendbid.isSharingOpen__c  = true;
                     lstTenderBidlistSorting.add(tendbid);
                 }
                
                 system.debug('lstTenderBidlistSorting---------------->'+lstTenderBidlistSorting);
                
                if(!lstTenderBidlistSorting.isEmpty()){
                    update lstTenderBidlistSorting;
                 for(Tender_Order__c  lstOrder : [Select ID,isSharingOpen__c  from Tender_Order__c  where Tender_Bid__c  IN: lstTenderBidlistSorting and isSharingOpen__c = false]){
                lstOrder.isSharingOpen__c  = true;
                lstOrdupdate.add(lstOrder);
            	}
            
            	for(Tender_Bid_Partner__c  lstBidPartner : [select id, isOffered__c from Tender_Bid_Partner__c  where Tender_Bid__c  IN: lstTenderBidlistSorting and isSharingOpen__c = false]){
                lstBidPartner.isSharingOpen__c = true;
                lstBidPartneupdate.add(lstBidPartner);
            	}
                    
                    if(!lstOrdupdate.isEmpty()){
                        update lstOrdupdate;
                    }
                    
                    if(!lstBidPartneupdate.isEmpty()){
                        update lstBidPartneupdate;
                    }
                    
                }

            
            }
  
        }catch (Exception ex) {
            ApplicationLogUtility.logMessage(ERROR,'BatchForAuthExpiration','execute',ex.getMessage(),ex);
        }
    }
    
    //Finish method
    global void finish(Database.BatchableContext BC){
        
    }

}