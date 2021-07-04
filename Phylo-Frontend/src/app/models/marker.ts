/**
 * @file Model class to create marker objects
 * @author Gerard Garcia
 * @version 1.0
 * @date 10/05/2021
*/
export class Marker {
    
    /**
     * Creates an instance of Marker.
     * @author Gerard Garcia
     * @version 1.0
     * @date 14/05/2021
     * @param {number} marker_id
     * @param {number} specie
     * @param {number} user
     * @param {number} longitude
     * @param {number} latitude
     * @param {Date} date
     * @param {string} hour
     * @param {string} country
     * @param {string} state
     * @param {string} identification_id
     * @param {string} dataset_key
     * @memberof Marker
     */
    constructor(public marker_id: number,
        public specie_id: number,
        public user_id: number,
        public longitude: number,
        public latitude: number,
        public date: Date,
        public hour: string,
        public country: string,
        public state: string,
        public identification_id: string,
        public dataset_key: string) {
    }

    public scientific_name: string;
    public colloquial_name: string;
}