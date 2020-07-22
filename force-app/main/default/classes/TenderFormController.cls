/*
   Class to handle Tender Bid Submission and  payment processing and payment gateway redirection
*/
public without sharing class  TenderFormController {
    
    @AuraEnabled
    public static Tender__c getTenderDetails(string tenderID){
        if(tenderID != Null){
               Tender__c tenderBiddetails = [Select ID,Application_Fee__c,TenderPeriodDays__c ,Tender_End_Time_Formula__c ,Tender_Start_Time_Formula__c ,Tender_Exemption_Time_Formula__c ,isExemption__c ,TenderStartDate__c ,TenderEndDate__c ,Start_DateTime__c,End_DateTime__c,isTenderOpen__c,Extension_DateTime__c,Licence_Payment_within_days__c from Tender__c where ID=: tenderID Limit 1 
];
            
            TimeZone tz = UserInfo.getTimeZone();
			DateTime localTimeStartDate = tenderBiddetails.Start_DateTime__c.AddSeconds(tz.getOffset(tenderBiddetails.Start_DateTime__c)/1000);
            DateTime localTimeEndDate = tenderBiddetails.End_DateTime__c.AddSeconds(tz.getOffset(tenderBiddetails.End_DateTime__c)/1000);
            
            tenderBiddetails.Start_DateTime__c = localTimeStartDate;
            tenderBiddetails.End_DateTime__c = localTimeEndDate;
            
            update tenderBiddetails;
            
               return tenderBiddetails;
           }
        return null;
    }
    
     @AuraEnabled
    public static Tender_Order__c insertorder(string tenderBidID, integer applicaitonFee){
        system.debug('<---Inside order inserrt---->');
        system.debug('tenderBidID---->'+tenderBidID);
        system.debug('applicaitonFee---->'+applicaitonFee);
        /*
        Account Acc =[SELECT ID FROM ACCOUNT WHERE ID ='0010k00000y4vdJAAQ'];
        
        SYSTEM.DEBUG('Acc--------------->'+Acc);
        
        order ord = new order();
        ord.Status = 'Payment Due';
        ord.EffectiveDate = date.valueof(system.today());
        ord.AccountId ='0010k00000y4vdJAAQ';
       // ord.Payment_Method__c = 'Credit Card/Debit Card';
       // ord.Tender_Bid__c = tenderBidID;
        //ord.Payment_Type__c = 'Tender';
       // ord.type = 'Tender Bid';
        //ord.TotalAmount  = 100.00;
        //ord.Surcharge_Amount__c  = decimal.valueof(applicaitonFee);
        
        system.debug('ord---->'+ord);
        
        database.insert(ord);
        
         system.debug('ord inserted---->'+ord);
        Order OrdInserted = [Select Payment_Method__c,TotalAmount,ID,Payment_Reference__c from Order where ID=: ord.id];
        */
        
        Tender_Order__c tenderOrder = new Tender_Order__c();
        tenderOrder.Status__c =  'Payment Due';
        tenderOrder.Tender_Bid__c =  tenderBidID;
        tenderOrder.Payment_Method__c =  'Credit Card/Debit Card';
        tenderOrder.Amount_Due__c =  applicaitonFee;
        insert tenderOrder;
        
        system.debug('tenderOrder inserted---->'+tenderOrder);
        Tender_Order__c OrdInserted = [Select Payment_Method__c,Amount_Due__c,ID,Payment_Reference__c from Tender_Order__c where ID=: tenderOrder.id];
        system.debug('OrdInserted inserted---->'+OrdInserted);
        return OrdInserted;
    }
    
	 @AuraEnabled
   public static Tender_Bid__c updatePaymentresponse(string orderPaymentRefNo,decimal surchargeAmt,decimal paymentAmt,string customerReferenceNo,
                                                    string receiptNo, string paymentResCode, string paymentResDesc){
                                                        
                                                         system.debug('orderPaymentRefNo---->'+orderPaymentRefNo);
                                                         system.debug('surchargeAmt---->'+surchargeAmt);
                                                         system.debug('paymentAmt---->'+paymentAmt);
                                                         system.debug('customerReferenceNo---->'+customerReferenceNo);
                                                         system.debug('receiptNo---->'+receiptNo);
                                                         system.debug('paymentResCode---->'+paymentResCode);
                                                         system.debug('paymentResDesc---->'+paymentResDesc);
                                                        
       if(orderPaymentRefNo != Null){
           
          /* Order ord = [Select ID,Payment_Reference__c,Surcharge_Amount__c,Amount_Paid__c,Internal_Reference__c,
                        Receipt_Number__c,Payment_Response_Code__c,Payment_Response_Description__c,Tender_Bid__c 
                        from Order where Payment_Reference__c = : orderPaymentRefNo Limit 1]; */
           
            Tender_Order__c Ord = [Select Payment_Method__c,Status__c,Tender_Bid__c,Tender_BID_No__c,Payment_Response_Description__c,Payment_Response_Code__c,Receipt_No__c,
                                  Customer_Reference_No__c,Amount_Due__c,Amount_Paid__c,ID from Tender_Order__c where Payment_Reference__c =: orderPaymentRefNo limit 1];
           
      
           ord.Amount_Paid__c = paymentAmt;
           ord.Customer_Reference_No__c = customerReferenceNo;
           ord.Receipt_No__c = receiptNo;
           ord.Payment_Response_Code__c = paymentResCode;
           ord.Payment_Response_Description__c = paymentResDesc;
           ord.Payment_Cleared_Date__c = system.today();
          
           ord.Status__c = 'Paid in Full';
           
           Update Ord;
           
           system.debug('ord.Tender_Bid__c---->'+ord.Tender_Bid__c);
           
           if(ord.Tender_Bid__c != Null){
               Tender_Bid__c tenderBiddetails = [Select ID,Bid_Status__c from Tender_Bid__c where ID=: ord.Tender_Bid__c Limit 1];
               tenderBiddetails.Bid_Status__c = 'Submitted';
                system.debug('tenderBiddetails---->'+tenderBiddetails);
               update tenderBiddetails;
               return tenderBiddetails;
           }
           
       }
      return null;
	}
    
     @AuraEnabled
    public static Tender_Order__c processCancelPayment(string orderPaymentRefNo){
        
		system.debug('processCancelPayment orderPaymentRefNo---->'+orderPaymentRefNo);        
        if(orderPaymentRefNo != Null){
           
        /*   Order ord = [Select ID,Payment_Reference__c,Surcharge_Amount__c,Amount_Paid__c,Internal_Reference__c,
                        Receipt_Number__c,Payment_Response_Code__c,Payment_Response_Description__c,Tender_Bid__c,Tender_Bid_No__c,Amount_Due__c
                        from Order where Payment_Reference__c = : orderPaymentRefNo Limit 1];
            return ord;*/
            
            
 		Tender_Order__c Ord = [Select id,Tender_BID_No__c,Payment_Method__c,Status__c,Tender_Bid__c,Payment_Response_Description__c,Payment_Reference__c,Payment_Response_Code__c,Receipt_No__c,
                                   Customer_Reference_No__c,Amount_Due__c,Amount_Paid__c from Tender_Order__c where Payment_Reference__c =: orderPaymentRefNo limit 1];
                       system.debug('processCancelPayment ord---->'+ord);  
          return ord;

        }
        return null;
    }
    
    
}