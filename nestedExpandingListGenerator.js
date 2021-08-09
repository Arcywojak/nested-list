/*
type ExpandingListElement {
    id: string, <- (unikalne)
    titleArray: string[],
    type: number,
    nestingLevel: number
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


    maxHeights = {};
    heightOfTextBlock = 0;
    marginsOfList = 0;


    constructor(listHolder, dataJsonUrl) {
        this.listHolder = listHolder;
        this.dataJsonUrl = dataJsonUrl;
    }

    async init() {
        try {
            const fetchedData = await fetch(this.dataJsonUrl);
            const data = await fetchedData.json();

            const expandingList = document.createElement("div");
            expandingList.classList.add("expanding-list");

            this.generateListElements(expandingList, data);

            this.listHolder.appendChild(expandingList);

        } catch(err) {
            console.error("error:", err)
        }


    }

    generateListElements(parentBlock, expandingListElement) {

        const isArrayNE = Array.isArray(expandingListElement.nestedElements);
        if(!isArrayNE) throw new Error("nestedElemenst prop is not an array! Repair your JSON file.");
        const isArrayTA = Array.isArray(expandingListElement.titleArray)
        if(!isArrayTA) throw new Error("titleArray prop is not an array! Repair your JSON file."); 

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
        this.attachTitles(parentBlock, expandingListElement);
    }

    attachTitles(parentBlock, expandingListElement) {
        expandingListElement.titleArray.map(title => {
            const span = document.createElement("span");
            span.innerText = title;
            parentBlock.appendChild(span);
        });
    }

    generateExpanderWithList(parentBlock, expandingListElement, expanderTypeName) {
        const expander = this.getExpander(expandingListElement, expanderTypeName);
        const listOfExpander = this.getListOfExpander(expandingListElement);    

        parentBlock.appendChild(expander);
        parentBlock.appendChild(listOfExpander);
    }
    
    getExpander(expandingListElement, expanderTypeName) {
        const expander = document.createElement("div");
        expander.classList.add(
            "expanding-list__expander", 
            expanderTypeName, 
            `nesting-level_${expandingListElement.nestingLevel}`
            );

        const expanderChildIcon = document.createElement("div");
        expanderChildIcon.classList.add("expanding-list__expander-icon");
        expanderChildIcon.addEventListener("click", (e) => {this.expandFn(e, expandingListElement)});

        const expanderChildText = document.createElement("div");
        expanderChildText.classList.add("expanding-list__expander-title", "text-block");
        this.attachTitles(expanderChildText, expandingListElement);

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

    expandFn(event, expandingListElement) {
        const expanderBlock = event.target.parentNode;
        const ulList = expanderBlock.nextElementSibling;
        const isRadioType = expandingListElement.type === this.listElementType.RADIO_EXPANDER;
        const doWeTurnOnExpander = !expanderBlock.classList.contains("expanded");

        if(isRadioType && doWeTurnOnExpander) {
            //we want to turn off remained open radio groups on the same level
            this.closeRadioExpanders(expandingListElement.nestingLevel);
        }

        //we set maxHeight manually because it is the only way (that I have found)
        //to provide quite smooth animation of unfolding 
        ulList.style.maxHeight = doWeTurnOnExpander ? this.getMaxHeightString(expandingListElement) : "0";
        expanderBlock.classList.toggle("expanded");
    }

    getMaxHeightString(expandingListElement) {
        const {id} = expandingListElement;
        if(!(id in this.maxHeights)) {
            //we subtract one time height because we want height of list without the expander
            this.maxHeights[id] = this.calculateMaxHeight(expandingListElement) - this.getHeightOfTextBlock();
        }

        return `${this.maxHeights[id]}px`;
    }

    calculateMaxHeight(expandingListElement, sum = 0) {
        sum += this.getHeightOfTextBlock() * expandingListElement.titleArray.length;

        //we do no need to validate array because we did it earlier in this.getListOfExpander(...)
        if(expandingListElement.nestedElements.length > 0) {

            sum += this.getMarginsOfList();

            expandingListElement.nestedElements.map(el => {
                sum += this.calculateMaxHeight(el, 0);
            });
        }   

        return sum;
    }

    getHeightOfTextBlock() {
        if(!this.heightOfTextBlock) {
            const elementWithText = this.listHolder.querySelector(".text-block");
            const fontSizeOfText = window.getComputedStyle(elementWithText).getPropertyValue("font-size");
            const paddingBottom = window.getComputedStyle(elementWithText).getPropertyValue("padding-bottom");
            const paddingTop = window.getComputedStyle(elementWithText).getPropertyValue("padding-top");

            //we multiply by 1.2 because lineHeight is typically fontSize multiplied by 1.2
            const height = this.getNumberFromSizeInPx(fontSizeOfText)*1.2 + 
                               this.getNumberFromSizeInPx(paddingTop) + 
                               this.getNumberFromSizeInPx(paddingBottom);
            this.heightOfTextBlock = height;
        }
        
        
        return this.heightOfTextBlock;
    }

    getNumberFromSizeInPx(sizeInPx) {
        return Number(sizeInPx.slice(0, sizeInPx.length - 2));
    }

    closeRadioExpanders(nestingLevel) {
        const siblingsOfRadioExpander = this.listHolder.querySelectorAll(
            `.radio.nesting-level_${nestingLevel}`
            );

        siblingsOfRadioExpander.forEach(el => {
            const ulList = el.nextElementSibling;
            ulList.style.maxHeight = "0";
            el.classList.remove("expanded")
        });
    }

    getMarginsOfList() {
        if(!this.marginsOfList) {
            const list = this.listHolder.querySelector("ul");   
            if(!list) {
                return 0;
            }
            const marginTop = window.getComputedStyle(list).getPropertyValue("margin-top");
            const marginBottom = window.getComputedStyle(list).getPropertyValue("margin-bottom");
    
            this.marginsOfList = this.getNumberFromSizeInPx(marginTop) + this.getNumberFromSizeInPx(marginBottom);
        }

        return this.marginsOfList;
    }

}