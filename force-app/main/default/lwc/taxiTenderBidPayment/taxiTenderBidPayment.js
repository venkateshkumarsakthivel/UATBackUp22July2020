import { LightningElement,api } from 'lwc';

export default class TaxiTenderBidPayment extends LightningElement {

    @api orderid;
    @api tenderBidAmount;
    @api tenderBidNo;

    Retry() {
	const buttonEvent = new CustomEvent("triggerpaymentretry");
    // Dispatches the event.
    this.dispatchEvent(buttonEvent);
    console.log("<--triggerpaymentretry Fired--->");
	
    }

    handlePrint() {
    console.log("print is called");
    window.print();
  }
    

}