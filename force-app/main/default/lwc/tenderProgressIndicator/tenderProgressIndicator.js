import { LightningElement, api } from 'lwc';

export default class TenderProgressIndicator extends LightningElement {
    @api
    currentStep = 'intro';

    steps = [
        { label: 'Introduction', value: 'intro' },
        { label: 'Enter Bid Details', value: 'details' },
        { label: 'Review', value: 'review' },
        { label: 'Process Payment', value: 'payment' },
        { label: 'Complete', value: 'complete' },
    ];
    
}