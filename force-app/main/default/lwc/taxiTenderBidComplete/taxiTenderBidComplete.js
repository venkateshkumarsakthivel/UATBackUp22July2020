import { LightningElement, track, wire, api } from "lwc";

import { getRecord, getFieldValue } from "lightning/uiRecordApi";

const fields = [
  "Tender_Bid__c.Bid_Amount__c",
  "Tender_Bid__c.Business_Hours_Phone__c",
  "Tender_Bid__c.Contact_Email__c",
  "Tender_Bid__c.Mailing_Address__c",
  "Tender_Bid__c.Name",
  "Tender_Bid__c.First_Name__c",
  "Tender_Bid__c.Last_Name__c"
];

export default class TaxiTenderBidCreate extends LightningElement {
  @track tenderyears;
  @track tenderbidName;
  @track tenderBidAmount;
  @track ContactEmail;
  @track MailingAddress;
  @track BusinessPhone;
  @api tenderbidid;
  // @track recordTenderValue;
  @track error;

  @track getTenderBidDetails;

  @wire(getRecord, {
    recordId: "$tenderbidid",
    fields: fields
  })
  recordTenderValue;

  get bidamount() {
    return getFieldValue(
      this.recordTenderValue.data,
      "Tender_Bid__c.Bid_Amount__c"
    );
  }

  get bidbusinessphone() {
    return getFieldValue(
      this.recordTenderValue.data,
      "Tender_Bid__c.Business_Hours_Phone__c"
    );
  }

  get bidemail() {
    return getFieldValue(
      this.recordTenderValue.data,
      "Tender_Bid__c.Contact_Email__c"
    );
  }

  get bidfirstname() {
    return getFieldValue(
      this.recordTenderValue.data,
      "Tender_Bid__c.First_Name__c"
    );
  }

  get bidlastname() {
    return getFieldValue(
      this.recordTenderValue.data,
      "Tender_Bid__c.Last_Name__c"
    );
  }

  get bidname() {
    return getFieldValue(this.recordTenderValue.data, "Tender_Bid__c.Name");
  }

  get bidaddress() {
    return getFieldValue(
      this.recordTenderValue.data,
      "Tender_Bid__c.Mailing_Address__c"
    );
  }

  connectedCallback() {
    console.log("Final Component is called----->");
    console.log("tenderbidid---------->" + this.tenderbidid);

    console.log("bidbusinessphone----->" + this.bidbusinessphone);
  }

  handlePrint() {
    console.log("print is called");
    window.print();
  }
}