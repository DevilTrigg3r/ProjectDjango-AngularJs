import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterColloquial'
})
export class FilterColloquialPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    const resultColloquial = [];
    for(const specie of value){
      if(specie.colloquial_name.toLowerCase().indexOf(arg.toLowerCase()) > -1){
        resultColloquial.push(specie);
      };
      
    };
    return resultColloquial;
  }
}
