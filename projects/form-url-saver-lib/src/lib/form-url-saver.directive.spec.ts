import { Component, OnDestroy } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormUrlSaverDirective } from "./form-url-saver.directive";
import { RouterTestingModule } from "@angular/router/testing";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { BehaviorSubject, of, takeUntil } from "rxjs";

interface Article {
  id: number | undefined;
  authorId: number | undefined;
  title: string | undefined;
  description: string | undefined;
  type: ArticleType | undefined;
}

interface ArticleInRoute {
  [key: string]: string;
}

enum ArticleType {
  Science = 'Science',
  Discovery = 'Discovery',
}

class ActivatedRouteMock {
  public readonly queryParams = of({
    id: '1',
    authorId: '1',
    title: 'title 1',
    description: 'description 1',
    type: 'Science',
  });

  public readonly snapshot = {

    queryParams: {
      id: '2',
      authorId: '2',
      title: 'title 3',
      description: 'description 1',
      type: 'Science',
    }

  };
}

class ArticleBuilder {
  constructor(
    private _id ?: number,
    private _authorId ?: number,
    private _title ?:string,
    private _description ?:string,
    private _type ?: ArticleType
  ){}

  public withId(id: number) {
    this._id = id;
    return this;
  }

  public withAuthorId(id: number) {
    this._authorId = id;
    return this;
  }

  public withTitle(title: string) {
    this._title = title;
    return this;
  }

  public withDescription(description: string) {
    this._description = description;
    return this;
  }

  public withType(type: ArticleType) {
    this._type = type;
    return this;
  }

  public build () {
    return {
      id: this._id,
      authorId: this._authorId,
      title: this._title,
      description: this._description,
      type: this._type
    } as Article;
  };
}


@Component({
  selector: 'ngx-test-component',
  template: `
  <div>
    <section>
      <div *ngFor="let article of articles">
        <p>id: {{article?.id}}</p>
        <p>id: {{article?.authorId}}</p>
        <p>id: {{article?.title}}</p>
        <p>id: {{article?.description}}</p>
        <p>id: {{article?.type}}</p>
      </div>
      <form ngxFormUrlSaver [formGroup]="form">
        <input
          type="text"
          formControlName="id"
        >

          <input
          type="text"
          formControlName="authorId"
        >

          <input
          type="text"
          formControlName="title"
        >

          <input
          type="text"
          formControlName="description"
        >

        <input
          type="text"
          formControlName="type"
        >
        <button
          type="button"
          (click)="filterArticles()"
        >
          Filter
        </button>
      </form>
    </section>
  </div>`,
})
class TestComponent implements OnDestroy{

  public readonly defaultFormValue = {
    id: undefined,
    authorId: undefined,
    title: undefined,
    description: undefined,
    type: undefined,
  } as Article;

  public readonly form = this.fb.group<Article>(this.defaultFormValue);

  public readonly articles = [
    new ArticleBuilder()
      .withId(1)
      .withAuthorId(1)
      .withTitle('title 1')
      .withDescription('description 1')
      .withType(ArticleType.Discovery).build(),
    new ArticleBuilder()
      .withId(2)
      .withAuthorId(1)
      .withTitle('title 2')
      .withDescription('description 2')
      .withType(ArticleType.Discovery).build(),
    new ArticleBuilder()
      .withId(3)
      .withAuthorId(2)
      .withTitle('title 3')
      .withDescription('description 3')
      .withType(ArticleType.Science).build(),
    new ArticleBuilder()
      .withId(4)
      .withAuthorId(2)
      .withTitle('title 4')
      .withDescription('description 4')
      .withType(ArticleType.Science).build(),
    new ArticleBuilder()
      .withId(5)
      .withAuthorId(3)
      .withTitle('title 5')
      .withDescription('description 5')
      .withType(ArticleType.Science).build(),
  ] as Article [];

  public readonly destroy$ = new BehaviorSubject<Boolean>(false);

  public queryParamsFromRoute: Partial<Article> = {};

  public readonly queryParamsSub = this.route.queryParams.pipe(
    takeUntil(this.destroy$),
  ).subscribe((params: ArticleInRoute) => {
    Object.keys(params).forEach(key => {
      const value = params[key];

      const clearValue = Number.parseInt(value, 10);
    });
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ){}

  public filterArticles() {
    // this.articles.filter();
  }

  public ngOnDestroy = () => (this.destroy$.next(true));
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
      imports: [RouterTestingModule, FormsModule, ReactiveFormsModule, RouterTestingModule],
      providers:[FormBuilder, {provide: ActivatedRoute, useClass: ActivatedRouteMock}],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    fb = TestBed.inject(FormBuilder);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  describe('Initialization tests', () => {

    it('should create TestComponent', () => {
      expect(component).toBeTruthy();
    });

    it(`the initial article length should be equal to 5`, () => {
      expect(component.articles.length).toEqual(5);
    })

  });

  describe('ngxFormUrlSaver directive tests', () => {
    it('the article length should grow by 1 after one creating', () => {
     component.queryParamsSub
    });

    afterAll(() => {
      component.ngOnDestroy();
    });
  });

});
