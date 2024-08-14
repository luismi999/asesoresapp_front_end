export interface CreateConsultation {
    day         : string;
    start       : string;
    end         : string;
    uuid_user   : string | undefined;
    uuid_subject: string | undefined;
}