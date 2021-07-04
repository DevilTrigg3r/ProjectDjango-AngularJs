/**
 * @file Model class to create object for ortholog
 * @author Marti Rivero
 * @version 1.0
 * @date 16/05/2021
*/
export class Ortholog{

    
    private entry_nr: number;
    private sequence_length: number;
    private taxon_id: string;
    private species: string;
    private chromosome: string;
    private distance: number;
    private score: number;

    /**
     * Creates an instance of Ortholog.
     * @author Marti Rivero
     * @version 1.0
     * @date 16/05/2021
     * @param {number} entry_nr
     * @param {number} sequence_length
     * @param {string} taxon_id
     * @param {string} species
     * @param {string} chromosome
     * @param {number} distance
     * @param {number} score
     * @memberof Ortholog
     */
    constructor(
        entry_nr: number,
        sequence_length: number,
        taxon_id: string,
        species: string,
        chromosome: string,
        distance: number,
        score: number,
        ) {
        this.entry_nr = entry_nr;
        this.sequence_length = sequence_length;
        this.taxon_id = taxon_id;
        this.species = species;
        this.chromosome = chromosome;
        this.distance = distance;
        this.score = score;
}
/**
     * Getter $entry_nr
     * @return {number}
     */
 public get $entry_nr(): number {
    return this.entry_nr;
}

/**
 * Getter $sequence_length
 * @return {number}
 */
public get $sequence_length(): number {
    return this.sequence_length;
}

/**
 * Getter $taxon_id
 * @return {string}
 */
public get $taxon_id(): string {
    return this.taxon_id;
}

/**
 * Getter $species
 * @return {string}
 */
public get $species(): string {
    return this.species;
}

/**
 * Getter $chromosome
 * @return {string}
 */
public get $chromosome(): string {
    return this.chromosome;
}

/**
 * Getter $distance
 * @return {number}
 */
public get $distance(): number {
    return this.distance;
}

/**
 * Getter $score
 * @return {number}
 */
public get $score(): number {
    return this.score;
}

/**
 * Setter $entry_nr
 * @param {number} value
 */
public set $entry_nr(value: number) {
    this.entry_nr = value;
}

/**
 * Setter $sequence_length
 * @param {number} value
 */
public set $sequence_length(value: number) {
    this.sequence_length = value;
}

/**
 * Setter $taxon_id
 * @param {string} value
 */
public set $taxon_id(value: string) {
    this.taxon_id = value;
}

/**
 * Setter $species
 * @param {string} value
 */
public set $species(value: string) {
    this.species = value;
}

/**
 * Setter $chromosome
 * @param {string} value
 */
public set $chromosome(value: string) {
    this.chromosome = value;
}

/**
 * Setter $distance
 * @param {number} value
 */
public set $distance(value: number) {
    this.distance = value;
}

/**
 * Setter $score
 * @param {number} value
 */
public set $score(value: number) {
    this.score = value;
}

}