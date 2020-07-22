import { LightningElement, track, wire } from "lwc";

import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { createRecord } from "lightning/uiRecordApi";
import { getRecord } from "lightning/uiRecordApi";

import TENDERBID_OBJECT from "@salesforce/schema/Tender_Bid__c";
import BIDAMOUNT_FIELD from "@salesforce/schema/Tender_Bid__c.Bid_Amount__c";

import BIDPRIMARYJH_FIELD from "@salesforce/schema/Tender_Bid__c.Primary_Joint_Holder__c";
import BIDSTATUS_FIELD from "@salesforce/schema/Tender_Bid__c.Bid_Status__c";
import BIDBUSINESSPHNO_FIELD from "@salesforce/schema/Tender_Bid__c.Business_Hours_Phone__c";
import BIDCONTATCEMAIL_FIELD from "@salesforce/schema/Tender_Bid__c.Contact_Email__c";
import BIDDOB_FIELD from "@salesforce/schema/Tender_Bid__c.Date_of_Birth__c";
import BIDDLNO_FIELD from "@salesforce/schema/Tender_Bid__c.Driver_Licence_Number__c";
import BIDENTITY_FIELD from "@salesforce/schema/Tender_Bid__c.Entity__c";
import BIDFN_FIELD from "@salesforce/schema/Tender_Bid__c.First_Name__c";
import BIDLN_FIELD from "@salesforce/schema/Tender_Bid__c.Last_Name__c";
import BIDADDRESS_FIELD from "@salesforce/schema/Tender_Bid__c.Tender_Address__c";
import BIDMAILCITY_FIELD from "@salesforce/schema/Tender_Bid__c.Mailing_City__c";
import BIDMAILCOUTRY_FIELD from "@salesforce/schema/Tender_Bid__c.Mailing_Country__c";
import BIDMAILPOSTALCODE_FIELD from "@salesforce/schema/Tender_Bid__c.Mailing_Postal_Code__c";
import BIDMAILSTATE_FIELD from "@salesforce/schema/Tender_Bid__c.Mailing_State__c";
import BIDMAILSTREET_FIELD from "@salesforce/schema/Tender_Bid__c.Mailing_Street__c";
import BIDOTHNAME_FIELD from "@salesforce/schema/Tender_Bid__c.Other_Names__c";
import BIDSTATEOFISSUE_FIELD from "@salesforce/schema/Tender_Bid__c.State_of_Issue__c";
import BIDRECORDTYPE_FIELD from "@salesforce/schema/Tender_Bid__c.RecordTypeId";
import BIDPREFERREDCONTACTMETHOD_FIELD from "@salesforce/schema/Tender_Bid__c.Preferred_Contact_Method__c";
import BIDPOSITIONTITLE_FIELD from "@salesforce/schema/Tender_Bid__c.Position_Title__c";

import BIDTENDERCASELOOKUP_FIELD from "@salesforce/schema/Tender_Bid__c.Taxi_Licence_Case__c";
import BITENDERLOOKUP_FIELD from "@salesforce/schema/Tender_Bid__c.Tender__c";

import BIDACNNUMBER_FIELD from "@salesforce/schema/Tender_Bid__c.ACN__c";
import BIDACNCORPORATENAME_FIELD from "@salesforce/schema/Tender_Bid__c.Corporation_Name__c";

import TENDERBIDPARTNER_OBJECT from "@salesforce/schema/Tender_Bid_Partner__c";
import BIDPARTNEREMAIL_FIELD from "@salesforce/schema/Tender_Bid_Partner__c.Email__c";
import BIDPARTNERNAME_FIELD from "@salesforce/schema/Tender_Bid_Partner__c.Name__c";
import BIDPARTNEREPHONE_FIELD from "@salesforce/schema/Tender_Bid_Partner__c.Phone__c";
import BIDPARTNERTYPE_FIELD from "@salesforce/schema/Tender_Bid_Partner__c.Type__c";
import BIDTENDERPARENTLOOKUP_FIELD from "@salesforce/schema/Tender_Bid_Partner__c.Tender_Bid__c";

import BIDNOMINATEDFN_FIELD from "@salesforce/schema/Tender_Bid__c.Nominated_Contact_First_Name__c";
import BIDNOMINATEDLN_FIELD from "@salesforce/schema/Tender_Bid__c.Nominated_Contact_Last_Name__c";
import BIDNOMINATEDOTHERNAME_FIELD from "@salesforce/schema/Tender_Bid__c.Nominated_Contact_Other_Names__c";
import BIDNOMINATEDPOSTITLE_FIELD from "@salesforce/schema/Tender_Bid__c.Nominated_Contact_Position_Title__c";
import BIDNOMINATEDSTATEOFISSUE_FIELD from "@salesforce/schema/Tender_Bid__c.Nominated_Contact_State_of_Issue__c";
import BIDNOMINATEDDOB_FIELD from "@salesforce/schema/Tender_Bid__c.Nominated_Contact_Date_of_Birth__c";
import BIDNOMINATEDDL_FIELD from "@salesforce/schema/Tender_Bid__c.Nominated_Contact_Driver_Licence_Number__c";

//Apex Class Invoke for Payment Call
import processPayment from "@salesforce/apex/PSPPaymentFormController.processPayment";
import insertorder from "@salesforce/apex/TenderFormController.insertorder";
import updateOrderPaymentResponse from "@salesforce/apex/TenderFormController.updatePaymentresponse";
import getTenderDetails from "@salesforce/apex/TenderFormController.getTenderDetails";
import processCancelPayment from "@salesforce/apex/TenderFormController.processCancelPayment";

export default class TaxiTenderBidForm extends LightningElement {
  tenderNumber = "RTF-1234";
  @track currentStep = "intro";
  @track sectionIntro = false;
  @track enterbiddetails = false;
  @track review = false;
  @track processpaymentScreen = false;
  @track complete = false;
  @track tenderbiddetailsobj = {};
  @track jointholderreadonly = [];
  @track joinholderfinalmap = new Map();

  @track tenderbiddetails = {};
  @track tenderbidid;
  @track tenderbidcreateddate;
  @track tenderbidName;
  @track tenderid;
  @track tenderbidno;
  @track tenderbidamount;

  @track tenderrecordtypeIndividualid = "0120T0000004VuCQAU";
  @track tenderrecordtypeCorporate = "0120T0000004VuBQAU";
  @track tenderrecordtypePartnership = "0120T0000004VuDQAU";


  @track orderpaymentrefno;
  @track orderid;
  @track applicationFee = 0;

  @track tenderbidstartdate;
  @track tenderbidenddate;
  @track tenderbidstartjustdate;
  @track tenderbidendjustdate;
  @track isTenderOpen;
  @track licensepaymentdays;
  @track tenderperioddays;

  @track tenderstarttime;
  @track tenderendtime;
  @track tenderexceptiontime;
  @track tenderisExemption__c;

  @track tendercalculatedendtime;

  connectedCallback() {
    let currentURL = window.location.href;

    console.log("currentURL----------->" + currentURL);

    let getUrlParm = new URL(currentURL).searchParams;

    console.log("getUrlParm----------->" + getUrlParm);

    console.log("paymentReference ====> " + getUrlParm.get("paymentReference"));
    console.log("receiptNumber ====> " + getUrlParm.get("receiptNumber"));

    if (getUrlParm.get("paymentReference") === null) {
      this.sectionIntro = true;
      console.log("Tender ID----------->" + getUrlParm.get("id"));
      this.tenderid = getUrlParm.get("id");

      let searchParams = {
        tenderID: this.tenderid
      };

      getTenderDetails(searchParams)
        .then((result) => this.getTenderInfo(result))
        .catch((error) => this.handleError(error));
    } else if (
      getUrlParm.get("paymentReference") !== null &&
      getUrlParm.get("receiptNumber") !== null
    ) {
      console.log("<---------Not undefined----------->");

      console.log("updateOrderPaymentResponse");

      this.isTenderOpen = true;
      let searchParams = {
        orderPaymentRefNo: getUrlParm.get("paymentReference"),
        surchargeAmt: parseFloat(getUrlParm.get("surchargeAmount")),
        paymentAmt: parseFloat(getUrlParm.get("paymentAmount")),
        customerReferenceNo: getUrlParm.get("customerReferenceNumber"),
        receiptNo: getUrlParm.get("receiptNumber"),
        paymentResCode: getUrlParm.get("responseCode"),
        paymentResDesc: getUrlParm.get("responseDescription")
      };

      updateOrderPaymentResponse(searchParams)
        .then((result) => this.updatedOrderInfo(result))
        .catch((error) => this.handleError(error));
    } else if (
      getUrlParm.get("paymentReference") !== null &&
      getUrlParm.get("receiptNumber") === null
    ) {
      // handling cancel payment screnario
      console.log("<---------INSIDE CANCEL PAYMENT----------->");

      let searchParams = {
        orderPaymentRefNo: getUrlParm.get("paymentReference")
      };

      this.isTenderOpen = true;
      processCancelPayment(searchParams)
        .then((result) => this.getOrderandTenderInfo(result))
        .catch((error) => this.handleError(error));
    }
  }

  handlePrevious() {
    this.currentStep = "intro";
    //this.dispatchEvent(new CustomEvent('previous'));
  }

  handleNext() {
    this.currentStep = "details";
    //this.dispatchEvent(new CustomEvent('next'));
  }

  /* get isFirstPage(){
        return this.currentStep === 'intro';
    }
*/
  /* get isLastPage(){
        return this.currentStep === 'complete';
    }
    get sectionIntro(){
        return this.currentStep === 'intro';
    }*/

  handleeventintronext(event) {
    console.log("<--Event Caught--->");

    let buttoneventvalue = event.target.buttonEventName;

    console.log("buttoneventvalue--->" + buttoneventvalue);

    if (buttoneventvalue === "Next") {
      this.sectionIntro = false;
      this.enterbiddetails = true;
      this.currentStep = "details";
    }
  }

  handlebiddetailsnext(event) {
    console.log("<--Event Caught--->");

    let buttoneventvalue = event.target.buttonEventName;

    console.log("buttoneventvalue--->" + buttoneventvalue);

    this.tenderbiddetailsobj.indFirstName =
      event.target.tenderbiddetailsobj.indFirstName;
    this.tenderbiddetailsobj.indOtherNames =
      event.target.tenderbiddetailsobj.indOtherNames;
    this.tenderbiddetailsobj.indLastName =
      event.target.tenderbiddetailsobj.indLastName;
    this.tenderbiddetailsobj.indDOB = event.target.tenderbiddetailsobj.indDOB;
    this.tenderbiddetailsobj.indDLNumber =
      event.target.tenderbiddetailsobj.indDLNumber;
    this.tenderbiddetailsobj.indDLStateOfIssue =
      event.target.tenderbiddetailsobj.indDLStateOfIssue;
    this.tenderbiddetailsobj.corpName =
      event.target.tenderbiddetailsobj.corpName;
    this.tenderbiddetailsobj.corpACN = event.target.tenderbiddetailsobj.corpACN;
    this.tenderbiddetailsobj.nomConFirstName =
      event.target.tenderbiddetailsobj.nomConFirstName;
    this.tenderbiddetailsobj.nomConLastName =
      event.target.tenderbiddetailsobj.nomConLastName;
    this.tenderbiddetailsobj.nomConOtherNames =
      event.target.tenderbiddetailsobj.nomConOtherNames;
    this.tenderbiddetailsobj.nomContPosTitle =
      event.target.tenderbiddetailsobj.nomContPosTitle;
    this.tenderbiddetailsobj.nomContDOB =
      event.target.tenderbiddetailsobj.nomContDOB;
    this.tenderbiddetailsobj.corpDLNumber =
      event.target.tenderbiddetailsobj.corpDLNumber;
    this.tenderbiddetailsobj.corpDLStateOfIssue =
      event.target.tenderbiddetailsobj.corpDLStateOfIssue;
    this.tenderbiddetailsobj.prefContactMethod =
      event.target.tenderbiddetailsobj.prefContactMethod;
    this.tenderbiddetailsobj.contactEmail =
      event.target.tenderbiddetailsobj.contactEmail;
    this.tenderbiddetailsobj.businessHoursPhone =
      event.target.tenderbiddetailsobj.businessHoursPhone;
    // this.tenderbiddetailsobj.contactAddress =
    // event.target.tenderbiddetailsobj.contactAddress;
    console.log(
      " event.target.tenderbiddetailsobj.MailingAddress--------------->" +
      event.target.tenderbiddetailsobj.MailingAddress
    );
    this.tenderbiddetailsobj.MailingAddress =
      event.target.tenderbiddetailsobj.MailingAddress;

    this.tenderbiddetailsobj.MailingStreet =
      event.target.tenderbiddetailsobj.MailingStreet;
    this.tenderbiddetailsobj.MailingCity =
      event.target.tenderbiddetailsobj.MailingCity;
    this.tenderbiddetailsobj.MailingState =
      event.target.tenderbiddetailsobj.MailingState;
    this.tenderbiddetailsobj.MailingCountry =
      event.target.tenderbiddetailsobj.MailingCountry;
    this.tenderbiddetailsobj.MailingPostalCode =
      event.target.tenderbiddetailsobj.MailingPostalCode;

    this.tenderbiddetailsobj.entityType =
      event.target.tenderbiddetailsobj.entityType;
    this.tenderbiddetailsobj.primaryJointHolder =
      event.target.tenderbiddetailsobj.primaryJointHolder;
    this.tenderbiddetailsobj.isJointHolder =
      event.target.tenderbiddetailsobj.isJointHolder;
    this.tenderbiddetailsobj.jointHolders =
      event.target.tenderbiddetailsobj.jointHolders;
    this.tenderbiddetailsobj.tenderBidAmount =
      event.target.tenderbiddetailsobj.tenderBidAmount;

    this.tenderbiddetailsobj.licensepaymentdays =
      event.target.tenderbiddetailsobj.licensepaymentdays;

    this.joinholderfinalmap = event.target.joinholderfinalmappublic;
    this.jointholderreadonly = event.target.jointholderreadonlypublic;

    console.log(
      "Next button prefContactMethod ----->" +
      event.target.tenderbiddetailsobj.prefContactMethod
    );

    if (buttoneventvalue === "Next") {
      this.enterbiddetails = false;
      this.review = true;
      this.currentStep = "review";
    }
  }

  handlebiddetailsclose(event) {
    this.enterbiddetails = false;
    console.log("<--Event Caught--->");

    let buttoneventvalue = event.target.buttonEventName;

    console.log(
      "indFirstName--->" + event.target.tenderbiddetailsobj.indFirstName
    );

    this.tenderbiddetailsobj.indFirstName =
      event.target.tenderbiddetailsobj.indFirstName;
    this.tenderbiddetailsobj.indOtherNames =
      event.target.tenderbiddetailsobj.indOtherNames;
    this.tenderbiddetailsobj.indLastName =
      event.target.tenderbiddetailsobj.indLastName;
    this.tenderbiddetailsobj.indDOB = event.target.tenderbiddetailsobj.indDOB;
    this.tenderbiddetailsobj.indDLNumber =
      event.target.tenderbiddetailsobj.indDLNumber;
    this.tenderbiddetailsobj.indDLStateOfIssue =
      event.target.tenderbiddetailsobj.indDLStateOfIssue;
    this.tenderbiddetailsobj.corpName =
      event.target.tenderbiddetailsobj.corpName;
    this.tenderbiddetailsobj.corpACN = event.target.tenderbiddetailsobj.corpACN;
    this.tenderbiddetailsobj.nomConFirstName =
      event.target.tenderbiddetailsobj.nomConFirstName;
    this.tenderbiddetailsobj.nomConLastName =
      event.target.tenderbiddetailsobj.nomConLastName;
    this.tenderbiddetailsobj.nomConOtherNames =
      event.target.tenderbiddetailsobj.nomConOtherNames;
    this.tenderbiddetailsobj.nomContPosTitle =
      event.target.tenderbiddetailsobj.nomContPosTitle;
    this.tenderbiddetailsobj.nomContDOB =
      event.target.tenderbiddetailsobj.nomContDOB;
    this.tenderbiddetailsobj.corpDLNumber =
      event.target.tenderbiddetailsobj.corpDLNumber;
    this.tenderbiddetailsobj.corpDLStateOfIssue =
      event.target.tenderbiddetailsobj.corpDLStateOfIssue;
    this.tenderbiddetailsobj.prefContactMethod =
      event.target.tenderbiddetailsobj.prefContactMethod;
    this.tenderbiddetailsobj.contactEmail =
      event.target.tenderbiddetailsobj.contactEmail;
    this.tenderbiddetailsobj.businessHoursPhone =
      event.target.tenderbiddetailsobj.businessHoursPhone;
    //this.tenderbiddetailsobj.contactAddress =
    //event.target.tenderbiddetailsobj.contactAddress;

    this.tenderbiddetailsobj.MailingAddress =
      event.target.tenderbiddetailsobj.MailingAddress;

    this.tenderbiddetailsobj.MailingStreet =
      event.target.tenderbiddetailsobj.MailingStreet;
    this.tenderbiddetailsobj.MailingCity =
      event.target.tenderbiddetailsobj.MailingCity;
    this.tenderbiddetailsobj.MailingState =
      event.target.tenderbiddetailsobj.MailingState;
    this.tenderbiddetailsobj.MailingCountry =
      event.target.tenderbiddetailsobj.MailingCountry;
    this.tenderbiddetailsobj.MailingPostalCode =
      event.target.tenderbiddetailsobj.MailingPostalCode;

    this.tenderbiddetailsobj.entityType =
      event.target.tenderbiddetailsobj.entityType;
    this.tenderbiddetailsobj.primaryJointHolder =
      event.target.tenderbiddetailsobj.primaryJointHolder;
    this.tenderbiddetailsobj.isJointHolder =
      event.target.tenderbiddetailsobj.isJointHolder;
    this.tenderbiddetailsobj.jointHolders =
      event.target.tenderbiddetailsobj.jointHolders;
    this.tenderbiddetailsobj.tenderBidAmount =
      event.target.tenderbiddetailsobj.tenderBidAmount;

    this.tenderbiddetailsobj.licensepaymentdays =
      event.target.tenderbiddetailsobj.licensepaymentdays;

    this.joinholderfinalmap = event.target.joinholderfinalmap;
    this.jointholderreadonly = event.target.jointholderreadonly;

    /*
    
  this.jointholderreadonly = event.target.jointholderreadonlypublic;
  this.joinholderfinalmap = event.target.joinholderfinalmappublic;
*/

    console.log("buttoneventvalue--->" + buttoneventvalue);
    console.log(
      "this.jointholderreadonly--->" + JSON.stringify(this.jointholderreadonly)
    );

    if (buttoneventvalue === "Close") {
      //this.enterbiddetails = true;
      this.currentStep = "intro";
      this.sectionIntro = true;
      // this.currentStep = "intro";
    }
    this.handleclosenext(this);
  }

  handleclosenext(event) {
    console.log("<--cALLED ON CLOSE--->");
    this.sectionIntro = false;
    this.enterbiddetails = true;
    this.currentStep = "details";
  }

  handlebiddetailsback(event) {
    console.log("<--Event Caught--->");

    let buttoneventvalue = event.target.buttonEventName;

    console.log(
      "indFirstName--->" + event.target.tenderbiddetailsobj.indFirstName
    );

    this.tenderbiddetailsobj.indFirstName =
      event.target.tenderbiddetailsobj.indFirstName;
    this.tenderbiddetailsobj.indOtherNames =
      event.target.tenderbiddetailsobj.indOtherNames;
    this.tenderbiddetailsobj.indLastName =
      event.target.tenderbiddetailsobj.indLastName;
    this.tenderbiddetailsobj.indDOB = event.target.tenderbiddetailsobj.indDOB;
    this.tenderbiddetailsobj.indDLNumber =
      event.target.tenderbiddetailsobj.indDLNumber;
    this.tenderbiddetailsobj.indDLStateOfIssue =
      event.target.tenderbiddetailsobj.indDLStateOfIssue;
    this.tenderbiddetailsobj.corpName =
      event.target.tenderbiddetailsobj.corpName;
    this.tenderbiddetailsobj.corpACN = event.target.tenderbiddetailsobj.corpACN;
    this.tenderbiddetailsobj.nomConFirstName =
      event.target.tenderbiddetailsobj.nomConFirstName;
    this.tenderbiddetailsobj.nomConLastName =
      event.target.tenderbiddetailsobj.nomConLastName;
    this.tenderbiddetailsobj.nomConOtherNames =
      event.target.tenderbiddetailsobj.nomConOtherNames;
    this.tenderbiddetailsobj.nomContPosTitle =
      event.target.tenderbiddetailsobj.nomContPosTitle;
    this.tenderbiddetailsobj.nomContDOB =
      event.target.tenderbiddetailsobj.nomContDOB;
    this.tenderbiddetailsobj.corpDLNumber =
      event.target.tenderbiddetailsobj.corpDLNumber;
    this.tenderbiddetailsobj.corpDLStateOfIssue =
      event.target.tenderbiddetailsobj.corpDLStateOfIssue;
    this.tenderbiddetailsobj.prefContactMethod =
      event.target.tenderbiddetailsobj.prefContactMethod;
    this.tenderbiddetailsobj.contactEmail =
      event.target.tenderbiddetailsobj.contactEmail;
    this.tenderbiddetailsobj.businessHoursPhone =
      event.target.tenderbiddetailsobj.businessHoursPhone;
    //this.tenderbiddetailsobj.contactAddress =
    //event.target.tenderbiddetailsobj.contactAddress;

    this.tenderbiddetailsobj.MailingAddress =
      event.target.tenderbiddetailsobj.MailingAddress;

    this.tenderbiddetailsobj.MailingStreet =
      event.target.tenderbiddetailsobj.MailingStreet;
    this.tenderbiddetailsobj.MailingCity =
      event.target.tenderbiddetailsobj.MailingCity;
    this.tenderbiddetailsobj.MailingState =
      event.target.tenderbiddetailsobj.MailingState;
    this.tenderbiddetailsobj.MailingCountry =
      event.target.tenderbiddetailsobj.MailingCountry;
    this.tenderbiddetailsobj.MailingPostalCode =
      event.target.tenderbiddetailsobj.MailingPostalCode;

    this.tenderbiddetailsobj.entityType =
      event.target.tenderbiddetailsobj.entityType;
    this.tenderbiddetailsobj.primaryJointHolder =
      event.target.tenderbiddetailsobj.primaryJointHolder;
    this.tenderbiddetailsobj.isJointHolder =
      event.target.tenderbiddetailsobj.isJointHolder;
    this.tenderbiddetailsobj.jointHolders =
      event.target.tenderbiddetailsobj.jointHolders;
    this.tenderbiddetailsobj.tenderBidAmount =
      event.target.tenderbiddetailsobj.tenderBidAmount;

    this.tenderbiddetailsobj.licensepaymentdays =
      event.target.tenderbiddetailsobj.licensepaymentdays;

    this.joinholderfinalmap = event.target.joinholderfinalmap;
    this.jointholderreadonly = event.target.jointholderreadonly;

    console.log("buttoneventvalue--->" + buttoneventvalue);
    console.log(
      "this.jointholderreadonly--->" + JSON.stringify(this.jointholderreadonly)
    );

    if (buttoneventvalue === "Back") {
      this.enterbiddetails = false;
      this.sectionIntro = true;
      this.currentStep = "intro";
    }
  }

  handlereviewback(event) {
    console.log("<--Event Caught--->");

    let buttoneventvalue = event.target.buttonEventName;

    if (buttoneventvalue === "Back") {
      this.enterbiddetails = true;
      this.review = false;
      this.currentStep = "details";
    }
  }

  handleInsertOrder(event) {
    console.log("handleInsertOrder");

    let searchParams = {
      tenderBidID: this.tenderbidid,
      applicaitonFee: this.applicationFee
    };

    insertorder(searchParams)
      .then((result) => this.getOrderInfo(result))
      .catch((error) => this.handleError(error));
  }
  handleError(error) {
    console.log("<----this.error----->" + error);
    //console.log("<----JSON error----->" + JSON.parse(error));
    console.log("<----this.error----->" + JSON.stringify(error));
  }

  getTenderInfo(newValues) {
    console.log("<----getOrderInfo setResult call back is called----->");
    console.log("<----getOrderInfo newValues----->" + newValues);
    console.log("<----Application_Fee__c----->" + newValues.Application_Fee__c);

    console.log("<----Start_DateTime__c----->" + newValues.Start_DateTime__c);
    console.log("<----End_DateTime__c----->" + newValues.End_DateTime__c);
    console.log("<----isTenderOpen__c----->" + newValues.isTenderOpen__c);
    console.log(
      "<----Licence_Payment_within_days__c----->" +
      newValues.Licence_Payment_within_days__c
    );

    this.applicationFee = newValues.Application_Fee__c;
    this.tenderbidstartdate = newValues.Start_DateTime__c;
    this.tenderbidenddate = newValues.End_DateTime__c;
    this.isTenderOpen = newValues.isTenderOpen__c;
    this.tenderperioddays = newValues.TenderPeriodDays__c;

    //Tender_End_Time_Formula__c ,Tender_Start_Time_Formula__c ,Tender_Exemption_Time_Formula__c ,isExemption__c

    this.tenderstarttime = newValues.Tender_Start_Time_Formula__c;
    this.tenderendtime = newValues.Tender_End_Time_Formula__c;
    this.tenderexceptiontime = newValues.Tender_Exemption_Time_Formula__c;
    this.tenderisExemption__c = newValues.isExemption__c;

    if (this.tenderisExemption__c === true) {
      this.tendercalculatedendtime = newValues.Tender_Exemption_Time_Formula__c;
    } else {
      this.tendercalculatedendtime = newValues.tenderendtime;
    }

    //TenderStartDate__c ,TenderEndDate__c

    this.tenderbidstartjustdate = newValues.TenderStartDate__c;
    this.tenderbidendjustdate = newValues.TenderEndDate__c;

    this.licensepaymentdays = newValues.Licence_Payment_within_days__c;
  }

  updatedOrderInfo(newValues) {
    console.log("<----getOrderInfo setResult call back is called----->");
    console.log("<----getOrderInfo newValues----->" + newValues);

    // Route to the complete screen with details

    this.tenderbidid = newValues.Id;
    this.review = false;
    this.currentStep = "complete";
    this.complete = true;
  }

  getOrderandTenderInfo(newValues) {
    console.log("<----getOrderandTenderInfo Payment reprocessing---->");
    console.log("<----getOrderandTenderInfo----->" + newValues);
    console.log(
      "<----getOrderandTenderInfo JSON----->" + JSON.stringify(newValues)
    );
    // Route to the complete screen with details
    let getJsonvalues = JSON.stringify(newValues);
    console.log("<----getJsonvalues----->" + getJsonvalues);
    console.log("<----getJsonvalues.Id----->" + getJsonvalues.Id);
    console.log("<----newValues.Id----->" + newValues.Id);

    this.orderpaymentrefno = newValues.Payment_Reference__c;
    this.orderid = newValues.Id;
    this.tenderbidno = newValues.Tender_BID_No__c;
    this.tenderbidamount = newValues.Amount_Due__c;

    console.log("<----newValues.Amount_Due__c----->" + newValues.Amount_Due__c);
    console.log(
      "<----newValues.Payment_Reference__c----->" +
      newValues.Payment_Reference__c
    );
    console.log(
      "<----newValues.Tender_Bid_No__c----->" + newValues.Tender_BID_No__c
    );

    console.log("<----this.orderid----->" + this.orderid);

    console.log("<----this.tenderbidno----->" + this.tenderbidno);

    this.processpaymentScreen = true;
    this.currentStep = "payment";
  }

  getOrderInfo(newValues) {
    console.log("<----getOrderInfo setResult call back is called----->");
    console.log("<----getOrderInfo newValues----->" + newValues);
    console.log(
      "<----Payment_Reference__c----->" + newValues.Payment_Reference__c
    );

    this.orderpaymentrefno = newValues.Payment_Reference__c;
    this.orderid = newValues.Id;

    console.log("<----this.orderid ----->" + this.orderid);
    console.log("<----his.orderpaymentrefno----->" + this.orderpaymentrefno);

    this.handlePayment();
  }

  handlePayment(event) {
    console.log("Inside Payment Logging");
    console.log("<----handlePayment this.orderid ----->" + this.orderid);
    console.log(
      "<----handlePayment his.orderpaymentrefno----->" + this.orderpaymentrefno
    );

    let searchParams = {
      appType: "New",
      orderRef: this.orderpaymentrefno,
      isInitiatedFromManageAccount: "true",
      sfRecordId: this.orderid
    };

    processPayment(searchParams)
      .then((result) => this.setResult(result))
      .catch((error) => this.handleError(error));
  }

  setResult(newValues) {
    console.log("<----setResult call back is called----->");
    console.log("<----newValues----->" + newValues);

    // let myArr = JSON.parse(this.newValues);
    // console.log("myArr--->" + Jthis.myArr);
    let response = JSON.stringify(newValues.body);

    console.log("<----response----->" + response);

    window.location.assign(newValues);
  }

  handlereviewsubmit(event) {
    console.log(
      " handlereviewsubmit jointholderreadonly--->" +
      JSON.stringify(this.jointholderreadonly)
    );

    //handlereviewsubmit jointholderreadonly--->{"1":{"currentkey":1,"type":"Individual","name":"TEST","email":"TEST","phone":"3535"}}

    let buttoneventvalue = event.target.buttonEventName;

    console.log(
      "BID amoutn submit ----->" +
      event.target.tenderbiddetailsobj.tenderBidAmount
    );

    console.log("get DOB->" + event.target.tenderbiddetailsobj.nomContDOB);
    console.log(
      "get prefContactMethod->" +
      event.target.tenderbiddetailsobj.prefContactMethod
    );

    let dt = new Date(event.target.tenderbiddetailsobj.nomContDOB);
    console.log("dt->" + dt);

    const fields = {};
    fields[BIDAMOUNT_FIELD.fieldApiName] =
      event.target.tenderbiddetailsobj.tenderBidAmount;

    fields[BIDBUSINESSPHNO_FIELD.fieldApiName] =
      event.target.tenderbiddetailsobj.businessHoursPhone;
    fields[BIDCONTATCEMAIL_FIELD.fieldApiName] =
      event.target.tenderbiddetailsobj.contactEmail;

    if (event.target.tenderbiddetailsobj.indDOB !== undefined) {
      fields[BIDDOB_FIELD.fieldApiName] =
        event.target.tenderbiddetailsobj.indDOB;
    } else {
      fields[BIDNOMINATEDDOB_FIELD.fieldApiName] =
        event.target.tenderbiddetailsobj.nomContDOB;
    }

    fields[BIDPREFERREDCONTACTMETHOD_FIELD.fieldApiName] =
      event.target.tenderbiddetailsobj.prefContactMethod;

    if (event.target.tenderbiddetailsobj.indDLNumber !== undefined) {
      fields[BIDDLNO_FIELD.fieldApiName] =
        event.target.tenderbiddetailsobj.indDLNumber;
    } else {
      fields[BIDNOMINATEDDL_FIELD.fieldApiName] =
        event.target.tenderbiddetailsobj.corpDLNumber;
    }

    fields[BIDENTITY_FIELD.fieldApiName] =
      event.target.tenderbiddetailsobj.entityType;

    fields[BIDMAILCITY_FIELD.fieldApiName] =
      event.target.tenderbiddetailsobj.MailingCity;
    fields[BIDMAILCOUTRY_FIELD.fieldApiName] =
      event.target.tenderbiddetailsobj.MailingCountry;

    fields[BIDMAILPOSTALCODE_FIELD.fieldApiName] =
      event.target.tenderbiddetailsobj.MailingPostalCode;
    fields[BIDMAILSTATE_FIELD.fieldApiName] =
      event.target.tenderbiddetailsobj.MailingState;
    fields[BIDMAILSTREET_FIELD.fieldApiName] =
      event.target.tenderbiddetailsobj.MailingStreet;

    fields[BIDSTATUS_FIELD.fieldApiName] = "Draft";

    fields[BIDADDRESS_FIELD.fieldApiName] =
      event.target.tenderbiddetailsobj.MailingAddress;

    console.log(
      "this.MailingStreet----->" +
      event.target.tenderbiddetailsobj.MailingStreet
    );
    console.log(
      "this.MailingCity----->" + event.target.tenderbiddetailsobj.MailingCity
    );
    console.log(
      "this.MailingState----->" + event.target.tenderbiddetailsobj.MailingState
    );
    console.log(
      "this.MailingCountry----->" +
      event.target.tenderbiddetailsobj.MailingCountry
    );
    console.log(
      "this.MailingPostalCode----->" +
      event.target.tenderbiddetailsobj.MailingPostalCode
    );

    fields[BIDPRIMARYJH_FIELD.fieldApiName] =
      event.target.tenderbiddetailsobj.primaryJointHolder;

    // fields[BIDTENDERCASELOOKUP_FIELD.fieldApiName] = "5000k00000CFRwg";

    fields[BITENDERLOOKUP_FIELD.fieldApiName] = this.tenderid;

    console.log(
      "(event.target.tenderbiddetailsobj.entityType-->" +
      event.target.tenderbiddetailsobj.entityType
    );

    console.log(
      "(event.target.tenderbiddetailsobj.corpName-->" +
      event.target.tenderbiddetailsobj.corpName
    );

    console.log(
      "FIRST NAME indFirstName-->" +
      event.target.tenderbiddetailsobj.indFirstName
    );

    console.log(
      "FIRST NAME nomConFirstName-->" +
      event.target.tenderbiddetailsobj.nomConFirstName
    );

    console.log(
      "FIRST NAME nomConLastName-->" +
      event.target.tenderbiddetailsobj.nomConLastName
    );

    console.log(
      "FIRST NAME indLastName-->" + event.target.tenderbiddetailsobj.indLastName
    );

    if (event.target.tenderbiddetailsobj.entityType === "Individual") {
      fields[
        BIDRECORDTYPE_FIELD.fieldApiName
      ] = this.tenderrecordtypeIndividualid;

      fields[BIDFN_FIELD.fieldApiName] =
        event.target.tenderbiddetailsobj.indFirstName;

      fields[BIDLN_FIELD.fieldApiName] =
        event.target.tenderbiddetailsobj.indLastName;

      fields[BIDOTHNAME_FIELD.fieldApiName] =
        event.target.tenderbiddetailsobj.indOtherNames;

      fields[BIDSTATEOFISSUE_FIELD.fieldApiName] =
        event.target.tenderbiddetailsobj.indDLStateOfIssue;
    } else if (event.target.tenderbiddetailsobj.entityType === "Corporation") {
      fields[BIDRECORDTYPE_FIELD.fieldApiName] = this.tenderrecordtypeCorporate;

      fields[BIDACNNUMBER_FIELD.fieldApiName] =
        event.target.tenderbiddetailsobj.corpACN;

      fields[BIDACNCORPORATENAME_FIELD.fieldApiName] =
        event.target.tenderbiddetailsobj.corpName[0];

      fields[BIDNOMINATEDFN_FIELD.fieldApiName] =
        event.target.tenderbiddetailsobj.nomConFirstName;

      fields[BIDNOMINATEDLN_FIELD.fieldApiName] =
        event.target.tenderbiddetailsobj.nomConLastName;

      fields[BIDNOMINATEDOTHERNAME_FIELD.fieldApiName] =
        event.target.tenderbiddetailsobj.nomConOtherNames;

      fields[BIDNOMINATEDSTATEOFISSUE_FIELD.fieldApiName] =
        event.target.tenderbiddetailsobj.corpDLStateOfIssue;

      fields[BIDNOMINATEDPOSTITLE_FIELD.fieldApiName] =
        event.target.tenderbiddetailsobj.nomContPosTitle;
    } else if (
      event.target.tenderbiddetailsobj.entityType === "Joint holders"
    ) {
      fields[
        BIDRECORDTYPE_FIELD.fieldApiName
      ] = this.tenderrecordtypePartnership;

      if (
        event.target.tenderbiddetailsobj.primaryJointHolder === "Individual"
      ) {
        fields[BIDFN_FIELD.fieldApiName] =
          event.target.tenderbiddetailsobj.indFirstName;

        fields[BIDLN_FIELD.fieldApiName] =
          event.target.tenderbiddetailsobj.indLastName;

        fields[BIDOTHNAME_FIELD.fieldApiName] =
          event.target.tenderbiddetailsobj.indOtherNames;

        fields[BIDSTATEOFISSUE_FIELD.fieldApiName] =
          event.target.tenderbiddetailsobj.indDLStateOfIssue;
      } else if (
        event.target.tenderbiddetailsobj.primaryJointHolder === "Corporation"
      ) {
        //fields[BIDACNNUMBER_FIELD.fieldApiName] =
        //event.target.tenderbiddetailsobj.corpACN;

        //fields[BIDACNCORPORATENAME_FIELD.fieldApiName] =
        //event.target.tenderbiddetailsobj.corpName[0];

        fields[BIDNOMINATEDFN_FIELD.fieldApiName] =
          event.target.tenderbiddetailsobj.nomConFirstName;

        fields[BIDNOMINATEDLN_FIELD.fieldApiName] =
          event.target.tenderbiddetailsobj.nomConLastName;

        fields[BIDNOMINATEDOTHERNAME_FIELD.fieldApiName] =
          event.target.tenderbiddetailsobj.nomConOtherNames;

        fields[BIDNOMINATEDSTATEOFISSUE_FIELD.fieldApiName] =
          event.target.tenderbiddetailsobj.corpDLStateOfIssue;

        // fields[BIDNOMINATEDPOSTITLE_FIELD.fieldApiName] =
        // event.target.tenderbiddetailsobj.nomContPosTitle;
      }
    }

    const recordInput = {
      apiName: TENDERBID_OBJECT.objectApiName,
      fields
    };

    createRecord(recordInput)
      .then((tenderbid) => {
        this.tenderbidid = tenderbid.id;
        console.log("this.tenderbidid--->" + this.tenderbidid);

        /*   this.dispatchEvent(
          new ShowToastEvent({
            title: "Success",
            message: "Tender Bid Record created",
            variant: "success"
          })
        );*/

        for (let key in this.jointholderreadonly) {
          // Preventing unexcepted data
          if (this.jointholderreadonly.hasOwnProperty(key)) {
            // Filtering the data in the loop

            console.log("value:result[key]" + this.jointholderreadonly[key]);
            console.log(
              "value:result[key]" +
              JSON.stringify(this.jointholderreadonly[key])
            );

            console.log(
              "value:result[key]" + this.jointholderreadonly[key].name
            );

            console.log(
              "value:result[key]" + this.jointholderreadonly[key].type
            );
            console.log(
              "value:result[key]" + this.jointholderreadonly[key].email
            );

            // create related contact
            const fields_Contact = {};

            fields_Contact[
              BIDTENDERPARENTLOOKUP_FIELD.fieldApiName
            ] = this.tenderbidid;

            fields_Contact[
              BIDPARTNEREPHONE_FIELD.fieldApiName
            ] = this.jointholderreadonly[key].phone;

            fields_Contact[
              BIDPARTNERNAME_FIELD.fieldApiName
            ] = this.jointholderreadonly[key].name;

            fields_Contact[
              BIDPARTNERTYPE_FIELD.fieldApiName
            ] = this.jointholderreadonly[key].type;

            fields_Contact[
              BIDPARTNEREMAIL_FIELD.fieldApiName
            ] = this.jointholderreadonly[key].email;

            const recordInput_Contact = {
              apiName: TENDERBIDPARTNER_OBJECT.objectApiName,
              fields: fields_Contact
            };
            // create contact record using Lightning Data service
            createRecord(recordInput_Contact)
              .then((contact) => {
                // this.tenderpartnerID = contact.id;
                /* this.dispatchEvent(
                  new ShowToastEvent({
                    title: "Success",
                    message: "partner record is created",
                    variant: "success"
                  })
                );*/
              })

              .catch((error) => {
                this.dispatchEvent(
                  new ShowToastEvent({
                    title: "Error creating record",
                    message: error.body.message,
                    variant: "error"
                  })
                );
                console.log("error----------------->" + JSON.stringify(error));
              });
          }
        }

        // Insert Order for the Bid created
        this.handleInsertOrder();
        //this.review = false;
        //this.currentStep = "complete";
        //this.complete = true;
      })
      .catch((error) => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Error creating record",
            message: error.body.message,
            variant: "error"
          })
        );
        console.log("error----------------->" + JSON.stringify(error));
      });

    console.log(
      " handlereviewsubmit jointholderreadonly--->" +
      JSON.stringify(this.jointholderreadonly)
    );
  }
}