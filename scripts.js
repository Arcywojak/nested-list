import { NestedExpandingListGenerator } from "./nestedExpandingListGenerator.js";

const expandingListBlock = document.querySelector(".expanding-list");
const jsonUrl = './data.json';

const expandingList = new NestedExpandingListGenerator(expandingListBlock, jsonUrl);

expandingList.init();