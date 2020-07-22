global class TenderBidCheckPaymentScheduler implements Schedulable {

   global void execute(SchedulableContext ctx) {
      TenderBidCheckPaymentBatch biddecline = new TenderBidCheckPaymentBatch();
        database.executeBatch(biddecline,200);
   }   
}