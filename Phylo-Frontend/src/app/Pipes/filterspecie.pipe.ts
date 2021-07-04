import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterspecie'
})
export class FilterspeciePipe implements PipeTransform {

  transform(value: any, arg: any): any {
    const resultSpecie = [];
    for(const specie of value){
      if(specie.scientific_name.toLowerCase().indexOf(arg.toLowerCase()) > -1){
        resultSpecie.push(specie);
      };
      
    };
    return resultSpecie;
  }
  
}
