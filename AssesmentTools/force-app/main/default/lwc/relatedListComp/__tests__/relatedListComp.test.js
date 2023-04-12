import { createElement } from 'lwc';
import RelatedListComp from 'c/relatedListComp';
import getContacts from '@salesforce/apex/RelatedHandler.getContacts';
import deleteContacts from '@salesforce/apex/RelatedHandler.deleteContacts';


const mockdata = require('./data/result.json');
const mockdelRes = require('./data/deleterec.json');

async function flushPromises() {
    return Promise.resolve();
}

jest.mock(
    "@salesforce/apex/RelatedHandler.getContacts",
    () => {
        const { createApexTestWireAdapter } = require("@salesforce/sfdx-lwc-jest");
        return {
            default: createApexTestWireAdapter(jest.fn()),
        };
    },
    { virtual: true }
);

jest.mock(
    "@salesforce/apex/RelatedHandler.deleteContacts",
    () => {
        return {
            default: jest.fn()
        };
    },
    { virtual: true }
);

describe('c-related-list-comp', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('Testing new button ', () => {
        // Arrange
        const element = createElement('c-related-list-comp', {
            is: RelatedListComp
        });

        document.body.appendChild(element);
        const ele = element.shadowRoot.querySelector('lightning-button');
        ele.click();
        expect(ele).toBeDefined();
    });
    it('Testing lightning table with data ', async() => {
        // Arrange
        const element = createElement('c-related-list-comp', {
            is: RelatedListComp
        });
        getContacts.emit(mockdata);
        document.body.appendChild(element);
        const ele = element.shadowRoot.querySelector('lightning-datatable');
        ele.dispatchEvent(new CustomEvent('sort',{
            detail:{fieldName:'FirstName',sortDirection:'DESC'}
        }));
        await flushPromises();
        expect(ele).toBeDefined();
    });

    it('Testing lightning table with actions ', async() => {
        // Arrange
        const element = createElement('c-related-list-comp', {
            is: RelatedListComp
        });
        getContacts.emit(mockdata);
        document.body.appendChild(element);
        const ele = element.shadowRoot.querySelector('lightning-datatable');
        ele.dispatchEvent(new CustomEvent('rowaction',{
            detail:{action: {name:'edit'},row:{Id:"0035i00000PJAMfAAP"}}
        }));
        await flushPromises();
        const ele1 = element.shadowRoot.querySelector('lightning-datatable');
        deleteContacts.mockResolvedValue(mockdelRes);

        ele1.dispatchEvent(new CustomEvent('rowaction',{
            detail:{action: {name:'delete'},row:{Id:"0035i00000PJAMfAAP"}}
        }));
       // await flushPromises();
        await flushPromises();
        expect(ele).toBeDefined();
    });

    it('Testing lightning table with actions catch block ', async() => {
        // Arrange
        const element = createElement('c-related-list-comp', {
            is: RelatedListComp
        });
        getContacts.emit(mockdata);
        document.body.appendChild(element);
        const ele = element.shadowRoot.querySelector('lightning-datatable');
        ele.dispatchEvent(new CustomEvent('rowaction',{
            detail:{action: {name:'edit'},row:{Id:"0035i00000PJAMfAAP"}}
        }));
        await flushPromises();
        const ele1 = element.shadowRoot.querySelector('lightning-datatable');
        deleteContacts.mockRejectedValue({});

        ele1.dispatchEvent(new CustomEvent('rowaction',{
            detail:{action: {name:'delete'},row:{Id:"0035i00000PJAMfAAP"}}
        }));
       // await flushPromises();
        await flushPromises();
        expect(ele).toBeDefined();
    });
});