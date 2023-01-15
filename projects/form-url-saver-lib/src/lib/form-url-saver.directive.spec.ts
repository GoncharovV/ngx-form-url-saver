import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormUrlSaverDirective } from "./form-url-saver.directive";
import { RouterTestingModule } from "@angular/router/testing";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: 'ngx-test-component',
  template: `
  <div>
    <form ngxFormUrlSaver [formGroup]="form">
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
    id: null,
    authorId: null,
    description: null,
    category: null,
  } as ArticleForm;

  public readonly form = this.fb.group<ArticleForm>(this.defaultFormValue);

  public readonly articlesIds = [1,2,3,4,5];
  public readonly authorsIds = [1,2,3,4,5];
  public readonly articleTypes = [ArticleType.Discovery, ArticleType.Discovery];

  constructor(private readonly fb: FormBuilder){}
}

enum ArticleType {
  Science = 'Science',
  Discovery = 'Discovery',
}

interface ArticleForm {
  id: number | null;
  authorId: number | null;
  description: string | null;
  category: ArticleType | null;
}

describe('FormUrlSaverDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let directive: FormUrlSaverDirective;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [TestComponent,FormUrlSaverDirective],
      imports: [RouterTestingModule, FormsModule, ReactiveFormsModule],
      providers:[],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  })


  it('should ...', () => {
    // const directive = new FormUrlSaverDirective();
    // expect(directive).toBeTruthy();
  });
});
