import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { configureTestingModule } from './testing-utils';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(waitForAsync(() => {
    configureTestingModule({
        declarations: [
          AppComponent,
        ]
    }).compileComponents();
  }));

  beforeEach(() => {
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`country details box should have correct title`, () => {
    const scoreBox: HTMLElement = fixture.nativeElement.querySelector('.country-details');
    
    expect(scoreBox.textContent.trim()).toEqual(`Client's Risk Portfolio`);
  });
});
