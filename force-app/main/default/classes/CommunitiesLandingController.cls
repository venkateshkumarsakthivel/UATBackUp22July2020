/**
* An apex page controller that takes the user to the right start page based on credentials or lack thereof
*/
public with sharing class CommunitiesLandingController {
    
    // Code we will invoke on page load.
    public PageReference forwardToStartPage() {
        return Network.communitiesLanding();
    }
    
    public PageReference forwardTocustomStartPage() {
        
        /*Mobile device landed on secure-portal-home else as normal
Ref - https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_methods_system_userinfo.htm*/
        System.debug('getUiTheme(): '+UserInfo.getUiThemeDisplayed());        
        
        if(UserInfo.getUiThemeDisplayed()=='Theme4t'){
            return new PageReference('/industryportal/s/secure-portal-home?src=homeMenu');
        }
        else{
            User loggedinUser = [SELECT User_Profile_Name__c 
                                 FROM User
                                 WHERE Id = :UserInfo.getUserId()];
            
            
            //set sotring profile names that have Account as their landing tab
            Set<String> userProfilesWithAccountLanding = new Set<String>();
            userProfilesWithAccountLanding.add(GlobalConstants.ASP_PROFILE_NAME);
            userProfilesWithAccountLanding.add(GlobalConstants.ACCOUNT_MANAGER_USER_PROFILE_NAME);
            userProfilesWithAccountLanding.add(GlobalConstants.Taxi_ASP_PROFILE_NAME);
            userProfilesWithAccountLanding.add(GlobalConstants.Taxi_ACCOUNT_MANAGER_PROFILE_NAME);
            
            Set<String> userProfilesWithTaxiLanding = new Set<String>();
            userProfilesWithTaxiLanding.add(GlobalConstants.TAXI_LICENCE_USER_PROFILE_NAME);
            userProfilesWithTaxiLanding.add(GlobalConstants.TAXI_AGENT_USERS_PROFILE_NAME);
            
            if(userProfilesWithAccountLanding.contains(loggedinUser.User_Profile_Name__c)){
                
                return new PageReference('/industryportal/s/manage-profile?src=accountMenu');
            }
            else if(loggedinUser.User_Profile_Name__c == GlobalConstants.LEVY_PROFILE_NAME){
                
                return new PageReference('/industryportal/s/levy-management?src=levyMenu');
            }
            else if(loggedinUser.User_Profile_Name__c == GlobalConstants.PROSPECTIVE_SERVICE_PROVIDER_USER_PROFILE_NAME){
                
                return new PageReference('/industryportal/s/asp-application-list?src=myApplicationMenu');
            }
            else if(loggedinUser.User_Profile_Name__c == GlobalConstants.MSC_PROFILE_NAME){
                
                return new PageReference('/industryportal/s/dvddashboard?src=dvdMenu');
            }
            else if(userProfilesWithTaxiLanding.contains(loggedinUser.User_Profile_Name__c)){
                
                return new PageReference('/taxilicence/s/manage-profile?src=accountMenu');
            }
            return NULL;
        }
        
    }
    
    public CommunitiesLandingController() {}
}