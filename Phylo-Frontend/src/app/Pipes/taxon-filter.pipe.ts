import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'taxonFilter'
})
export class TaxonFilterPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    const TaxonFiltered = [];
    for(const specie of value){
      if(specie.taxon_id.toLowerCase().indexOf(arg.toLowerCase()) > -1){
        TaxonFiltered.push(specie);
      };

    };
    return TaxonFiltered;
  }

}
