### MODEL PLIKU JSON, poniżej będę stosował Typescript'ową konwecję tworzenia typów:

type ExpandingListElement {  
    id: string,  
    titleArray: string[],  
    type: number,  
    nestingLevel: number  
    nestedElements: ExpandingListElement[]  
},  
  
gdzie 'type' przyjmuje wartości 0, 1, 2 oraz:  
0 - oznacza, że jest to element nierozwijalny (tzn. same wiersze kolejnych linijek tekstu),    
1 - oznacza grupę typu radio,  
2 - oznacza grupę typu checkbox  

W przypadku, gdy type = 0, przyjmijmy, że nestedElements jest pustą tablicą.

Mogli byśmy bez problemu przerobić program, aby przyjmował tablicę zawierającą ExpandingListElement,
a nie tylko pojedynczy obiekt.
