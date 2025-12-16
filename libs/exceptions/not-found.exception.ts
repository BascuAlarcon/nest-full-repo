export class ItemNotFoundException extends Error {
    constructor(public readonly itemId: string) {
        super(`Item with ID ${itemId} not found.`); 
    }   
}