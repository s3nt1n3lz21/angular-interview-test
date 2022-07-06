import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, Injectable, Injector } from "@angular/core";
import { of } from "rxjs";
import { ApiService } from "./services/api.service";

@Component({
    selector: 'app-root',
    template: ''
})
class AppComponent {}

@Injectable({
    providedIn: 'root'
})
export class ApiServiceMock {
    public getCountries() {
        return of([]);
    }
}

export const configureTestingModule = ({
    imports = [],
    declarations = [],
    providers = []
}) => TestBed.configureTestingModule({
    imports: [
        HttpClientTestingModule,
        ...imports
    ],
    declarations: [
        AppComponent,
        ...declarations
    ],
    providers: [
        Injector,
        { provide: ApiService, useClass: ApiServiceMock },
        ...providers
    ],
});