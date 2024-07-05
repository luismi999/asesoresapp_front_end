import { User } from "./user.model";

export interface renewTokenResponse {
    msg  : string;
    user : User;
    token: string
}