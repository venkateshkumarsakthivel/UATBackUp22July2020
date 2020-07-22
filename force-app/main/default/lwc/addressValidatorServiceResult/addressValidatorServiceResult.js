import { LightningElement, api } from "lwc";

export default class AddressValidatorServiceResult extends LightningElement {
  @api iconName;
  @api record;

  connectedCallback() {
    console.log("record connectedCallback----------------->" + this.record);
  }

  handleOnClick() {
    console.log("record handleOnClick----------------->" + this.record);
    let selection = new CustomEvent("selection");
    this.dispatchEvent(selection);
  }
}