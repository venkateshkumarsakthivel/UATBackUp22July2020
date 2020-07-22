public class TenderTopBidSelectionController {
	@AuraEnabled
    public static string calculateTopBidders( String tenderID) {
        string str;
        Id parentCaseId;
        integer getbidCount;
        List<Tender_Order__c > lstOrdupdate = new List<Tender_Order__c > ();
        List<Tender_Bid_Partner__c > lstBidPartneupdate = new List<Tender_Bid_Partner__c >();
        
        
        List<Tender_Bid__c> lstTendBidOffered = new List<Tender_Bid__c>();
        system.debug('tenderID---------------->'+tenderID);
        
        Tender__c ten = [Select ID, No_of_Top_Bidders_Required__c, isOffered__c, Tender_Case__c,Tender_Status__c  from Tender__c where ID =: tenderID];
        
        if(ten.Tender_Case__c != null ){
            parentCaseId = ten.Tender_Case__c;
        }
   system.debug('ten---------------->'+ten);
        if(ten.isOffered__c  == true){
             
            List<Tender_Bid__c> lstTenderBidlistSorting = [select ID, Bid_Amount__c,Bid_Status__c ,createddate from Tender_Bid__c where Tender__c =:tenderID and Bid_Status__c = 'Reserved'  ];
        	system.debug('lstTenderBidlistSorting---------------->'+lstTenderBidlistSorting);
        
            if(!lstTenderBidlistSorting.isEmpty()){
            for (Tender_Bid__c tenBid : lstTenderBidlistSorting){
            
            tenBid.Bid_Status__c = 'Offered';
            lstTendBidOffered.add(tenBid);
        		}
        
        if(!lstTendBidOffered.isEmpty()){
           update lstTendBidOffered; 
           // str = string.valueof(lstTendBidOffered.size());
           str = 'Reserved Tender Bid are made Offered!';
           
        }
            }else{
                str = 'BID already offered!';
            }
          
             //throw new AuraHandledException('BID already offered!'); 
        }else if(ten.Tender_Status__c != 'Closed'){
          str = 'Tender is Not Closed Yet!';
        }else{
        getbidCount= integer.valueof(ten.No_of_Top_Bidders_Required__c);
        ten.isOffered__c  = true;
        
        map<integer,datetime> maptendatetime = new  map<integer,datetime>();
        List<Tender_Bid__c> lstTenderBidlistSorting = [select ID, Bid_Amount__c,Bid_Status__c ,createddate from Tender_Bid__c where Tender__c =:tenderID and Bid_Status__c = 'Submitted' ORDER BY Bid_Amount__c DESC, createddate DESC LIMIT: getbidCount ];
        system.debug('lstTenderBidlistSorting---------------->'+lstTenderBidlistSorting);
        
        for (Tender_Bid__c tenBid : lstTenderBidlistSorting){
            
            tenBid.Bid_Status__c = 'Offered';
            lstTendBidOffered.add(tenBid);
        }
        
        if(!lstTendBidOffered.isEmpty()){
           update lstTendBidOffered; 
            str = string.valueof(lstTendBidOffered.size());
            
           // str = string.valueof(getbidCount);

            for(Tender_Order__c  lstOrder : [Select ID,isOffered__c from Tender_Order__c  where Tender_Bid__c  IN: lstTenderBidlistSorting]){
                lstOrder.isOffered__c = true;
                lstOrdupdate.add(lstOrder);
            }
            
            for(Tender_Bid_Partner__c  lstBidPartner : [select id, isOffered__c from Tender_Bid_Partner__c  where Tender_Bid__c  IN: lstTenderBidlistSorting]){
                lstBidPartner.isOffered__c = true;
                lstBidPartneupdate.add(lstBidPartner);
            }
            
            if(!lstOrdupdate.isEmpty()){
                update lstOrdupdate;
            }
            
            if(!lstBidPartneupdate.isEmpty()){
                update lstBidPartneupdate;
            }
            
            // invite the applicants
           // if(parentCaseId != null ){
             //  InviteTaxiApplicantController.processAccountForCase(parentCaseId);
          //  }
            
        }else{
            str = 'No Bids Found';
        }
        
        update ten;
        }
         system.debug('str---------------->'+str);
        return str;
    }

    @AuraEnabled
    public static string inviteBidders( String tenderID) {
            system.debug('tenderID---------------->'+tenderID);
        string strResponse;
         List<Tender_Bid__c> lstTendBidOffered = new List<Tender_Bid__c>();
        Id parentCaseId;
        Tender__c ten = [Select ID, No_of_Top_Bidders_Required__c, isOffered__c, isInvited__c,Tender_Case__c, Tender_Status__c    from Tender__c where ID =: tenderID];

        if(ten.Tender_Status__c == 'Closed'){
            if(ten.isOffered__c == true){
                            if(ten.isInvited__c == false){
                                 List<Tender_Bid__c> lstTenderBidlistSorting = [select ID, Bid_Amount__c,Bid_Status__c ,createddate, isInvited__c  from Tender_Bid__c where Tender__c =:tenderID and Bid_Status__c = 'Offered' ];
        						system.debug('lstTenderBidlistSorting---------------->'+lstTenderBidlistSorting);
                                	  for (Tender_Bid__c tenBid : lstTenderBidlistSorting){
            
                                            tenBid.isInvited__c = true;
                                            lstTendBidOffered.add(tenBid);
                                        }
                                system.debug('lstTendBidOffered---------------->'+lstTendBidOffered);
                                 if(!lstTendBidOffered.isEmpty()){
           								update lstTendBidOffered; 
                                 }
                                
                                
                                    if(ten.Tender_Case__c != null ){
                                        parentCaseId = ten.Tender_Case__c;
                                    }
                                    // invite the applicants
                                        if(parentCaseId != null ){
                                           InviteTaxiApplicantController.processAccountForCase(parentCaseId);
                                            strResponse = 'Successfully Invited';
                                            ten.isInvited__c = true;
                                            update ten;
                                        }
                                        
                        }else{
                            List<Tender_Bid__c> lstTenderBidlistSorting = [select ID, Bid_Amount__c,Bid_Status__c ,createddate, isInvited__c  from Tender_Bid__c where Tender__c =:tenderID and Bid_Status__c = 'Offered' and isInvited__c = false];
        						system.debug('lstTenderBidlistSorting---------------->'+lstTenderBidlistSorting);
                            
                            if(!lstTenderBidlistSorting.isEmpty()){
                                	  for (Tender_Bid__c tenBid : lstTenderBidlistSorting){
            
                                            tenBid.isInvited__c = true;
                                            lstTendBidOffered.add(tenBid);
                                        }system.debug('lstTendBidOffered---------------->'+lstTendBidOffered);
                                 if(!lstTendBidOffered.isEmpty()){
           								update lstTendBidOffered; 
                                 }
                                
                                
                                    if(ten.Tender_Case__c != null ){
                                        parentCaseId = ten.Tender_Case__c;
                                    }
                                    // invite the applicants
                                        if(parentCaseId != null ){
                                           InviteTaxiApplicantController.processAccountForCase(parentCaseId);
                                            strResponse = 'Successfully Invited Reserved Bids';
                                            //ten.isInvited__c = true;
                                            //update ten;
                                        }
                            }else{
                            
                             strResponse = 'Already Invited';
                            }
                        }
            
            }    else{
                  strResponse = 'No Topper bidders Identified, Please make the bids offered in order to Invite';
            }        
            
                    }else{
                         strResponse = 'Please check the tender status, it is not closed yet!';
                    }
        
        system.debug('strResponse---------------->'+strResponse);
        return strResponse;
    }
}