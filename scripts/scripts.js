import { NestedExpandingListGenerator } from "./nestedExpandingListGenerator.js";

const expandingListBlock = document.querySelector(".expanding-list-holder");
const jsonUrl = './data/data2.json';

const expandingListGenerator = new NestedExpandingListGenerator(expandingListBlock, jsonUrl);

expandingListGenerator.init();