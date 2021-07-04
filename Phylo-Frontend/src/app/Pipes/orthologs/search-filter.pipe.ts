import { Pipe, PipeTransform } from '@angular/core';
import { Ortholog } from 'src/app/models/ortholog';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

  transform(orthologs: Ortholog[], orthologName: string): Ortholog[] {
    console.log("orthologName: ",orthologName.toLocaleLowerCase());
    if(!orthologs || !orthologName){
      return orthologs;
    }
    return orthologs.filter(ortholog => 
      ortholog["species"].toLocaleLowerCase().includes(orthologName.toLocaleLowerCase()));
  }

}
