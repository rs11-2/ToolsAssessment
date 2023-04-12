import { createElement } from 'lwc';
import RelatedListComp from 'c/relatedListComp';

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

        // Act
        document.body.appendChild(element);
        const ele = element.shadowRoot.querySelector('lightning-button');
        ele.click();
        // Assert
        // const div = element.shadowRoot.querySelector('div');
        expect(ele).toBeDefined();
    });
});