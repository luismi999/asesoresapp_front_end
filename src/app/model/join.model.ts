import { Consultation } from "./consultation.model";
import { User } from "./user.model";

export class Join {
    constructor(
        public uuid         : string,
        public date_creation: string,
        public step         : string,
        public grade        : number,
        public isActive     : boolean,
        public comment      : string,
        public user         : User,
        public consultation : Consultation,
    ){}
}