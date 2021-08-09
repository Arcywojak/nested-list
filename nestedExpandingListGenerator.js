/*
type ExpandingListElement {
    id: string, <- (unikalne)
    title: string,
    type: number,
    nestedElements: ExpandingListElement[] <- (Nie jestem pewien czy w TS typ może zawierać właściwość o swoim typie)
},

listElementsArray: ExpandingListElement

*/

export class NestedExpandingListGenerator {

    listElementType = {
        "PLAIN_TEXT": 0,
        "RADIO_EXPANDER": 1,
        "CHECKBOX_EXPANDER": 2
    };


    constructor(listHolder, dataJsonUrl) {
        this.listHolder = listHolder;
        this.dataJsonUrl = dataJsonUrl;
    }

    async init() {
        try {
            const fetchedData = await fetch(this.dataJsonUrl);
            const data = await fetchedData.json();
            console.log("I WORK")

            const expandingList = document.createElement("div");
            expandingList.classList.add("expanding-list");

            this.generateListElements(expandingList, data);

            this.listHolder.appendChild(expandingList);

        } catch(err) {
            console.error("error:", err)
        }


    }

    generateListElements(parentBlock, expandingListElement) {
        switch(expandingListElement.type) {
            case this.listElementType.PLAIN_TEXT:
                this.generatePlainText(parentBlock, expandingListElement);
                return;
            case this.listElementType.RADIO_EXPANDER:
                this.generateExpanderWithList(parentBlock, expandingListElement, "radio");
                return;
            case this.listElementType.CHECKBOX_EXPANDER:
                this.generateExpanderWithList(parentBlock, expandingListElement, "checkbox");
                return;
            default: return;
        }
    }

    generatePlainText(parentBlock, expandingListElement) {
        parentBlock.classList.add("expanding-list__no-more-expand", "text-block");
        parentBlock.innerHTML = expandingListElement.title;
    }

    generateExpanderWithList(parentBlock, expandingListElement, expanderTypeName) {
        const expander = this.getExpander(expandingListElement, expanderTypeName);
        const listOfExpander = this.getListOfExpander(expandingListElement);    

        parentBlock.appendChild(expander);
        parentBlock.appendChild(listOfExpander);
    }
    
    getExpander(expandingListElement, expanderTypeName) {
        const expander = document.createElement("div");
        expander.classList.add("expanding-list__expander", expanderTypeName);

        const expanderChildIcon = document.createElement("div");
        expanderChildIcon.classList.add("expanding-list__expander-icon");
        expanderChildIcon.addEventListener("click", (e) => {this.expandFn(e, expandingListElement.type)});

        const expanderChildText = document.createElement("div");
        expanderChildText.classList.add("expanding-list__expander-title", "text-block");
        expanderChildText.innerHTML = expandingListElement.title;

        expander.appendChild(expanderChildIcon);
        expander.appendChild(expanderChildText);

        return expander;
    }

    getListOfExpander(expandingListElement) {
        const listOfExpander = document.createElement("ul");
        listOfExpander.classList.add("expanding-list__to-expand");

        expandingListElement.nestedElements.map(el => {
            const listElement = document.createElement("li");
            listOfExpander.appendChild(listElement);
            this.generateListElements(listElement, el);
        })

        return listOfExpander;
    }

    expandFn(event, expandType) {
        if(expandType === this.listElementType.RADIO_EXPANDER) {
            const childrenOfList = event.target.parentNode.parentNode.parentNode.childNodes;
            childrenOfList.map(child => {})
        }

        event.target.parentNode.classList.toggle("expanded");

    }

}