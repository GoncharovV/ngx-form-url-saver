import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormUrlSaverDirective } from "./form-url-saver.directive";
import { RouterTestingModule } from "@angular/router/testing";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { of } from "rxjs";

@Component({
  selector: 'ngx-test-component',
  template: `
  <div>
    <form [formGroup]="form">
      <select formControlName="id">
        <option
          *ngFor="let id of articlesIds"
          [value]="id"
        >
        </option>
      </select>
      <select formControlName="authorId">
      <option
        *ngFor="let id of authorsIds"
        [value]="id"
      >
      </option>
      </select>
      <input
        type="text"
        formControlName="description"
      >
      <select formControlName="category">
      <option
        *ngFor="let category of articleTypes"
        [value]="category"
      >
      </option>
      </select>
    </form>
  </div>`,
})
class TestComponent{
  public readonly defaultFormValue = {
    id: undefined,
    authorId: undefined,
    title: undefined,
    description: undefined,
    type: undefined,
  } as Article;

  public readonly form = this.fb.group<Article>(this.defaultFormValue);

  public readonly articles = [
    {
      id: 1,
      authorId: 1,
      title: 'title 1',
      description: 'description 1',
      type: ArticleType.Discovery,
    },
    {
      id: 2,
      authorId: 1,
      title: 'title 2',
      description: 'description 2',
      type: ArticleType.Discovery,
    },
    {
      id: 3,
      authorId: 2,
      title: 'title 3',
      description: 'description 3',
      type: ArticleType.Science,
    },
    {
      id: 4,
      authorId: 2,
      title: 'title 4',
      description: 'description 4',
      type: ArticleType.Science,
    },
    {
      id: 5,
      authorId: 3,
      title: 'title 5',
      description: 'description 5',
      type: ArticleType.Science,
    },
  ] as Article [];

  public readonly articlesIds = [1,2,3,4,5];
  public readonly authorsIds = [1,2,3,4,5];
  public readonly articleTypes = [ArticleType.Discovery, ArticleType.Discovery];

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ){}
}

interface Article {
  id: number | undefined;
  authorId: number | undefined;
  title: string | undefined;
  description: string | undefined;
  type: ArticleType | undefined;
}

enum ArticleType {
  Science = 'Science',
  Discovery = 'Discovery',
}

class ActivatedRouteMock {
  public readonly queryParams = of({
    type: 'Science',
  });
}

describe('FormUrlSaverDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let fb: FormBuilder;
  let router: Router;
  let route: ActivatedRoute;
  let directive: FormUrlSaverDirective;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [TestComponent,FormUrlSaverDirective],
      imports: [RouterTestingModule, FormsModule, ReactiveFormsModule],
      providers:[FormBuilder, {provide: ActivatedRoute, useClass: ActivatedRouteMock}],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    fb = TestBed.inject(FormBuilder);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    component = fixture.componentInstance;
  });


  it('should create TestComponent', () => {
    expect(component).toBeTruthy();
  });

});
