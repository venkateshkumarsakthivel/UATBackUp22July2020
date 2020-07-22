import { LightningElement, api, track, wire } from "lwc";
// import { ShowToastEvent } from 'lightning/platformShowToastEvent';

// import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getObjectInfo, getPicklistValues } from "lightning/uiObjectInfoApi";

import TENDER_BID_OBJECT from "@salesforce/schema/Tender_Bid__c";
import STATE_OF_ISSUE_FIELD from "@salesforce/schema/Tender_Bid__c.State_of_Issue__c";


export default class AddressValidatorServiceInput extends LightningElement {
  @api label = "Lookup";
  @api delay = 300;
  @api value;
  @api fieldName = null;
  @api finalchangedvalue;
  @api addressreadonly;

  @track addressservice = true;

  recTypeId;
  
  @api mailingstreet;
  @api mailingcity;
  @api mailingstate;
  @api mailingzipcode;
  @api mailingcounty = "Australia";

  @api mergeaddressmanualservice;


   connectedCallback() {
    console.log('addressreadonly--------->'+this.addressreadonly);

    /*if(this.value !== null){
       this.mailingstreet = "";
       this.mailingcity = "";
       this.mailingstate = "";
       this.mailingzipcode = "";
    }*/
   }

   //Wired services
  @wire(getObjectInfo, { objectApiName: TENDER_BID_OBJECT })
  tenderObjectInfo({ error, data }) {
    if (data) {
      this.recTypeId = data.defaultRecordTypeId;
    } else if (error) {
      this.recTypeId = "";
    }
  }

  @wire(getPicklistValues, {
    recordTypeId: "$recTypeId",
    fieldApiName: STATE_OF_ISSUE_FIELD
  })
  dlStatesOfIssueValues;


   handleCanfindAddressClick(){
     console.log('<---------Cant find address is called--------->');
      this.addressservice = false;
   }

   handlebacktoaddresssearch(){
      this.addressservice = true;
   }

  constructor() {
    super();
    this.timeout = null;
  }

  /* Bubbles change event up after debouncing */
  handleChange(event) {

    const allValid = [...this.template.querySelectorAll(".validValue")].reduce(
      (validSoFar, inputCmp) => {
        inputCmp.reportValidity();
        return validSoFar && inputCmp.checkValidity();
      },
      true
    );

    let searchTerm;
    if (allValid) {
      searchTerm = event.target.value;
    }else{
      searchTerm = null;
    }

    event.stopPropagation();
    window.clearTimeout(this.timeout);
    
    console.log("searchTerm--->" + searchTerm);
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    this.timeout = window.setTimeout(() => {
      this.fireChange(searchTerm);
    }, this.delay);
 
  }

  /* Sends changes back compatible to extended form when
       the fieldName as been set */
  fireChange(changedValue) {
    console.log(" changedValue--->" + changedValue);
    this.finalchangedvalue = changedValue;


    let eventName = this.fieldName ? "valueChanged" : "change";
    let payload = this.fieldName
      ? { name: this.fieldName, value: this.changedValue }
      : changedValue;
    /*let customChange = new CustomEvent(eventName, {
      detail: payload,
      bubbles: true,
      cancelable: true
    });*/

    console.log(" this.finalchangedvalue---->" + this.finalchangedvalue);
    //let customChange = new CustomEvent(eventName, this.finalchangedvalue);
    const customChange = new CustomEvent("change");
    this.dispatchEvent(customChange);
  }

  handlecantfindaddress(event){

    const field = event.target.name;
    switch (field) {
        case "MailingStreet":
        this.mailingstreet = event.target.value;
        break;
        case "MailingCity":
        this.mailingcity = event.target.value;
        break;
        case "MailingState":
        this.mailingstate = event.target.value;
        break;
        case "MailingCountry":
        this.mailingcounty = event.target.value;
        break;
        case "MailingPostalCode":
        this.mailingzipcode = event.target.value;
        break;
        default:
        console.log(`Placeholder for : ${event.target.name}`);
        
    }

    this.value ="";
    const customChange = new CustomEvent("changemanualaddress");
    this.dispatchEvent(customChange);
  }
}