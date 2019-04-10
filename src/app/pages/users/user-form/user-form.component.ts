import { UserService } from './../shared/user.service';
import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../shared/user.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.less']
})

export class UserFormComponent implements OnInit, AfterContentChecked {
  currentAction: string;
  userForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: Boolean = false;
  user: User = new User();

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildUserForm();
    this.loadUser();
  }

  ngAfterContentChecked() {
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;

    if (this.currentAction === 'edit') {
      this.updateUser();
    } else if (this.currentAction === 'new') {
      this.createUser();
    }
  }

  private setPageTitle() {
    if (this.currentAction === 'edit') {
      this.pageTitle = 'Editar ' + this.user.name || ' ';
    } else {
      this.pageTitle = 'Novo usuário';
    }
  }

  private setCurrentAction() {
    this.currentAction = this.route.snapshot.url[0].path;
  }

  private buildUserForm() {
    this.userForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required]],
      email: [null, [Validators.required], [Validators.email]],
      cpf: [null, [Validators.required]],
      telephone: [null, [Validators.required]]
    });
  }

  private loadUser() {
    if (this.currentAction === 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this.userService.getById(params.get('id')))
      )
      .subscribe(
        (user) => {
          this.user = user;
          this.userForm.patchValue(this.user);
        },
        (error) => alert('Error')
      );
    } else {

    }
  }

  private createUser() {
    const user: User = Object.assign(new User(), this.userForm.value);
    this.userService.create(user)
    .subscribe(
      user => this.actionsForSuccess(user),
      error => this.actionsForError(error)
    );
  }

  private updateUser() {

  }

  private actionsForSuccess(user: User) {
    const message = `O(a) usuario(a) ${user.name} foi cadastrado(a) com sucesso`;

    alert(message);
    this.router.navigateByUrl('users', {skipLocationChange: true})
    .then(
      () => this.router.navigate(['user', user._id, 'edit'])
    );
  }

  private actionsForError(error: any) {
    alert('Erro');
    this.submittingForm = false;

    if (error.status ===  422) {
      this.serverErrorMessages = JSON.parse(error._body).errors;
    } else {
      this.serverErrorMessages = ['Falha na comunicação com o servidor'];
    }

  }

}
