//Class to process and invite to taxi portal.
public without sharing class InviteTaxiApplicantController {
    
    public class BaseException extends Exception {}
    
    //Method to check if all application are compleated or not.
    @AuraEnabled
    public static boolean isAllTenderApplicationsCompleted(Id CaseId){       
        List<Case> caseList = [SELECT Id, Type, Status, RecordTypeId, AccountId, 
                               ContactId, CaseNumber, Subject, Priority, IsClosed, 
                               ClosedDate, Sub_Status__c, Operating_Locations__c, 
                               Licence_Type__c 
                               FROM Case 
                               WHERE ParentId =: CaseId
                               AND Status =: GlobalConstants.CASE_NEW
                               AND Sub_Status__c =: GlobalConstants.CASE_DRAFT];
        
        return caseList.isEmpty();            
    }
    
    
    
    //Method to process accounts of Tender Case.
    @AuraEnabled
    public static string processAccountForCase(Id caseId) {
        try {
             system.debug('caseId------>'+caseId);
            List<Id> accountIds = new List<Id>();
            Map<Id, Id> mapAccountIdVsCaseId = new Map<Id, Id>();
            Map<Id, String> mapAccountIdVsNoticeEmail = new Map<Id, String>();
            List<Case> casesToUpdate = new List<Case>();
            
            for(Case caseRec:[SELECT Id, Type, Status, RecordTypeId, AccountId, 
                              ContactId, CaseNumber, Subject, Notice_Email__c, Priority, IsClosed, 
                              ClosedDate, Sub_Status__c, Operating_Locations__c, 
                              Licence_Type__c 
                              FROM Case 
                              WHERE ParentId =: caseId
                              AND Sub_Status__c = :GlobalConstants.READY_TO_BE_SENT_SUB_STATUS]) { 
                               system.debug('caseRec------>'+caseRec);    
                                  accountIds.add(caseRec.AccountId);
                                  mapAccountIdVsCaseId.put(caseRec.AccountId, caseRec.Id); 
                                  mapAccountIdVsNoticeEmail.put(caseRec.AccountId, caseRec.Notice_Email__c); 
                                  caseRec.Status = GlobalConstants.APPLICATION_STATUS_DRAFT;
                                  caseRec.Sub_Status__c = GlobalConstants.APPLICATION_STATUS_DRAFT;
                                  caseRec.Taxi_Invitation_Send_Date__c = System.now();
                                  casesToUpdate.add(caseRec);
                              }
            
            if(casesToUpdate.size() > 0 ) {
                update casesToUpdate;
                InviteApplicantHelper inviteHelper = new InviteApplicantHelper(casesToUpdate);
                inviteHelper.invite();
            }
            
            return 'Success';
            
        } catch(Exception ex) {
            ApplicationLogUtility.logMessage(GlobalConstants.ERROR,'InviteTaxiApplicantController','processAccountForCase',ex.getMessage(),ex);
            return null;
        }
    }
    
    
    //Method to check if all application are compleated or not.
    @AuraEnabled
    public static boolean isAllTenderApplicationsCompletedIndividual (Id CaseId){       
        List<Case> caseList = [SELECT Id, Type, Status, RecordTypeId, AccountId, 
                               ContactId, CaseNumber, Subject, Priority, IsClosed, 
                               ClosedDate, Sub_Status__c, Operating_Locations__c, 
                               Licence_Type__c 
                               FROM Case 
                               WHERE Id =: CaseId
                               AND Status =: GlobalConstants.CASE_NEW
                               AND Sub_Status__c =: GlobalConstants.CASE_DRAFT];
        
        return caseList.isEmpty();            
    }
    
    
    //Method to process accounts of Tender Child Case.
    //Added on : 10 Jun 2020 : Venkat : Tender New Application development
    
    @AuraEnabled
    public static string processAccountForCaseIndividual(Id caseId) {
        try {
            system.debug('caseId------>'+caseId);
            List<Id> accountIds = new List<Id>();
            Map<Id, Id> mapAccountIdVsCaseId = new Map<Id, Id>();
            Map<Id, String> mapAccountIdVsNoticeEmail = new Map<Id, String>();
            List<Case> casesToUpdate = new List<Case>();
            
            for(Case caseRec:[SELECT Id, Type, Status, RecordTypeId, AccountId, 
                              ContactId, CaseNumber, Subject, Notice_Email__c, Priority, IsClosed, 
                              ClosedDate, Sub_Status__c, Operating_Locations__c, 
                              Licence_Type__c 
                              FROM Case 
                              WHERE Id =: caseId
                              AND Sub_Status__c = :GlobalConstants.READY_TO_BE_SENT_SUB_STATUS]) { 
                                  system.debug('caseRec------>'+caseRec);
                                  accountIds.add(caseRec.AccountId);
                                  mapAccountIdVsCaseId.put(caseRec.AccountId, caseRec.Id); 
                                  mapAccountIdVsNoticeEmail.put(caseRec.AccountId, caseRec.Notice_Email__c); 
                                  caseRec.Status = GlobalConstants.APPLICATION_STATUS_DRAFT;
                                  caseRec.Sub_Status__c = GlobalConstants.APPLICATION_STATUS_DRAFT;
                                  caseRec.Taxi_Invitation_Send_Date__c = System.now();
                                  casesToUpdate.add(caseRec);
                              }
            
            if(casesToUpdate.size() > 0 ) {
                // ADDED ON 1 JUNE 2020, PLEASE UNCOMMENT IT WHEN WE MOVE TO ANOTHER SANDBOX
                //update casesToUpdate;
                InviteApplicantHelper inviteHelper = new InviteApplicantHelper(casesToUpdate);
                inviteHelper.invite();
            }
            
            return 'Success';
            
        } catch(Exception ex) {
            ApplicationLogUtility.logMessage(GlobalConstants.ERROR,'InviteTaxiApplicantController','processAccountForCase',ex.getMessage(),ex);
            return null;
        }
    }
    
    
}