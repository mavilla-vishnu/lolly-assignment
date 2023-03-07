import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GithubUserSearchComponent } from './github-user-search.component';

describe('GithubUserSearchComponent', () => {
  let component: GithubUserSearchComponent;
  let fixture: ComponentFixture<GithubUserSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GithubUserSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GithubUserSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
