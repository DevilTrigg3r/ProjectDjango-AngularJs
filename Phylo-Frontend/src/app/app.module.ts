import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// General imports
import { NgxPaginationModule } from 'ngx-pagination';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import {YouTubePlayerModule} from '@angular/youtube-player';

// Layout imports
import { HomeComponent } from './layout/home/home.component';
import { FooterComponent } from './layout/footer/footer.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { HeaderComponent } from './layout/header/header.component';
import { NotFoundComponent } from './meta/not-found/not-found.component';

// GOG component imports
import { GogHolderComponent } from './gog-holder/gog-holder.component';
import { MapViewComponent } from './gog-holder/map-view/map-view.component';
import { ShowUsrMarkersComponent } from './gog-holder/show-usr-markers/show-usr-markers.component';
import { AddEditUsrMarkersComponent } from './gog-holder/add-edit-usr-markers/add-edit-usr-markers.component';

// GOG services imports
import { MarkersService } from './services/gog/markers/markers.service';

// API consumption imports
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataVisualizationComponent } from './gog-holder/data-visualization/data-visualization.component';
import { MostRepeatedCountryComponent } from './gog-holder/data-visualization/most-repeated-country/most-repeated-country.component';
import { SpeciesWithMoreMarkersComponent } from './gog-holder/data-visualization/species-with-more-markers/species-with-more-markers.component';

// Validation Directives
// GOG directives
import { ValidateIntegerDirective } from './directives/gog/validate-integer/validate-integer.directive';
import { ValidateLongitudeDirective } from './directives/gog/validate-longitude/validate-longitude.directive';
import { ValidateLatitudeDirective } from './directives/gog/validate-latitude/validate-latitude.directive';
import { ValidateDateDirective } from './directives/gog/validate-date/validate-date.directive';
import { ValidateTimeDirective } from './directives/gog/validate-time/validate-time.directive';
import { ValidateCountryCodeDirective } from './directives/gog/validate-country-code/validate-country-code.directive';
import { ValidateStringDirective } from './directives/gog/validate-string/validate-string.directive';
import { DownloadNotificationsComponent } from './layout/navbar/download-notifications/download-notifications.component';

// About imports
import { SpeciesdbComponent } from './speciesdb/speciesdb.component';
import { ListspeciesComponent } from './speciesdb/listspecies/listspecies.component';
import { DatabaseService } from './services/database/database.service';
import { FilterspeciePipe } from './pipes/filterspecie.pipe';
import { FilterTaxonPipe } from './pipes/filter-taxon.pipe';
import { FilterColloquialPipe } from './pipes/filter-colloquial.pipe';
import { NcbiinsightsComponent } from './ncbiinsights/ncbiinsights.component';

// PhyloGenetic-Trees imports 
import { PhylogeneticTreesComponent } from './phylogenetic-trees/phylogenetic-trees.component';
import { BackendConnectService } from './services/PhyloTrees/backend-connect.service';
import { TaxonFilterPipe } from './Pipes/taxon-filter.pipe';
import { MsaViewerComponent } from './phylogenetic-trees/msa-viewer/msa-viewer.component';

// Administration
import { LoginComponent } from './layout/login/login.component';
import { RegisterComponent } from './layout/register/register.component';
import { ManageUsersComponent } from './layout/manage-users/manage-users.component';

// Administration directives
import { PasswordDirective } from './directives/register/password/password.directive';
import { EmailDirective } from './directives/register/email/email.directive';
import { CanvasClickDirective } from './directives/canvas/canvas-click/canvas-click.directive';

// Orthologs and authors imports
import { OrthologsComponent } from './layout/orthologs/orthologs.component';
import { SeqAlignmentComponent } from './layout/seq-alignment/seq-alignment.component';
import { FastaUploadComponent } from './layout/fasta-upload/fasta-upload.component';
import { SearchFilterPipe } from './pipes/orthologs/search-filter.pipe';
import { AuthorsComponent } from './layout/authors/authors.component';

//Plots
import { NgxChartsModule } from '@swimlane/ngx-charts';


@NgModule({
  declarations: [
    AppComponent,
    GogHolderComponent,
    HomeComponent,
    FooterComponent,
    NavbarComponent,
    HeaderComponent,
    NotFoundComponent,
    MapViewComponent,
    ShowUsrMarkersComponent,
    AddEditUsrMarkersComponent,
    DataVisualizationComponent,
    MostRepeatedCountryComponent,
    SpeciesWithMoreMarkersComponent,
    FastaUploadComponent,
    ValidateIntegerDirective,
    ValidateLongitudeDirective,
    ValidateLatitudeDirective,
    ValidateDateDirective,
    ValidateTimeDirective,
    ValidateCountryCodeDirective,
    ValidateStringDirective,
    DownloadNotificationsComponent,
    SpeciesdbComponent,
    ListspeciesComponent,
    FilterspeciePipe,
    FilterTaxonPipe,
    FilterColloquialPipe,
    NcbiinsightsComponent,
    PhylogeneticTreesComponent,
    TaxonFilterPipe,
    MsaViewerComponent,
    OrthologsComponent,
    SeqAlignmentComponent,
    SearchFilterPipe,
    AuthorsComponent,
    ManageUsersComponent,
    RegisterComponent,
    LoginComponent,
    PasswordDirective,
    EmailDirective,
    CanvasClickDirective
  ],
  imports: [
    NgxChartsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
    YouTubePlayerModule,
    ToastrModule.forRoot()
  ],
  providers: [MarkersService, CookieService, DatabaseService, BackendConnectService],
  bootstrap: [AppComponent]
})
export class AppModule { }
