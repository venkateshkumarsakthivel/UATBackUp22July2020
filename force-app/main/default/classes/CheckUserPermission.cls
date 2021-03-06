public with sharing class CheckUserPermission {

     public static Boolean checkObjectReadAccess(Schema.DescribeSObjectResult drSObj){

         try{

            system.debug(drSObj.getName()+' Read Permission  ********************: '+drSObj.isAccessible());

            return drSObj.isAccessible();

        }catch(Exception exc){

            system.debug('Caught an Exception in CheckUserPermission.checkObjectReadAccess'+exc);

            return false;

        }

    }
    
     public static Boolean checkObjectUpdateAccess(Schema.DescribeSObjectResult drSObj){

         try{

            system.debug(drSObj.getName()+' Update Permission  ********************: '+drSObj.isUpdateable());

            return drSObj.isUpdateable();

        }catch(Exception exc){

            system.debug('Caught an Exception in CheckUserPermission.checkObjectUpdateAccess'+exc);

            return false;

        }

    }
    
     public static Boolean checkFieldsReadAccess(List<Schema.DescribeFieldResult> allFields){

        try{

            for(Schema.DescribeFieldResult drField : allFields){

                if(!drField.isAccessible()){

                    system.debug('Field Name which has not Read access   ********************'+drField.getName());

                    return false;

                 }

            }

            return true;

        }catch(Exception exc){

            system.debug('Caught an Exception in CheckUserPermission.checkFieldsReadAccess'+exc);

            return false;

        }

    }
    
     public static Boolean checkFieldsCreateAccess(List<Schema.DescribeFieldResult> allFields){

        try{

            for(Schema.DescribeFieldResult drField : allFields){

                if(!drField.isCreateable()){

                    system.debug('Field Name which has not create access   ***************'+drField.getName());

                    return false;

                 }

            }

            return true;

        }catch(Exception exc){

            system.debug('Caught an Exception in CheckUserPermission.checkFieldsCreateAccess'+exc);

            return false;

        }

    }
    
    public static Boolean checkFieldsUpdateAccess(List<Schema.DescribeFieldResult> allFields){

        try{

            for(Schema.DescribeFieldResult drField : allFields){

                if(!drField.isUpdateable()){

                    system.debug('Field Name which has not Update access  ************** '+drField.getName());

                    return false;

                 }

            }

            return true;

        }catch(Exception exc){

            system.debug('Caught an Exception in CheckUserPermission.checkFieldsUpdateAccess'+exc);

            return false;

        }

    }
 
}