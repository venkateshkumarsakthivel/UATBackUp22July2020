import { LightningElement, track, api } from "lwc";

export default class Tendersubmissionperiod extends LightningElement {
  @api tenderbidstartdate;
  @api tenderbidenddate;
}