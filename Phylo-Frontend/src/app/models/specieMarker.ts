/**
 * @file Model class to create marker objects
 * @author Gerard Garcia
 * @version 1.0
 * @date 10/05/2021
*/
export class SpecieMarker {
    
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
    constructor(public specie_id: number,
                public scientific_name: string,
                public colloquial_name: string,
                public empty: boolean,
                public error: boolean,
                public finished: boolean,
                public image_specie: string,
                public taxon_id: string,
                public user: number) {
    }

}
