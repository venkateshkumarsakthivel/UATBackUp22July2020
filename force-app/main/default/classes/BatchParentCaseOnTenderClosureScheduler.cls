global with sharing class BatchParentCaseOnTenderClosureScheduler implements Schedulable {
    

    global void execute(SchedulableContext SC) {
       
        set<string> setCronJobName = new set<string>();
        for(CronTrigger conjo:[SELECT CreatedDate,CronJobDetailId,CronJobDetail.Name FROM CronTrigger ORDER BY createddate DESC LIMIT 3]){
            setCronJobName.add(conjo.CronJobDetail.Name);
        }  
        
        system.debug('setCronJobName--->'+setCronJobName);

        //You just need to modify these two variables
            Integer everyNthMinute = 15;
            String nameOfSchedulableClass = 'BatchParentCaseOnTenderClosureScheduler';
            
            
            Integer counter = 1;
            for(Integer minute=0;minute<60;minute++){
                if(Math.mod(minute,everyNthMinute)==0){
                    String scheduleName = nameOfSchedulableClass +String.valueOf(counter);
                    if(!setCronJobName.contains(scheduleName)){
                         String cronPattern  = '0 '+ String.valueOf(minute) +' * * * ?';
                    System.schedule(scheduleName,cronPattern, (Schedulable)Type.forName(nameOfSchedulableClass).newInstance());
                    system.debug('scheduled--->'+cronPattern + scheduleName);
                    counter++;
                    }
                   
                }
            }
        
        
       BatchParentCaseOnTenderClosure b = new BatchParentCaseOnTenderClosure();
       database.executebatch(b,200);
       

    } 
    
}