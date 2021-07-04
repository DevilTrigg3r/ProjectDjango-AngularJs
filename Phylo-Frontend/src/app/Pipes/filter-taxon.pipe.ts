import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterTaxon'
})
export class FilterTaxonPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    const resultTaxon = [];
    for(const specie of value){
      if(specie.taxon_id.toLowerCase().indexOf(arg.toLowerCase()) > -1){
        resultTaxon.push(specie);
      };
      
    };
    return resultTaxon;
  }
}
