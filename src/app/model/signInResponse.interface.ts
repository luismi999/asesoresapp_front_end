import { User } from "./user.model";

export interface SignInResponse {
    msg  : string;
    user : User;
    token: string
}