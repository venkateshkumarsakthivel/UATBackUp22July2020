public class TenderBidTriggerHandler {
     public static void afterInsert(List<Tender_Bid__c> newTender) {
        //ExisitingAccountContactCheck checkAccCon = new ExisitingAccountContactCheck();
        //checkAccCon.checkExisitngAccountContactinfo(newTender);
      }
    
     public static void beforeInsert(List<Tender_Bid__c> newTender) {
        // get Address information
         for(Tender_Bid__c tenbid : newTender){
             system.debug('tenbid.Tender_Address__c--------------->'+tenbid.Tender_Address__c);
             if(tenbid.Tender_Address__c != null){
                 
                 String[] arrTest = tenbid.Tender_Address__c.split(',');
                 
                    tenbid.Mailing_Street__c = arrTest[0];
                 system.debug('arrTest--------------->'+arrTest);
                  system.debug(' arrTest[1]--------------->'+ arrTest[1]);
                  String[] arrTestspace = arrTest[1].split(' ');
                 
					//tenbid.Mailing_City__c = arrTestspace[0];
                    //tenbid.Mailing_State__c =  arrTestspace[1];
                    //tenbid.Mailing_Postal_Code__c  =  arrTestspace[2];         
                 
                 integer listsize = arrTestspace.size();
                   system.debug('listsize--------------->'+listsize);
                 tenbid.Mailing_Postal_Code__c  =  arrTestspace[listsize-1];  
                 tenbid.Mailing_State__c =  arrTestspace[listsize-2];
                 
                 string[] splitted = arrTest[1].split( arrTestspace[listsize-2]);
				system.debug('part1:: = ' + splitted[0] );  
                 
                 tenbid.Mailing_City__c = splitted[0];
                 
                 
                    system.debug('arrTestspace--------------->'+arrTestspace);
             }
             
         }
      }
    
    
     public static void afterUpdate(List<Tender_Bid__c> newTenderBids, map<id,Tender_Bid__c> mapTenderBidOld) {
        //ExisitingAccountContactCheck checkAccCon = new ExisitingAccountContactCheck();
        //checkAccCon.checkExisitngAccountContactinfo(newTender);
        List<Tender_Bid__c> lstTenderBidAccConCheckList = new  List<Tender_Bid__c>();
         
         for(Tender_Bid__c tendBid:newTenderBids ){
             if(tendBid.Bid_Status__c  != mapTenderBidOld.get(tendBid.id).Bid_Status__c  && tendBid.Bid_Status__c  == 'Offered'){
                 lstTenderBidAccConCheckList.add(tendBid);
             }
         }
         
         system.debug('lstTenderBidAccConCheckList------>'+lstTenderBidAccConCheckList);
         
         if(!lstTenderBidAccConCheckList.isEmpty()){
           	//ExisitingAccountContactCheck checkAccCon = new ExisitingAccountContactCheck();
        //	ExisitingAccountContactCheck.checkExisitngAccountContactinfo(lstTenderBidAccConCheckList);
         }
         
      }
    
}