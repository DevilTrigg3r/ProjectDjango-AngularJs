import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Layout imports
import { HomeComponent } from './layout/home/home.component';
import { NotFoundComponent } from './meta/not-found/not-found.component';
import { FastaUploadComponent } from './layout/fasta-upload/fasta-upload.component';

// GOG app imports
import { GogHolderComponent } from './gog-holder/gog-holder.component';

// About imports
import { SpeciesdbComponent } from './speciesdb/speciesdb.component';
import { NcbiinsightsComponent } from './ncbiinsights/ncbiinsights.component';

//PhylogeneticsTrees Imports
import { PhylogeneticTreesComponent } from './phylogenetic-trees/phylogenetic-trees.component';
import {MsaViewerComponent} from './phylogenetic-trees/msa-viewer/msa-viewer.component';

// Administration imports
import { LoginComponent } from './layout/login/login.component';
import { RegisterComponent } from './layout/register/register.component';

// Orthologs and authors
import { OrthologsComponent } from './layout/orthologs/orthologs.component';
import { ManageUsersComponent } from './layout/manage-users/manage-users.component';
import { SeqAlignmentComponent } from './layout/seq-alignment/seq-alignment.component';
import { AuthorsComponent } from './layout/authors/authors.component';

const routes: Routes = [
  {path: 'map', component: GogHolderComponent},
  {path: 'Trees', component: PhylogeneticTreesComponent },
  {path: 'MsaViewer', component: MsaViewerComponent },
  {path: 'about', component: SpeciesdbComponent},
  {path: 'insights', component: NcbiinsightsComponent},
  {path: 'home', component: HomeComponent},
  {path: 'fasta', component: FastaUploadComponent},
  {path: 'login', component: LoginComponent},
  {path: 'orthologs', component: OrthologsComponent},
  {path: 'manage_users', component: ManageUsersComponent},
  {path: 'sequence_alignment', component: SeqAlignmentComponent},
  {path: 'authors', component: AuthorsComponent},
  {path: 'signup', component: RegisterComponent},
  {path: '**', component: NotFoundComponent},
  {path: '', redirectTo: 'home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
