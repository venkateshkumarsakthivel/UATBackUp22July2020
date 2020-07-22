import { LightningElement, api, track } from "lwc";
import service from "@salesforce/apex/CustomLookUpLwcController.service";

export default class addressValidatorServiceLookUp extends LightningElement {
  @api objectApiName;
  @api iconName = "standard:account";
  @api label = "Lookup";
  @api fields = null;
  @api fieldName = null;

  @track resultClass;
  @track selectedRecord = null;
  @track results = null;
  @track message = null;
  @track showSpinner = false;
  @track lastSearchValue;

  @track getTransactionID;
  @track addresSearchResult = [];

  @api selectedAddress;

  @api mailingaddress;

  @track searchboxhide = false;

  @api addressreadonly;



  @api mailingstreet;
  @api mailingcity;
  @api mailingstate;
  @api mailingzipcode;
  @api mailingcounty;


  @api mergeaddressmanualservice;

  connectedCallback() {
     this.searchboxhide = false;
    console.log("<----Connected call back is called----->");

    console.log('addressreadonly--------->'+this.addressreadonly);
    console.log("this.mailingaddress----->" + this.mailingaddress);


    console.log("this.mailingstreet callback----->" + this.mailingstreet);
    console.log("this.mailingcity----->" + this.mailingcity);
    console.log("this.mailingstate----->" + this.mailingstate);
    console.log("this.mailingzipcode----->" + this.mailingzipcode);
    console.log("this.mailingcounty----->" + this.mailingcounty);

    if(this.mailingaddress !== undefined){
      this.searchboxhide = false;
    }

    this.lastSearchValue = this.mailingaddress;
    let endpoint = "https://hosted.mastersoftgroup.com/harmony/rest/";
    let locale = "au"; //The locale is either "au" for sot "AUPAF" and "GNAF" or "nz" for sot "NZPAF".
    let key =
      "dHJhbnNwb3J0dXNlcjpTTGtRV1N0ZDJFRkZIT1AzZ0hkMUV4YVhmMk1MUVo0cw==";

    let searchParams = {
      path: endpoint + locale + "/generateID",
      method: "GET",
      responseFormat: "application/json",
      bodyContent: null,
      key: key,
      bodyContentType: "application/json"
    };

    service(searchParams)
      .then(result => this.settransactionIdResult(result))
      .catch(error => this.handleError(error));
  }

  settransactionIdResult(newValues) {

    this.showSpinner = false;
    
   
    console.log("<----settransactionIdResult call back is called----->");
    console.log("<----newValues----->" + newValues);
    // let myArr = JSON.parse(this.newValues);
    // console.log("myArr--->" + Jthis.myArr);
    let response = JSON.parse(newValues.body);

    console.log("<----response----->" + response);
    console.log("<----response payload----->" + response.payload);
    console.log("<----JSON response----->" + JSON.stringify(response));

    if (response.payload && response.payload.lenght > 0) {
      this.message = null;
      this.getTransactionID = response.payload;
    }

    if(this.addressreadonly === true){
      this.searchboxhide = false;
    }

    /* if (newValues && newValues.length > 0) {
      this.message = null;
      this.transactionId = newValues;

    }*/
  }

  handleManualAddress(event){

    console.log("this.mailingstreet----->" + event.target.mailingstreet);
    console.log("this.mailingcity----->" + event.target.mailingcity);
    console.log("this.mailingstate----->" + event.target.mailingstate);
    console.log("this.mailingzipcode----->" + event.target.mailingzipcode);
    console.log("this.mailingcounty----->" + event.target.mailingcounty);

   this.mailingstreet =  event.target.mailingstreet;
   this.mailingcity =  event.target.mailingcity;
   this.mailingstate =  event.target.mailingstate;
   this.mailingzipcode =  event.target.mailingzipcode;
   this.mailingcounty =  event.target.mailingcounty;

    let mergemanualaddress = "";

    if(this.mailingstreet !== null){
        mergemanualaddress = this.mailingstreet;
    }
    if(this.mailingcity !== null){
        mergemanualaddress = mergemanualaddress+","+this.mailingcity;
    }
    if(this.mailingstate !== null){
        mergemanualaddress = mergemanualaddress+" "+this.mailingstate;
    }
    if(this.mailingzipcode !== null){
        mergemanualaddress = mergemanualaddress+" "+this.mailingzipcode;
    }
     if(this.mailingcounty !== null){
      //  mergemanualaddress = mergemanualaddress+","+this.mailingcounty;
    }

    console.log("mergemanualaddress-------->"+mergemanualaddress);

    if(mergemanualaddress !== null){
       this.mergeaddressmanualservice = mergemanualaddress;

    this.selectedAddress = mergemanualaddress;
    //this.lastSearchValue = mergemanualaddress;
    }

  let addressSelected = new CustomEvent("addressselectionmanual");
  this.dispatchEvent(addressSelected);

  }

  handleSearchTerm(event) {
    let searchValue = event.target.finalchangedvalue;

    console.log(
      "this.finalchangedvalue----->" + event.target.finalchangedvalue
    );

    /*
    this.switchResult(true);
    this.message = "searching...";
    this.showSpinner = true;
*/

  if(this.finalchangedvalue !== null){
    let endpoint = "https://hosted.mastersoftgroup.com/harmony/rest/";
    let locale = "au"; //The locale is either "au" for sot "AUPAF" and "GNAF" or "nz" for sot "NZPAF".
    let key =
      "dHJhbnNwb3J0dXNlcjpTTGtRV1N0ZDJFRkZIT1AzZ0hkMUV4YVhmMk1MUVo0cw===";
    console.log("searchValue----->" + searchValue);
    let searchString = searchValue;
    console.log("searchString----->" + searchString);

    let transactionId = this.getTransactionID; //This ID is the id got from the init method
    let sot = "AUPAF"; // The sot can be AUPAF, GNAF, NZPAF
    let params =
      "sourceOfTruth=" +
      sot +
      "&transactionID=" +
      transactionId +
      "&fullAddress=" +
      encodeURIComponent(String(searchString).trim());
    let extraParams =
      "&featureOptions=exposeAttributes:1;singleLineHitNumber:10;";

    if (searchString && searchString.length > 3) {
      let searchParams = {
        path: endpoint + locale + "/address?" + params,
        method: "GET",
        responseFormat: "application/json",
        bodyContent: null,
        key: key,
        bodyContentType: "application/json"
      };

      service(searchParams)
        .then(result => this.setResult(result))
        .catch(error => this.handleError(error));
    } else {
      this.addresSearchResult = [];
    }

  }else{
    this.selectedAddress = "";
    this.lastSearchValue = "";

    let addressSelected = new CustomEvent("addressselection");
    this.dispatchEvent(addressSelected);

    this.addresSearchResult = [];

  }
  console.log("this.selectedAddress------>"+this.selectedAddress);
  }

  setResult(newValues) {
    this.showSpinner = false;
   
    console.log("<----setResult call back is called----->");
    console.log("<----newValues----->" + newValues);
    // let myArr = JSON.parse(this.newValues);
    // console.log("myArr--->" + Jthis.myArr);
    let response = JSON.parse(newValues.body);

    console.log("<----response----->" + response);
    console.log("<----response payload----->" + response.payload);
    console.log("<----hasOwnProperty----->" +response.payload.hasOwnProperty("fullAddress"));
    console.log("<----JSON response----->" + JSON.stringify(response));
   
    
    let getPayload = JSON.stringify(response);
   // console.log("<----JSON response.payload----->" + JSON.stringify(response.payload));

    this.results = JSON.stringify(response.payload);

    console.log("<---- this.results----->" +  this.results);

    console.log("response.payload.length--->" + response.payload.length);

    this.addresSearchResult = this.json2array(response.payload);

    console.log("this.addresSearchResult--->" + this.addresSearchResult);
    console.log(
      "this.addresSearchResult JSON--->" +
        JSON.stringify(this.addresSearchResult)
    );

    if(this.addresSearchResult !== null && this.addresSearchResult !== undefined){
       this.searchboxhide = true;
    }
    /*  for (let i = 0; i < response.payload.length; i++) {
      let obj = this.response.payload[i];

      console.log("obj-------->" + obj);
    }

    if (newValues && newValues.length > 0) {
      this.message = null;
      this.transactionId = newValues; 

    }*/
  }

  json2array(json) {
    let result = [];
    let keys = Object.keys(json);
    keys.forEach(function(key) {
      console.log("key---->" + key);
      console.log("json[key].fullAddress---->" + json[key].fullAddress);
      result.push(json[key].fullAddress);
    });
    return result;
  }

  handleRecordSelect(event) {
    this.searchboxhide = false;
    let selectedValue = event.target.record;

    if(selectedValue !== null){
    this.selectedAddress = event.target.record;
    this.lastSearchValue = event.target.record;

    this.mergeaddressmanualservice =  event.target.record;

   this.mailingstreet =  "";
   this.mailingcity =  "";
   this.mailingstate =  "";
   this.mailingzipcode =  "";
   this.mailingcounty =  "";

    }else{
    this.selectedAddress = "";
    this.lastSearchValue = "";
    }

    console.log("this.record----->" + event.target.record);
    let addressSelected = new CustomEvent("addressselection");
    this.dispatchEvent(addressSelected);

    this.addresSearchResult = [];
   
  }
}