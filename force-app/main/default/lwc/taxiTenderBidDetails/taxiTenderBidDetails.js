import { LightningElement, api, track, wire } from "lwc";
// import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getObjectInfo, getPicklistValues } from "lightning/uiObjectInfoApi";

import TENDER_BID_OBJECT from "@salesforce/schema/Tender_Bid__c";
import STATE_OF_ISSUE_FIELD from "@salesforce/schema/Tender_Bid__c.State_of_Issue__c";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

// import
import { updateRecord } from "lightning/uiRecordApi";

// Taxi Tender service
import * as TaxiTenderService from "c/taxiTenderService";
import service from "@salesforce/apex/CustomLookUpLwcController.service";

export default class TaxiTenderBidDetails extends LightningElement {
  // Config
  @api strTitle;
  @api buttonEventName;
  @api tenderbiddetailsobj = {};
  @api tenderbiddetailsobjfromparent;
  @api joinholderfinalmappublic = new Map();

  @api jointholderreadonlypublic = [];
  @api makereadonly = false;
  @api makejointholdereditable = false;

  @api licensepaymentdays;

  @api getTenderID;

  recTypeId;
  finalkey = 0;

  // Record props
  @track indFirstName;
  @track indOtherNames;
  @track indLastName;
  @track indDOB;
  @track indDLNumber;
  @track indDLStateOfIssue;
  @track corpName;
  @track corpACN;
  @track nomConFirstName;
  @track nomConOtherNames;
  @track nomConLastName;
  @track nomContPosTitle;
  @track nomContDOB;
  @track corpDLNumber;
  @track corpDLStateOfIssue;
  @track prefContactMethod;
  @track contactEmail;
  @track businessHoursPhone;
  @track contactAddress;

  @track MailingStreet;
  @track MailingCity;
  @track MailingState;
  @track MailingCountry;
  @track MailingPostalCode;

  @track MailingAddress;

  @track jointholderbutton = false;
  @track openconfiramtionmodal = false;
  @track InformationProvidedCheck = false;
  @track PrivacyStatementCheck = false;
  @track TenderInformationCheck = false;

  @track jointHolders = [];
  @track jointHoldersreadyonly = [];

  @track jointholderdetailsobj = {};

  @track joinholderdetailsobjlist = [];

  @track joinholderfinalmap = new Map();

  @api jointholderreadonly = [];

  @api getjoinholderfinalmap = new Map();
  @api getjointholderreadonly = [];

  // Track changes to our main properties that will need to be binded to HTML
  @track entityType;
  @track primaryJointHolder;
  @track isJointHolder;

  @track jointholderdetailsobjlocal = {};

  @track mapOfValuesJointHolder = [];

  @track jointholderreadonlyNew = {};

  @track joinholderfinalmapNew = new Map();
  @track getjoinholderfinalmapNew = new Map();

  @track validationMessage;

  @track thelastKey;

  @track getPaymentDueDate;

  @api tenderstartdate;
  @api tenderenddate;
  @api applicationfee;
  @api tenderperioddays;

  @api tendercalculatedendtime;
  @api tenderstarttime;

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

  //Static configs
  entityTypes = TaxiTenderService.getEntityTypes();

  jointHolderTypes = TaxiTenderService.getJointHolderTypes();

  prefContactMethodValues = TaxiTenderService.getPrefContactMethodValues();

  connectedCallback() {
    console.log(
      "licensepaymentdays from intro----->" + this.licensepaymentdays
    );

    this.getPaymentDueDate = this.licensepaymentdays;

    console.log("getPaymentDueDate----->" + this.getPaymentDueDate);
    console.log("tenderstartdate----->" + this.tenderstartdate);
    console.log("tenderenddate----->" + this.tenderenddate);
    console.log("tenderperioddays----->" + this.tenderperioddays);

    //this.licensepaymentdays = this.licensepaymentdays;

    console.log("bid detail callback----->");

    console.log("this.MailingAddress----->" + this.MailingAddress);

    console.log("this.MailingStreet----->" + this.MailingStreet);
    console.log("this.MailingCity----->" + this.MailingCity);
    console.log("this.MailingState----->" + this.MailingState);
    console.log("this.MailingCountry----->" + this.MailingCountry);
    console.log("this.MailingPostalCode----->" + this.MailingPostalCode);

    if (this.tenderbiddetailsobjfromparent !== undefined) {
      console.log("Inside IF----->");

      console.log(
        "COntact prefContactMethod ----->" +
          this.tenderbiddetailsobjfromparent.prefContactMethod
      );

      console.log(
        "COntact nomContDOB ----->" +
          this.tenderbiddetailsobjfromparent.nomContDOB
      );

      console.log(
        "licensePaymentDays 2nd try----->" +
          this.tenderbiddetailsobjfromparent.licensePaymentDays
      );

      //this.licensePaymentDays = this.tenderbiddetailsobjfromparent.licensePaymentDays;
      this.indFirstName = this.tenderbiddetailsobjfromparent.indFirstName;
      this.indOtherNames = this.tenderbiddetailsobjfromparent.indOtherNames;
      this.indLastName = this.tenderbiddetailsobjfromparent.indLastName;
      this.indDOB = this.tenderbiddetailsobjfromparent.indDOB;
      this.indDLStateOfIssue = this.tenderbiddetailsobjfromparent.indDLStateOfIssue;
      this.corpName = this.tenderbiddetailsobjfromparent.corpName;
      this.corpACN = this.tenderbiddetailsobjfromparent.corpACN;
      this.nomConFirstName = this.tenderbiddetailsobjfromparent.nomConFirstName;
      this.nomConLastName = this.tenderbiddetailsobjfromparent.nomConLastName;
      this.nomConOtherNames = this.tenderbiddetailsobjfromparent.nomConOtherNames;
      this.nomContPosTitle = this.tenderbiddetailsobjfromparent.nomContPosTitle;
      this.nomContDOB = this.tenderbiddetailsobjfromparent.nomContDOB;
      this.corpDLNumber = this.tenderbiddetailsobjfromparent.corpDLNumber;
      this.corpDLStateOfIssue = this.tenderbiddetailsobjfromparent.corpDLStateOfIssue;
      this.prefContactMethod = this.tenderbiddetailsobjfromparent.prefContactMethod;
      this.contactEmail = this.tenderbiddetailsobjfromparent.contactEmail;
      this.businessHoursPhone = this.tenderbiddetailsobjfromparent.businessHoursPhone;
      //this.contactAddress = this.tenderbiddetailsobjfromparent.contactAddress;
      this.entityType = this.tenderbiddetailsobjfromparent.entityType;
      this.primaryJointHolder = this.tenderbiddetailsobjfromparent.primaryJointHolder;
      this.isJointHolder = this.tenderbiddetailsobjfromparent.isJointHolder;
      this.jointHoldersreadyonly = this.tenderbiddetailsobjfromparent.jointHolders;
      this.tenderBidAmount = this.tenderbiddetailsobjfromparent.tenderBidAmount;
      this.indDLNumber = this.tenderbiddetailsobjfromparent.indDLNumber;

      console.log(
        "Connected call back Address Bid Details------------->" +
          this.tenderbiddetailsobjfromparent.MailingAddress
      );
      this.MailingAddress = this.tenderbiddetailsobjfromparent.MailingAddress;

      this.MailingStreet = this.tenderbiddetailsobjfromparent.MailingStreet;
      this.MailingCity = this.tenderbiddetailsobjfromparent.MailingCity;
      this.MailingState = this.tenderbiddetailsobjfromparent.MailingState;
      this.MailingCountry = this.tenderbiddetailsobjfromparent.MailingCountry;
      this.MailingPostalCode = this.tenderbiddetailsobjfromparent.MailingPostalCode;

      this.joinholderfinalmap = this.getjoinholderfinalmap;
      this.jointholderreadonly = this.getjointholderreadonly;

      console.log("this.isJointHolder--->" + this.isJointHolder);

      console.log("primaryJointHolder" + this.primaryJointHolder);

      if (
        this.primaryJointHolder === "Individual" ||
        this.primaryJointHolder === "Corporation"
      ) {
        this.jointholderbutton = true;
      }

      console.log(
        "inside for key this.joinholderfinalmap" + this.joinholderfinalmap
      );

      console.log("makereadonly" + this.makereadonly);

      console.log(
        " this.makejointholdereditable" + this.makejointholdereditable
      );

      let getAllKeys = [];

      if (this.makereadonly === true) {
        for (let key in this.jointholderreadonly) {
          console.log("key-------------->" + key);
          getAllKeys.push(key);
          // Preventing unexcepted data
          if (this.jointholderreadonly.hasOwnProperty(key)) {
            // Filtering the data in the loop
            this.mapOfValuesJointHolder.push({
              value: this.jointholderreadonly[key],
              key: key
            });
          }
        }
      } else if (this.makejointholdereditable === true) {
        for (let key in this.jointholderreadonly) {
          console.log("key-------------->" + key);
          getAllKeys.push(key);
          // Preventing unexcepted data
          if (this.jointholderreadonly.hasOwnProperty(key)) {
            // Filtering the data in the loop
            this.mapOfValuesJointHolder.push({
              value: this.jointholderreadonly[key],
              key: key
            });

            //this.finalkey = key;
          } else {
            this.finalkey = 0;
          }
        }
      }

      console.log("getAllKeys----------->" + getAllKeys);
      let largest;

      if (getAllKeys !== undefined) {
        console.log("getAllKeys DEFINED----------->");
        largest = getAllKeys.sort((a, b) => a - b).reverse()[0];
      }

      console.log("largest----------->" + largest);

      this.finalkey = largest;
      this.thelastkey = largest;

      console.log("this.finalkey----------->" + this.finalkey);
      console.log("this.thelastkey----------->" + this.thelastkey);

      console.log(
        "mapOfValuesJointHolder--->" +
          JSON.stringify(this.mapOfValuesJointHolder)
      );

      console.log(
        "jointholderreadonly--->" + JSON.stringify(this.jointholderreadonly)
      );

      console.log(
        "jointHoldersreadyonly--->" + JSON.stringify(this.jointHoldersreadyonly)
      );
      console.log("TILL HERE ITS FINE");
    }
  }

  //Expressions
  get isIndividual() {
    return (
      this.entityType === "Individual" ||
      (this.isJointHolder && this.primaryJointHolder === "Individual")
    );
  }
  get isCorporation() {
    return (
      this.entityType === "Corporation" ||
      (this.isJointHolder && this.primaryJointHolder === "Corporation")
    );
  }
  get isACNRequired() {
    return this.entityType === "Corporation";
  }

  addMoreJointHolders() {
    console.log("<---this.jointHolders.length -->");
    console.log("<---Lenght -->" + this.jointHolders.length);

    console.log("<--- this.finalkey  -->" + this.finalkey);

    let iKey;

    console.log("<---addMoreJointHolders thelastKey-->" + this.thelastKey);

    console.log("<---addMoreJointHolders finalkey-->" + this.finalkey);

    if (this.finalkey === 0) {
      iKey = this.jointHolders.length + 1;
      this.thelastKey = iKey;
    } else {
      //this.thelastKey = this.thelastKey + 1;
      //iKey = Number(this.finalkey) + 1;
      this.finalkey = this.finalkey + 1;
      iKey = this.finalkey;
      //let ikeynew = this.jointHolders.length + 1;
      //iKey = this.finalkey + ikeynew + 'New';
    }

    console.log("<---thelastKey-->" + this.thelastKey);
    console.log("<---thelastKey AFTER-->" + this.finalkey);

    console.log("<---iKey NEW KEY-->" + iKey);
    this.jointHolders = [...this.jointHolders, { key: iKey }];
    this.mapOfValuesJointHolder = [
      ...this.mapOfValuesJointHolder,
      { key: iKey }
    ];
  }

  handleChange(event) {
    const field = event.target.name;
    switch (field) {
      case "entityType":
        console.log("event.target.value--->" + event.target.value);
        this.entityType = event.target.value;
        this.isJointHolder = event.target.value === "Joint holders";
        break;
      case "primaryJointHolder":
        this.primaryJointHolder = event.target.value;

        if (this.jointholderbutton === false) {
          this.jointHolders.push({ key: 1 });
          this.finalkey = 1;
          this.thelastKey = 1;
          this.jointholderbutton = true;

          if (this.makereadonly === false) {
            for (let key in this.jointHolders) {
              // Preventing unexcepted data
              if (this.jointHolders.hasOwnProperty(key)) {
                // Filtering the data in the loop
                this.mapOfValuesJointHolder.push({
                  key: 1
                });
              }
            }
          }
        }

        console.log("primaryJointHolder" + this.primaryJointHolder);

        console.log(
          "primaryJointHolder jointHolders" + JSON.stringify(this.jointHolders)
        );
        console.log("<---jointHolders Lenght -->" + this.jointHolders.length);

        break;
      case "indFirstName":
        this.indFirstName = event.target.value;
        break;
      case "indOtherNames":
        this.indOtherNames = event.target.value;
        break;
      case "indLastName":
        this.indLastName = event.target.value;
        break;
      case "indDOB":
        console.log("indDOB event.target.value--->" + event.target.value);

        const today = new Date();
        console.log(" today--->" + today);

        //const unixTimeMilSec = today.getTime();

        // Tue Nov 26 2019 13:27:09 GMT...
        //console.log("date today.." + unixTimeMilSec);

        const checkdate = new Date(event.target.value);

        console.log(" checkdate--->" + checkdate);

        const isValidOB = checkdate > today;

        console.log(" isValidOB--->" + isValidOB);

        if (checkdate > today) {
          console.log("inside false");
          const evt = new ShowToastEvent({
            title: "Error!",
            message: "Please enter a valid date of birth",
            variant: "error"
          });
          this.dispatchEvent(evt);
        } else {
          this.indDOB = event.target.value;
          console.log(" this.indDOB --->" + this.indDOB);
        }

        break;
      case "indDLNumber":
        this.indDLNumber = event.target.value;
        break;
      case "indDLStateOfIssue":
        this.indDLStateOfIssue = event.target.value;
        break;
      //case "corpName":
      //this.corpName = event.target.value;
      // break;
      case "corpACN":
        this.corpACN = event.target.value;
        this.ACNValidator();
        break;
      case "nomConFirstName":
        this.nomConFirstName = event.target.value;
        break;
      case "nomConOtherNames":
        this.nomConOtherNames = event.target.value;
        break;
      case "nomConLastName":
        this.nomConLastName = event.target.value;
        break;
      case "nomContPosTitle":
        this.nomContPosTitle = event.target.value;
        break;
      case "nomContDOB":
        const today2 = new Date();

        console.log(" today2--->" + today2);

        //const unixTimeMilSec = today.getTime();

        // Tue Nov 26 2019 13:27:09 GMT...
        //console.log("date today.." + unixTimeMilSec);

        const checkdate2 = new Date(event.target.value);

        console.log(" checkdate2--->" + checkdate2);

        const isValidOB2 = checkdate2 > today2;

        console.log(" isValidOB2--->" + isValidOB2);

        if (checkdate2 > today2) {
          console.log("inside false");
          const evt = new ShowToastEvent({
            title: "Error!",
            message: "Please enter a valid date of birth",
            variant: "error"
          });
          this.dispatchEvent(evt);
        } else {
          this.nomContDOB = event.target.value;
          console.log(" this.nomContDOB --->" + this.nomContDOB);
        }

        break;
      case "corpDLNumber":
        this.corpDLNumber = event.target.value;
        break;
      case "corpDLStateOfIssue":
        this.corpDLStateOfIssue = event.target.value;
        break;
      case "prefContactMethod":
        this.prefContactMethod = event.target.value;
        break;
      case "contactEmail":
        this.contactEmail = event.target.value;
        break;
      case "businessHoursPhone":
        this.businessHoursPhone = event.target.value;
        break;
      //case "contactAddress":
      //this.contactAddress = event.target.value;
      // break;

      case "tenderBidAmount":
        if (event.target.value != null && event.target.value > 0) {
          this.tenderBidAmount = event.target.value;
          break;
        } else {
          console.log("inside false");
          const evt = new ShowToastEvent({
            title: "Error!",
            message: "Please enter a valid Bid Amount",
            variant: "error"
          });
          this.dispatchEvent(evt);
        }

      /*

      case "MailingStreet":
        this.MailingStreet = event.target.value;
        break;
      case "MailingCity":
        this.MailingCity = event.target.value;
        break;
      case "MailingState":
        this.MailingState = event.target.value;
        break;
      case "MailingCountry":
        this.MailingCountry = event.target.value;
        break;

      case "MailingPostalCode":
        this.MailingPostalCode = event.target.value;
        break;
        */
      default:
        console.log(`Placeholder for : ${event.target.name}`);
    }
  }

  handleNext() {
    const allValid = [...this.template.querySelectorAll(".validValue")].reduce(
      (validSoFar, inputCmp) => {
        inputCmp.reportValidity();
        return validSoFar && inputCmp.checkValidity();
      },
      true
    );
    if (allValid) {
      //All validations passed , pass the values to the parent container
      this.buttonEventName = "Next";

      //Assigning all the track properities to public properties :obj
      this.tenderbiddetailsobj.indFirstName = this.indFirstName;
      this.tenderbiddetailsobj.indOtherNames = this.indOtherNames;
      this.tenderbiddetailsobj.indLastName = this.indLastName;
      this.tenderbiddetailsobj.indDOB = this.indDOB;
      this.tenderbiddetailsobj.indDLNumber = this.indDLNumber;
      this.tenderbiddetailsobj.indDLStateOfIssue = this.indDLStateOfIssue;
      this.tenderbiddetailsobj.corpName = this.corpName;
      this.tenderbiddetailsobj.corpACN = this.corpACN;
      this.tenderbiddetailsobj.nomConFirstName = this.nomConFirstName;
      this.tenderbiddetailsobj.nomConOtherNames = this.nomConOtherNames;
      this.tenderbiddetailsobj.nomConLastName = this.nomConLastName;
      this.tenderbiddetailsobj.nomContPosTitle = this.nomContPosTitle;
      this.tenderbiddetailsobj.nomContDOB = this.nomContDOB;
      this.tenderbiddetailsobj.corpDLNumber = this.corpDLNumber;
      this.tenderbiddetailsobj.corpDLStateOfIssue = this.corpDLStateOfIssue;
      this.tenderbiddetailsobj.prefContactMethod = this.prefContactMethod;
      this.tenderbiddetailsobj.contactEmail = this.contactEmail;
      this.tenderbiddetailsobj.businessHoursPhone = this.businessHoursPhone;
      //this.tenderbiddetailsobj.contactAddress = this.contactAddress;

      console.log(
        "On Next Button click----------------->" + this.MailingAddress
      );

      console.log("nomContDOB----------------->" + this.nomContDOB);

      this.tenderbiddetailsobj.MailingAddress = this.MailingAddress;

      this.tenderbiddetailsobj.MailingStreet = this.MailingStreet;
      this.tenderbiddetailsobj.MailingCity = this.MailingCity;
      this.tenderbiddetailsobj.MailingState = this.MailingState;
      this.tenderbiddetailsobj.MailingCountry = this.MailingCountry;
      this.tenderbiddetailsobj.MailingPostalCode = this.MailingPostalCode;

      this.tenderbiddetailsobj.entityType = this.entityType;
      this.tenderbiddetailsobj.primaryJointHolder = this.primaryJointHolder;
      this.tenderbiddetailsobj.isJointHolder = this.isJointHolder;
      this.tenderbiddetailsobj.jointHolders = this.jointHolders;
      this.tenderbiddetailsobj.tenderBidAmount = this.tenderBidAmount;

      console.log(
        " THE VALUE 888888888888888888888 this.joinholderfinalmap----------------->" +
          JSON.stringify(this.joinholderfinalmap)
      );
      console.log(
        " this.jointholderreadonly----------------->" +
          JSON.stringify(this.jointholderreadonly)
      );

      this.joinholderfinalmappublic = this.joinholderfinalmap;
      this.jointholderreadonlypublic = this.jointholderreadonly;

      const buttonEvent = new CustomEvent("biddetailsnext");
      // Dispatches the event.
      this.dispatchEvent(buttonEvent);
      console.log("<--Event fired--->");
    } else {
      //alert('Please fill required and update all invalid form entries');

      const evt = new ShowToastEvent({
        title: "Error!",
        message: "Please fill required and update all invalid form entries",
        variant: "error"
      });
      this.dispatchEvent(evt);
    }
  }

  handlePrevious() {
    //Assigning all the track properities to public properties :obj

    this.tenderbiddetailsobj.indFirstName = this.indFirstName;
    this.tenderbiddetailsobj.indOtherNames = this.indOtherNames;
    this.tenderbiddetailsobj.indLastName = this.indLastName;
    this.tenderbiddetailsobj.indDOB = this.indDOB;
    this.tenderbiddetailsobj.indDLNumber = this.indDLNumber;
    this.tenderbiddetailsobj.indDLStateOfIssue = this.indDLStateOfIssue;
    this.tenderbiddetailsobj.corpName = this.corpName;
    this.tenderbiddetailsobj.corpACN = this.corpACN;
    this.tenderbiddetailsobj.nomConFirstName = this.nomConFirstName;
    this.tenderbiddetailsobj.nomConOtherNames = this.nomConOtherNames;
    this.tenderbiddetailsobj.nomConLastName = this.nomConLastName;
    this.tenderbiddetailsobj.nomContPosTitle = this.nomContPosTitle;
    this.tenderbiddetailsobj.nomContDOB = this.nomContDOB;
    this.tenderbiddetailsobj.corpDLNumber = this.corpDLNumber;
    this.tenderbiddetailsobj.corpDLStateOfIssue = this.corpDLStateOfIssue;
    this.tenderbiddetailsobj.prefContactMethod = this.prefContactMethod;
    this.tenderbiddetailsobj.contactEmail = this.contactEmail;
    this.tenderbiddetailsobj.businessHoursPhone = this.businessHoursPhone;
    //this.tenderbiddetailsobj.contactAddress = this.contactAddress;

    console.log("On Next Button click----------------->" + this.MailingAddress);

    console.log("nomContDOB----------------->" + this.nomContDOB);

    this.tenderbiddetailsobj.MailingAddress = this.MailingAddress;

    this.tenderbiddetailsobj.MailingStreet = this.MailingStreet;
    this.tenderbiddetailsobj.MailingCity = this.MailingCity;
    this.tenderbiddetailsobj.MailingState = this.MailingState;
    this.tenderbiddetailsobj.MailingCountry = this.MailingCountry;
    this.tenderbiddetailsobj.MailingPostalCode = this.MailingPostalCode;

    this.tenderbiddetailsobj.entityType = this.entityType;
    this.tenderbiddetailsobj.primaryJointHolder = this.primaryJointHolder;
    this.tenderbiddetailsobj.isJointHolder = this.isJointHolder;
    this.tenderbiddetailsobj.jointHolders = this.jointHolders;
    this.tenderbiddetailsobj.tenderBidAmount = this.tenderBidAmount;

    this.joinholderfinalmappublic = this.joinholderfinalmap;
    this.jointholderreadonlypublic = this.jointholderreadonly;

    this.buttonEventName = "Back";
    const buttonEvent = new CustomEvent("biddetailsback");

    // Dispatches the event.
    this.dispatchEvent(buttonEvent);

    console.log("<--Previous Fired--->");
  }

  handleReviewPrevious() {
    this.buttonEventName = "Back";
    const buttonEvent = new CustomEvent("reviewback");

    // Dispatches the event.
    this.dispatchEvent(buttonEvent);

    console.log("<--Review Back Fired--->");
  }

  callConfirmationModal() {
    console.log("<--this.corpName--->" + this.corpName);

    if (this.entityType === "Corporation" && this.corpName === undefined) {
      console.log("inside false");
      const evt = new ShowToastEvent({
        title: "Error!",
        message: "Please enter a valid ACN",
        variant: "error"
      });
      this.dispatchEvent(evt);
    } else {
      this.openconfiramtionmodal = true;
    }
  }

  modalClickYes() {
    this.openconfiramtionmodal = false;
    this.handleNext();
  }

  modalClickNo() {
    this.openconfiramtionmodal = false;
  }

  handleReviewSubmit() {
    const allValid = [...this.template.querySelectorAll(".validValue")].reduce(
      (validSoFar, inputCmp) => {
        inputCmp.reportValidity();
        return validSoFar && inputCmp.checkValidity();
      },
      true
    );
    if (allValid) {
      this.tenderbiddetailsobj.indFirstName = this.indFirstName;
      this.tenderbiddetailsobj.indOtherNames = this.indOtherNames;
      this.tenderbiddetailsobj.indLastName = this.indLastName;
      this.tenderbiddetailsobj.indDOB = this.indDOB;
      this.tenderbiddetailsobj.indDLNumber = this.indDLNumber;
      this.tenderbiddetailsobj.indDLStateOfIssue = this.indDLStateOfIssue;
      this.tenderbiddetailsobj.corpName = this.corpName;
      this.tenderbiddetailsobj.corpACN = this.corpACN;
      this.tenderbiddetailsobj.nomConFirstName = this.nomConFirstName;
      this.tenderbiddetailsobj.nomConOtherNames = this.nomConOtherNames;
      this.tenderbiddetailsobj.nomConLastName = this.nomConLastName;
      this.tenderbiddetailsobj.nomContPosTitle = this.nomContPosTitle;
      this.tenderbiddetailsobj.nomContDOB = this.nomContDOB;
      this.tenderbiddetailsobj.corpDLNumber = this.corpDLNumber;
      this.tenderbiddetailsobj.corpDLStateOfIssue = this.corpDLStateOfIssue;
      this.tenderbiddetailsobj.prefContactMethod = this.prefContactMethod;
      this.tenderbiddetailsobj.contactEmail = this.contactEmail;
      this.tenderbiddetailsobj.businessHoursPhone = this.businessHoursPhone;
      //this.tenderbiddetailsobj.contactAddress = this.contactAddress;

      console.log(
        "On Next Button Submit----------------->" + this.MailingAddress
      );

      console.log("nomContDOB----------------->" + this.nomContDOB);

      this.tenderbiddetailsobj.MailingAddress = this.MailingAddress;

      this.tenderbiddetailsobj.MailingStreet = this.MailingStreet;
      this.tenderbiddetailsobj.MailingCity = this.MailingCity;
      this.tenderbiddetailsobj.MailingState = this.MailingState;
      this.tenderbiddetailsobj.MailingCountry = this.MailingCountry;
      this.tenderbiddetailsobj.MailingPostalCode = this.MailingPostalCode;

      this.tenderbiddetailsobj.entityType = this.entityType;
      this.tenderbiddetailsobj.primaryJointHolder = this.primaryJointHolder;
      this.tenderbiddetailsobj.isJointHolder = this.isJointHolder;
      this.tenderbiddetailsobj.jointHolders = this.jointHolders;
      this.tenderbiddetailsobj.tenderBidAmount = this.tenderBidAmount;

      this.joinholderfinalmappublic = this.joinholderfinalmap;
      this.jointholderreadonlypublic = this.jointholderreadonly;

      this.buttonEventName = "Submit";
      const buttonEvent = new CustomEvent("reviewsubmit");

      // Dispatches the event.
      this.dispatchEvent(buttonEvent);

      console.log("<--Submit Fired--->");
    }
  }

  handlejoinholderclose(event) {
    console.log("<--Event Caught--->");
    console.log("event.target.currentkey--->" + event.target.currentkey);
    console.log(
      "Stringify response---------------------------------------------->" +
        JSON.stringify(this.jointholderreadonly)
    );
    console.log(
      "joinholderfinalmap---------------------------------------------->" +
        JSON.stringify(this.joinholderfinalmap)
    );

    console.log(
      "mapOfValuesJointHolder  Close --->" +
        JSON.stringify(this.mapOfValuesJointHolder)
    );

    //this.getTenderID = "a2x0k0000001JsKAAU";

    if (this.jointholderreadonly !== undefined) {
      console.log("Defined");

      this.mapOfValuesJointHolder = [];
      //this.jointholderreadonlynew = {};
      //this.joinholderfinalmapnew = undefined;
      this.jointholderreadonlynew = {};
      this.joinholderfinalmap = new Map();

      let checkKeyDuplicates = [];

      for (let key in this.jointholderreadonly) {
        this.jointholderreadonlynew = {};
        console.log("Fine till here 1");
        // Preventing unexcepted data
        if (
          this.jointholderreadonly.hasOwnProperty(key) &&
          Number(key) !== Number(event.target.currentkey)
        ) {
          console.log("type--->" + this.jointholderreadonly[key].type);

          // Filtering the data in the loop
          this.mapOfValuesJointHolder.push({
            value: this.jointholderreadonly[key],
            key: key
          });
          console.log("Fine till here 2");

          console.log(
            "currentkey--->" + this.jointholderreadonly[key].currentkey
          );

          this.jointholderreadonlynew.currentkey = key;
          console.log("Fine till here 2A");
          this.jointholderreadonlynew.type = this.jointholderreadonly[key].type;
          this.jointholderreadonlynew.name = this.jointholderreadonly[key].name;
          this.jointholderreadonlynew.email = this.jointholderreadonly[
            key
          ].email;
          this.jointholderreadonlynew.phone = this.jointholderreadonly[
            key
          ].phone;

          console.log("Fine till here 3");

          console.log(
            "After Fine till here 3--->" +
              JSON.stringify(this.jointholderreadonlynew)
          );

          //let insideobjnew = this.jointholderreadonlynew;

          console.log("Fine till here 3a");

          console.log(
            "Fine till here 3a after currentkey" + event.target.currentkey
          );

          if (this.joinholderfinalmap.has(String(event.target.currentkey))) {
            console.log("THE RECORD IS ALREADY THERE--->");
            let insideobj = this.jointholderreadonlynew;
            this.joinholderfinalmap.set(String(key), insideobj);
          } else {
            console.log("THE RECORD IS NEW-->");
            console.log(
              "CURRENT KEY UPDATING" +
                String(this.jointholderreadonly[key].currentkey)
            );
            let insideobj = this.jointholderreadonlynew;
            console.log("String(key)------------->" + String(key));
            console.log("insideobj------------->" + JSON.stringify(insideobj));
            this.joinholderfinalmap.set(String(key), insideobj);
          }

          console.log("joinholderfinalmap--->" + this.joinholderfinalmap);

          console.log(
            "joinholderfinalmap--->" +
              JSON.stringify(this.joinholderfinalmap.values())
          );
          //this.joinholderfinalmapnew.set(String(event.target.currentkey), this.jointholderreadonlynew);

          console.log("Fine till here 4");
          console.log("joinholderfinalmap--->" + this.joinholderfinalmap);
          console.log(
            "joinholderfinalmap--->" +
              JSON.stringify(this.joinholderfinalmap.values())
          );

          console.log(
            " After Fine till here 4--->" +
              JSON.stringify(this.joinholderfinalmap)
          );

          // this.finalkey = key;
        }
      }
      console.log("Fine till here 5");
      this.jointholderreadonly = undefined;

      console.log(
        "joinholderfinalmap--->" +
          JSON.stringify(this.joinholderfinalmap.values())
      );

      console.log(
        "Before jointholderreadonly--->" +
          JSON.stringify(this.jointholderreadonly)
      );

      this.jointholderreadonly = Object.fromEntries(this.joinholderfinalmap);

      console.log(
        "jointholderreadonly--->" + JSON.stringify(this.jointholderreadonly)
      );

      console.log(
        "mapOfValuesJointHolder Final--------->" +
          JSON.stringify(this.mapOfValuesJointHolder)
      );
    }

    //this.joinholderfinalmap.set(String(event.target.currentkey), insideobj);
    /*
      for (let key in this.jointholderreadonly) {

        console.log("key jointholderreadonly-------->"+key);

        // logic to check the current key no

        if(Number(event.target.currentkey) < Number(key)){
          this.jointholderdetailsobjlocalNew = {};

          let finalNewKey = Number(key) - Number(1);
          console.log("finalNewKey-->"+ finalNewKey);

          this.jointholderdetailsobjlocalNew.currentkey = finalNewKey;
          this.jointholderdetailsobjlocalNew.type =
              this.jointholderreadonly[key].type;
          this.jointholderdetailsobjlocalNew.name =
               this.jointholderreadonly[key].name;
          this.jointholderdetailsobjlocalNew.email =
              this.jointholderreadonly[key].email;
          this.jointholderdetailsobjlocalNew.phone =
              this.jointholderreadonly[key].phone;

            console.log("Greater than the current key--------->" +JSON.stringify(this.jointholderdetailsobjlocalNew));

            // this.joinholderfinalmap.set(String(finalNewKey), this.jointholderdetailsobjlocalNew);
            delete this.jointholderreadonly[key];
            console.log("After delete--------->" +JSON.stringify(this.jointholderreadonly));

            //this.joinholderfinalmap.set(String(event.target.currentkey), insideobj)

            let insideobj = this.jointholderdetailsobjlocalNew;
            this.joinholderfinalmapNew.set(String(finalNewKey), insideobj);

            //this.jointholderreadonly.add(string(finalNewKey),insideobj);
            console.log("New Addition --------->" +JSON.stringify(this.joinholderfinalmapNew));


        }else if (Number(key) === Number(event.target.currentkey)) {
          console.log("KEYS ARE EQUAL------->");
           console.log("KEYS  VALUE------->"+JSON.stringify(this.jointholderreadonly[key]));
          delete this.jointholderreadonly[key];
     
        }else if(Number(event.target.currentkey) > Number(key)){
          this.jointholderdetailsobjlocalNew = {};
          this.jointholderdetailsobjlocalNew.currentkey = Number(key);
          this.jointholderdetailsobjlocalNew.type =
              this.jointholderreadonly[key].type;
          this.jointholderdetailsobjlocalNew.name =
               this.jointholderreadonly[key].name;
          this.jointholderdetailsobjlocalNew.email =
              this.jointholderreadonly[key].email;
          this.jointholderdetailsobjlocalNew.phone =
              this.jointholderreadonly[key].phone;

              console.log("Original Key --------->" +Number(key));
              console.log("iNSIDE Less than --------->" + JSON.stringify(this.jointholderdetailsobjlocalNew));

            let insideobj = this.jointholderdetailsobjlocalNew;
            this.joinholderfinalmapNew.set(String(key), insideobj);

              // this.joinholderfinalmap.set(String(key), this.jointholderdetailsobjlocalNew);
      }
    }

     console.log("this.jointholderreadonly------------>" +JSON.stringify(this.jointholderreadonly));
      console.log("this.joinholderfinalmapNew------------>" +JSON.stringify(this.joinholderfinalmapNew));


      this.jointholderreadonly = [];
      console.log("this.jointholderreadonly MAKE SURE ENULL------------>" +JSON.stringify(this.jointholderreadonly));

      this.joinholderfinalmap = this.joinholderfinalmapNew;
      this.joinholderfinalmappublic = this.joinholderfinalmap;

      this.jointholderreadonly = Object.fromEntries(this.joinholderfinalmapNew);
      this.jointholderreadonlypublic =this.jointholderreadonly;

      console.log("jointholderreadonly--->" + JSON.stringify(this.jointholderreadonly));

      this.mapOfValuesJointHolder = [];

                for (let key in this.jointholderreadonly) {
                          // Preventing unexcepted data
                          if (this.jointholderreadonly.hasOwnProperty(key)) {
                            // Filtering the data in the loop
                            this.mapOfValuesJointHolder.push({
                              value: this.jointholderreadonly[key],
                              key: key
                            });

                            this.finalkey = key;
                          }
                    }
                  console.log("mapOfValuesJointHolder Final--------->" +JSON.stringify(this.mapOfValuesJointHolder) );


                  
    this.tenderbiddetailsobj.indFirstName = this.indFirstName;
    this.tenderbiddetailsobj.indOtherNames = this.indOtherNames;
    this.tenderbiddetailsobj.indLastName = this.indLastName;
    this.tenderbiddetailsobj.indDOB = this.indDOB;
    this.tenderbiddetailsobj.indDLNumber = this.indDLNumber;
    this.tenderbiddetailsobj.indDLStateOfIssue = this.indDLStateOfIssue;
    this.tenderbiddetailsobj.corpName = this.corpName;
    this.tenderbiddetailsobj.corpACN = this.corpACN;
    this.tenderbiddetailsobj.nomConFirstName = this.nomConFirstName;
    this.tenderbiddetailsobj.nomConOtherNames = this.nomConOtherNames;
    this.tenderbiddetailsobj.nomConLastName = this.nomConLastName;
    this.tenderbiddetailsobj.nomContPosTitle = this.nomContPosTitle;
    this.tenderbiddetailsobj.nomContDOB = this.nomContDOB;
    this.tenderbiddetailsobj.corpDLNumber = this.corpDLNumber;
    this.tenderbiddetailsobj.corpDLStateOfIssue = this.corpDLStateOfIssue;
    this.tenderbiddetailsobj.prefContactMethod = this.prefContactMethod;
    this.tenderbiddetailsobj.contactEmail = this.contactEmail;
    this.tenderbiddetailsobj.businessHoursPhone = this.businessHoursPhone;
    //this.tenderbiddetailsobj.contactAddress = this.contactAddress;

    console.log("On Next Button click----------------->" + this.MailingAddress);

    console.log("nomContDOB----------------->" + this.nomContDOB);

    this.tenderbiddetailsobj.MailingAddress = this.MailingAddress;
    /*
    this.tenderbiddetailsobj.MailingStreet = this.MailingStreet;
    this.tenderbiddetailsobj.MailingCity = this.MailingCity;
    this.tenderbiddetailsobj.MailingState = this.MailingState;
    this.tenderbiddetailsobj.MailingCountry = this.MailingCountry;
    this.tenderbiddetailsobj.MailingPostalCode = this.MailingPostalCode;

    this.tenderbiddetailsobj.entityType = this.entityType;
    this.tenderbiddetailsobj.primaryJointHolder = this.primaryJointHolder;
    this.tenderbiddetailsobj.isJointHolder = this.isJointHolder;
    this.tenderbiddetailsobj.jointHolders = this.jointHolders;
    this.tenderbiddetailsobj.tenderBidAmount = this.tenderBidAmount;

    this.joinholderfinalmappublic = this.joinholderfinalmap;
    this.jointholderreadonlypublic = this.jointholderreadonly;

    this.buttonEventName = "Close";
   const buttonEvent = new CustomEvent("jointholdercloseupdate");
    // Dispatches the event.
    this.dispatchEvent(buttonEvent);

    console.log("<--Submit Fired--->");
      */
  }

  handlejoinholdersave(event) {
    console.log("<--Event Caught--->");

    console.log("type--->" + event.target.jointholderdetailsobj.type);
    console.log("name--->" + event.target.jointholderdetailsobj.name);
    console.log("event.target.currentkey--->" + event.target.currentkey);

    console.log(
      "jointHoldersreadyonly--->" + JSON.stringify(this.jointHoldersreadyonly)
    );

    console.log(
      "mapOfValuesJointHolder--->" + JSON.stringify(this.mapOfValuesJointHolder)
    );

    console.log(
      "this.jointholderreadonly------------>" +
        JSON.stringify(this.jointholderreadonly)
    );

    const result = this.mapOfValuesJointHolder.reduce(function (map, obj) {
      map[obj.key] = obj.val;
      return map;
    }, {});

    console.log(result);

    console.log("result--->" + JSON.stringify(this.result));

    if (this.jointholderreadonly !== undefined) {
      console.log("not undefined");

      for (let key in this.jointholderreadonly) {
        if (key === event.target.currentkey) {
          this.jointholderdetailsobjlocal.currentkey = event.target.currentkey;
          console.log("Inside for key loop---->" + key);
          console.log(
            "this.jointholderreadonly[key].type---->" +
              this.jointholderreadonly[key].type
          );
          console.log(
            "this.jointholderreadonly[key].type---->" +
              this.jointholderdetailsobjlocal.type
          );
          if (
            this.jointholderdetailsobjlocal.type !==
            this.jointholderreadonly[key].type
          ) {
            this.jointholderdetailsobjlocal.type = this.jointholderreadonly[
              key
            ].type;
          }
          if (
            this.jointholderdetailsobjlocal.name !==
            this.jointholderreadonly[key].name
          ) {
            this.jointholderdetailsobjlocal.name = this.jointholderreadonly[
              key
            ].name;
          }
          if (
            this.jointholderdetailsobjlocal.email !==
            this.jointholderreadonly[key].email
          ) {
            this.jointholderdetailsobjlocal.email = this.jointholderreadonly[
              key
            ].email;
          }
          if (
            this.jointholderdetailsobjlocal.phone !==
            this.jointholderreadonly[key].phone
          ) {
            this.jointholderdetailsobjlocal.phone = this.jointholderreadonly[
              key
            ].phone;
          }
        }
      }
    }

    console.log(
      "jointholderdetailsobjlocal local before next IF--->" +
        JSON.stringify(this.jointholderdetailsobjlocal)
    );

    if (
      this.jointholderdetailsobjlocal.currentkey === event.target.currentkey
    ) {
      console.log("THIS HAS PASSED");
      if (
        this.jointholderdetailsobjlocal.type !==
          event.target.jointholderdetailsobj.type &&
        event.target.jointholderdetailsobj.type !== undefined
      ) {
        this.jointholderdetailsobjlocal.type =
          event.target.jointholderdetailsobj.type;
      } else if (
        this.jointholderdetailsobjlocal.name !==
          event.target.jointholderdetailsobj.name &&
        event.target.jointholderdetailsobj.name !== undefined
      ) {
        this.jointholderdetailsobjlocal.name =
          event.target.jointholderdetailsobj.name;
      } else if (
        this.jointholderdetailsobjlocal.email !==
          event.target.jointholderdetailsobj.email &&
        event.target.jointholderdetailsobj.email !== undefined
      ) {
        this.jointholderdetailsobjlocal.email =
          event.target.jointholderdetailsobj.email;
      } else if (
        this.jointholderdetailsobjlocal.phone !==
          event.target.jointholderdetailsobj.phone &&
        event.target.jointholderdetailsobj.phone !== undefined
      ) {
        this.jointholderdetailsobjlocal.phone =
          event.target.jointholderdetailsobj.phone;
      }
    } else {
      this.jointholderdetailsobjlocal = {};

      this.jointholderdetailsobjlocal.currentkey = event.target.currentkey;
      this.jointholderdetailsobjlocal.type =
        event.target.jointholderdetailsobj.type;
      this.jointholderdetailsobjlocal.name =
        event.target.jointholderdetailsobj.name;
      this.jointholderdetailsobjlocal.email =
        event.target.jointholderdetailsobj.email;
      this.jointholderdetailsobjlocal.phone =
        event.target.jointholderdetailsobj.phone;
    }

    console.log(
      "jointholderdetailsobjlocal local--->" +
        JSON.stringify(this.jointholderdetailsobjlocal)
    );

    if (this.joinholderfinalmap.has(String(event.target.currentkey))) {
      console.log("THE RECORD IS ALREADY THERE--->");
      let insideobj = this.jointholderdetailsobjlocal;
      this.joinholderfinalmap.set(String(event.target.currentkey), insideobj);
    } else {
      console.log("THE RECORD IS NEW-->");
      let insideobj = this.jointholderdetailsobjlocal;
      this.joinholderfinalmap.set(String(event.target.currentkey), insideobj);
    }

    console.log("joinholderfinalmap--->" + this.joinholderfinalmap);

    console.log(
      "joinholderfinalmap--->" +
        JSON.stringify(this.joinholderfinalmap.values())
    );

    console.log(
      "Map values-->" + JSON.stringify(this.joinholderfinalmap.get("1"))
    );

    console.log(
      "Map values-->" + JSON.stringify(this.joinholderfinalmap.get("2"))
    );

    console.log(
      "Map values-->" + JSON.stringify(this.joinholderfinalmap.get("3"))
    );

    this.jointholderreadonly = Object.fromEntries(this.joinholderfinalmap);

    console.log(
      "jointholderreadonly--->" + JSON.stringify(this.jointholderreadonly)
    );

    console.log("<---this.jointholderreadonly.length -->");
    console.log("<---Lenght -->" + this.jointholderreadonly.length);
  }

  handleAddressSelection(event) {
    console.log("this.mailingstreet----->" + event.target.mailingstreet);
    console.log("this.mailingcity----->" + event.target.mailingcity);
    console.log("this.mailingstate----->" + event.target.mailingstate);
    console.log("this.mailingzipcode----->" + event.target.mailingzipcode);
    console.log("this.mailingcounty----->" + event.target.mailingcounty);

    console.log(
      "BID DEtails selectedAddress----->" + event.target.selectedAddress
    );

    console.log(
      "this.mergeaddressmanualservice----->" +
        event.target.mergeaddressmanualservice
    );

    // this.MailingAddress = event.target.selectedAddress;
    this.MailingAddress = event.target.mergeaddressmanualservice;
    this.MailingStreet = event.target.mailingstreet;
    this.MailingCity = event.target.mailingcity;
    this.MailingState = event.target.mailingstate;
    this.MailingCountry = event.target.mailingcounty;
    this.MailingPostalCode = event.target.mailingzipcode;
  }

  ACNValidator(event) {
    console.log("this.corpACN----->" + this.corpACN);
    let endpoint = "https://hosted.mastersoftgroup.com/harmony/rest/";
    let key =
      "dHJhbnNwb3J0dXNlcjpTTGtRV1N0ZDJFRkZIT1AzZ0hkMUV4YVhmMk1MUVo0cw===";
    let transactionId = this.getTransactionID; //This ID is the id got from the init method

    if (this.corpACN !== undefined) {
      console.log("this.corpACN is undefined----->" + this.corpACN);
      // let acnWithoutSpaces = this.corpACN.replace(/ +/g, "");
      console.log("acnWithoutSpaces----->" + this.corpACN.replace(/\s/g, ""));
      let acnWithoutSpaces = this.corpACN.replace(/\s/g, "");

      let acnExpression = /^[0-9]{9}|[0-9]{3}[\s][0-9]{3}[\s][0-9]{3}$/;

      console.log("Check REGEX----->" + acnExpression.test(this.corpACN));

      //var acnWithoutSpaces = acn.replace(/ +/g, "");

      if (acnExpression.test(this.corpACN)) {
        let setParams = {
          path:
            endpoint +
            "au/companyLookup?apiName=SearchByASICv201408&name=" +
            acnWithoutSpaces,
          method: "GET",
          responseFormat: "application/json",
          bodyContent: null,
          key: key,
          bodyContentType: "application/json"
        };

        service(setParams)
          .then((result) => this.handleACNValidatorresponse(result))
          .catch((error) => this.handleError(error));
      } else if (acnWithoutSpaces.length > 8) {
        const evt = new ShowToastEvent({
          title: "Error!",
          message: "Please enter a valid ACN",
          variant: "error"
        });
        this.dispatchEvent(evt);
      }
    } else {
    }
  }

  handleError(geterror) {
    console.log("<----error----->" + geterror);
  }

  handleACNValidatorresponse(newValues) {
    this.showSpinner = false;
    console.log("<----handleACNValidatorresponse newValues----->" + newValues);
    // let myArr = JSON.parse(this.newValues);
    // console.log("myArr--->" + Jthis.myArr);
    let response = JSON.parse(newValues.body);

    console.log("<----response----->" + response);
    console.log("<----response payload----->" + response.payload);

    console.log("<----JSON response----->" + JSON.stringify(response));

    // const obj = this.json2array(response.payload);
    // console.log("<----response obj----->" + obj);

    if (JSON.stringify(response.payload) === "[]") {
      console.log("<----response payload ERROR----->" + response.payload);

      const evt = new ShowToastEvent({
        title: "Error!",
        message: "Please enter a valid ACN",
        variant: "error"
      });
      this.dispatchEvent(evt);
    } else {
      let result = this.json2array(response.payload);

      console.log("<----result----->" + result);

      //let corporatenamevalidation =this.template.querySelector(".corporatenamevalidation");

      this.corpName = result;
      //reset an error

      console.log("<----this.corpName ----->" + this.corpName);
    }
  }

  json2array(json) {
    let result = [];
    let keys = Object.keys(json);
    keys.forEach(function (key) {
      console.log("key---->" + key);
      console.log("json[key].name---->" + json[key].name);
      result.push(json[key].name);
    });
    return result;
  }
}