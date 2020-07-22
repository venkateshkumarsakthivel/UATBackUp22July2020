import { LightningElement, api } from "lwc";
import p2pTilelogo from "@salesforce/resourceUrl/p2p_taxi";
import taxiTenderDetailsDoc from "@salesforce/resourceUrl/taxiTenderDetails";

export default class TaxiTenderBidIntro extends LightningElement {
  @api name;
  @api buttonEventName;
  @api applicationfee;
  @api tenderperioddays;

  // Expose the static resource URL for use in the template
  p2pTileUrl = p2pTilelogo;
  taxiTenderDetailsUrl = taxiTenderDetailsDoc;

  handleNext() {
    this.buttonEventName = "Next";
    const buttonEvent = new CustomEvent("eventintronext");

    // Dispatches the event.
    this.dispatchEvent(buttonEvent);

    console.log("<--Event fired--->");
  }
}