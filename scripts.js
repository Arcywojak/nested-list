import { NestedExpandingListGenerator } from "./nestedExpandingListGenerator.js";

const expandingListBlock = document.querySelector(".expanding-list-holder");
const jsonUrl = './data.json';

const expandingListGenerator = new NestedExpandingListGenerator(expandingListBlock, jsonUrl);

expandingListGenerator.init();