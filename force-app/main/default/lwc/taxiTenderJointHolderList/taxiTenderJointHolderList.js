import { LightningElement, api, wire, track } from "lwc";

import getJointHolder from "@salesforce/apex/TaxiTenderJointHolderController.fetchData";
import updateJointHolder from "@salesforce/apex/TaxiTenderJointHolderController.updateJointHolder";
import createJointHolder from "@salesforce/apex/TaxiTenderJointHolderController.createJointHolder";

import TENDER_PARTNER_OBJECT from "@salesforce/schema/Tender_Bid_Partner__c";
import TP_TYPE from "@salesforce/schema/Tender_Bid_Partner__c.Type__c";
import TP_NAME from "@salesforce/schema/Tender_Bid_Partner__c.Name__c";
import TP_PHONE from "@salesforce/schema/Tender_Bid_Partner__c.Phone__c";
import TP_EMAIL from "@salesforce/schema/Tender_Bid_Partner__c.Email__c";

// Taxi Tender service
import * as TaxiTenderService from "c/taxiTenderService";

export default class TaxiTenderJointHolderList extends LightningElement {
  @api jointHolder;
  @api key;
  @api getJointHoldervalues = [];
  @api makereadonly = false;

  recordId;
  tenderPartnerObject = TENDER_PARTNER_OBJECT;
  tendPartnerFields = [TP_TYPE, TP_NAME, TP_PHONE, TP_EMAIL];

  //record properties
  @track type = "Individual";
  @track
  options = [
    { label: "Individual", value: "Individual" },
    { label: "Corporation", value: "Corporation" }
  ];

  @track name = "";
  @track email;
  @track phone;
  @api jointholderdetailsobj = {};

  @api getjoinholderinfo = {};
  @api currentkey;

  //jointHolderTypes = TaxiTenderService.getJointHolderTypes();

  connectedCallback() {
    this.type = this.jointholderdetailsobj.type;
    console.table(
      "connectedCallback jointholderdetailsobj" +
        JSON.stringify(this.jointholderdetailsobj)
    );
    console.log(this.jointHolder);
    console.log("connectedCallback key" + this.jointHolder);

    console.table(
      "connectedCallback getJointHoldervalues" +
        JSON.stringify(this.getJointHoldervalues)
    );

    if (this.getJointHoldervalues !== undefined) {
      this.type = this.getJointHoldervalues.type;
      this.name = this.getJointHoldervalues.name;
      this.email = this.getJointHoldervalues.email;
      this.phone = this.getJointHoldervalues.phone;
      //this.jointHolder.key = this.getJointHoldervalues.currentkey;

      console.log("this.type connected call back--->" + this.type);
      console.log("this.name connected call back--->" + this.name);
      console.log("this.email connected call back--->" + this.email);
      console.log("this.phone connected call back--->" + this.phone);
      console.log(
        "this.makereadonly connected call back--->" + this.makereadonly
      );
    }

    //this.recordId = this.jointHolder.partner.id;
  }

  get jointHolderNumber() {
   // return "Joint Holder " + this.jointHolder;
   return "Joint Holder " + this.name;
  }

  handleclose(){
    this.currentkey = this.jointHolder;
    const buttonEvent = new CustomEvent("jointholderclose");
    // Dispatches the event.
    this.dispatchEvent(buttonEvent);
    console.log("<--Event fired--->");

  }

  handleChange(event) {
    const field = event.target.name;
    const buttonEvent = new CustomEvent("jointholderdetailsave");
    this.currentkey = this.jointHolder;

    console.table("handleChange" + JSON.stringify(this.jointholderdetailsobj));

    switch (field) {
      case "type":
        this.type = event.target.value;
        console.log("this.type" + this.type);

        this.jointholderdetailsobj.type = this.type;

        /*this.jointholderdetailsobj.forEach(element => {
          console.log("element" + element);
          return (element.type = this.type);
        });
        this.jointholderdetailsobj = [...this.jointholderdetailsobj];*/
        //this.jointholderdetailsobj.type = this.type;
        console.table(JSON.stringify(this.jointholderdetailsobj));

        // Dispatches the event.
        this.dispatchEvent(buttonEvent);
        console.log("<--Event fired--->");

        break;
      case "name":
        this.name = event.target.value;

        this.jointholderdetailsobj.name = this.name;

        // Dispatches the event.
        this.dispatchEvent(buttonEvent);
        console.log("<--Event fired--->");

        break;
      case "email":
        this.email = event.target.value;
        this.jointholderdetailsobj.email = this.email;

        // Dispatches the event.
        this.dispatchEvent(buttonEvent);
        console.log("<--Event fired--->");

        break;
      case "phone":
        this.phone = event.target.value;
        this.jointholderdetailsobj.phone = this.phone;

        // Dispatches the event.
        this.dispatchEvent(buttonEvent);
        console.log("<--Event fired--->");
        break;
      default:
        console.log(`Placeholder for : ${event.target.name}`);
    }
  }
}