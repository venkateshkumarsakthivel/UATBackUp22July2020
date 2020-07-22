trigger TenderBidTrigger on Tender_Bid__c  (after insert, after update, before update, before insert) {

    /*   if(Trigger.isInsert && Trigger.isAfter) {
         TenderBidTriggerHandler.afterInsert(Trigger.new);
TenderBidTriggerHandler.beforeInsert(Trigger.new);
        } */
    
     if(Trigger.isInsert && Trigger.isBefore) {
       
TenderBidTriggerHandler.beforeInsert(Trigger.new);
        }
        
         if(Trigger.isUpdate && Trigger.isAfter) {
         TenderBidTriggerHandler.afterUpdate(Trigger.new,trigger.oldmap);
        }
    
}