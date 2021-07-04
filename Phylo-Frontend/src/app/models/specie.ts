/**
 * @file Model class to create object for Specie
 * @author Marti Rivero
 * @version 1.0
 * @date 20/05/2021
*/
export class Specie{
    
    
    
    /**
     * Creates an instance of Specie.
     * @param {number} specie_id
     * @param {string} scientific_name
     * @param {string} colloquial_name
     * @param {string} taxon_id
     * @param {string} image_specie
     * @param {number} user
     * @memberof Specie
     */
    constructor(
        private specie_id: number,
        private scientific_name: string,
        private colloquial_name: string,
        private taxon_id: string,
        private image_specie: string,
        private user: number
        ) {}
    
}