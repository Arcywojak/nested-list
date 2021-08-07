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
    constructor(listHolder, dataJsonUrl) {
        this.listHolder = listHolder;
        this.dataJsonUrl = dataJsonUrl;
    }

    async init() {
        try {
            const fetchedData = await fetch(this.dataJsonUrl);
            const data = await fetchedData.json();
        } catch(err) {
            console.error("error:", err)
        }


    }
}