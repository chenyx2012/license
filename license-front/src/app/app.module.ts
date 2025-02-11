import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import { NavbarComponent } from './navbar/navbar.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { HomeComponent } from './home/home.component';
import { LicenseListComponent } from './home/license-list/license-list.component';
import { LicenseItemComponent } from './home/license-list/license-item/license-item.component';
import { LicenseShowComponent } from './license-show/license-show.component';
import { GraphQLModule } from './graphql.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatTabsModule } from '@angular/material/tabs';
import { FeatureTagsBoxComponent } from './license-show/feature-tags-box/feature-tags-box.component';
import { TagItemComponent } from './license-show/feature-tags-box/tag-item/tag-item.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthorComponent } from './author/author.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { CookieService } from 'ngx-cookie-service';
import { AuthFunctionComponent } from './auth-function/auth-function.component';
import { AuthInterceptor } from './service/auth.interceptor';
import { ReportComponent } from './report/report.component';
import { ReportContentComponent } from './report/report-content/report-content.component';
import { ReportFileListComponent } from './report/report-content/report-file-list/report-file-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { YesNoPipe } from './pipe/yes-no.pipe';
import { ReportBucketsComponent } from './report/report-content/report-buckets/report-buckets.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { UserComponent } from './user/user.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LvMengComponent, LvMengService } from './lv-meng/lv-meng.component';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    LicenseListComponent,
    LicenseItemComponent,
    LicenseShowComponent,
    FeatureTagsBoxComponent,
    TagItemComponent,
    AuthorComponent,
    LoginComponent,
    ProfileComponent,
    AuthFunctionComponent,
    ReportComponent,
    ReportContentComponent,
    ReportFileListComponent,
    YesNoPipe,
    ReportBucketsComponent,
    UserComponent,
    LvMengComponent
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    GraphQLModule,
    HttpClientModule,
    MatTabsModule,
    MatExpansionModule,
    MatCardModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatTooltipModule,
    FormsModule,
    MatProgressSpinnerModule,
    FontAwesomeModule,
    NgxChartsModule,
    HttpClientModule


  ],
  providers: [CookieService, 
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: LvMengService},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
