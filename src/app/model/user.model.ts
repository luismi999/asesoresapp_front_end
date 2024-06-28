import { Consultation } from "./consultation.model";

export class User {
    constructor( 
        public uuid               : string,
        public institutional_code : string,
        public institutional_email: string,
        public first_name         : string,
        public last_name          : string,
        public cellphone_number   : number,
        public role               : string,
        public isActive           : boolean
    ){}
}