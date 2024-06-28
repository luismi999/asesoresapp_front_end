export interface CreateConsultation {
    day         : string;
    start       : string;
    end         : string;
    map_longitud: string;
    map_latitud : string;
    uuid_user   : string | undefined;
    uuid_subject: string | undefined;
}