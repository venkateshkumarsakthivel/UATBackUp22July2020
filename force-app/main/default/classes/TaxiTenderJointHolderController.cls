public without sharing class TaxiTenderJointHolderController {
    @AuraEnabled(cacheable=true)
    public static Tender_Bid_Partner__c fetchData(Id objId){
        if(objId != null){
             return [SELECT Type__c, Name__c, Phone__c, Email__c FROM Tender_Bid_Partner__c WHERE id=:objId LIMIT  1];
        }else{
            return null;
        }
       
    }

    @AuraEnabled
    public static void updateJointHolder(Tender_Bid_Partner__c obj){
        update obj;
    }

    @AuraEnabled
    public static Tender_Bid_Partner__c createJointHolder(Tender_Bid_Partner__c obj){
        insert obj;
        return obj;
    }
}