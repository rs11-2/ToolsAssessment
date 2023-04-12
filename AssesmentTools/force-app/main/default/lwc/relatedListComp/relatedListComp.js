import {LightningElement, track,api, wire} from 'lwc';
import getContacts from '@salesforce/apex/RelatedHandler.getContacts';
import delSelectedCons from '@salesforce/apex/RelatedHandler.deleteContacts';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import {refreshApex} from '@salesforce/apex';

const actions = [
    { label: 'Edit', name: 'edit'}, 
    { label: 'Delete', name: 'delete'}
];

const columns = [
    { label: 'FirstName', fieldName: 'FirstName',sortable: true }, 
    { label: 'LastName', fieldName: 'LastName',sortable: true },
    { label: 'Phone', fieldName: 'Phone', type: 'phone',sortable: true}, 
    { label: 'Email', fieldName: 'Email', type: 'email' ,sortable: true}, 
    {
        type: 'action',
        typeAttributes: {
            rowActions: actions,
            menuAlignment: 'right'
        }
    }
];

export default class RelatedListComp extends NavigationMixin(LightningElement) { 
    
    @track data;
    @track columns = columns;
    @track record = [];
    @track bShowModal = false;
    @track currentRecordId;
    @track isEditForm = false;
    @track showLoadingSpinner = false;
    @track sortBy;
    @track sortDirection;
    @api recordId;
    
    selectedRecords = [];
    refreshTable;
    error;

    @wire(getContacts,{
        recId:'$recordId'
    })
    contacts(result) {
        this.refreshTable = result;
        if (result.data) {
            this.data = result.data;
            this.error = undefined;

        } else if (result.error) {
            this.error = result.error;
            this.data = undefined;
        }
    }

    openContact(){
        this[NavigationMixin.Navigate]({
                type: 'standard__objectPage',
                attributes: {
                objectApiName: 'Contact',
            actionName: 'new',
            }
            });
        }

    doSorting(event) {
            this.sortBy = event.detail.fieldName;
            this.sortDirection = event.detail.sortDirection;
            window.console.log('in doSorting'+this.sortBy );
            this.sortData(this.sortBy, this.sortDirection); 
        }
   
        sortData(fieldname, direction) {
            window.console.log('in sortData');
            let parseData = JSON.parse(JSON.stringify(this.data));
            // Return the value stored in the field
            let keyValue = (a) => {
            return a[fieldname];
                };
            // cheking reverse direction
                let isReverse = direction === 'asc' ? 1: -1;
                // sorting data            
                parseData.sort((x, y) => {               
                x = keyValue(x) ? keyValue(x) : ''; // handling null values              
               y = keyValue(y) ? keyValue(y) : '';              
                // sorting values based on direction            
                return isReverse * ((x > y) - (y > x));            
                });           
               this.data = parseData;           
               }
    handleRowActions(event) { 
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch ( actionName ) {
            case 'edit':
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: row.Id,
                        objectApiName: 'Contact',
                        actionName: 'edit'
                    }
                });
                break;
            case 'delete':
                            this.deleteCons(row);
                            break;
            default:
        }
 
    }

    
    // refreshing the datatable after record edit form success
    handleSuccess() {
        return refreshApex(this.refreshTable);
    }

    deleteCons(currentRow) {
        let currentRecord = [];
        currentRecord.push(currentRow.Id);
        this.showLoadingSpinner = true;

        // calling apex class method to delete the selected contact
        delSelectedCons({lstConIds: currentRecord})
        .then(result => {
            window.console.log('result ====> ' + result);
            this.showLoadingSpinner = false;

            // showing success message
            this.dispatchEvent(new ShowToastEvent({
                title: 'Success!!',
                message: currentRow.FirstName + ' '+ currentRow.LastName +' Contact deleted.',
                variant: 'success'
            }),);

            // refreshing table data using refresh apex
             return refreshApex(this.refreshTable);

        })
        .catch(error => {
            window.console.log('Error ====> '+error);
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error!!', 
                message: error.message, 
                variant: 'error'
            }),);
        });
    }

}