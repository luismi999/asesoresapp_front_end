import { Join } from "./join.model";
import { Subject } from "./subject.model";
import { User } from "./user.model";

export class Consultation {
    constructor(
        public uuid         : string,
        public date_creation: string,
        public day          : string,
        public start        : string,
        public end          : string,
        public map_longitud : string,
        public map_latitud  : string,
        public isActive     : boolean,
        public subject      : Subject,
        public user         : User,
        public joins        : Join[]
    ){}
}