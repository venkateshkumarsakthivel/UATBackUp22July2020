import { LightningElement, track } from "lwc";

export default class TaxiTenderBidCreate extends LightningElement {
  @track tenderyears;
  @track tenderbidName;
  @track tenderBidAmount;
  @track ContactEmail;
  @track MailingAddress;
  @track BusinessPhone;

  connectedCallback() {
    this.tenderyears = this.year + "/" + this.year + 1;
  }
}