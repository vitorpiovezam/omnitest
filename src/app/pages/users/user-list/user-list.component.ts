import { User } from './../shared/user.model';
import { UserService } from './../shared/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.less']
})
export class UserListComponent implements OnInit {

  users: User[] = [];

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userService.getAll().subscribe(
      users => this.users = users,
      error => console.log(error)
    );
  }

  deleteUser(user: any) {
    const mustDelete = confirm('Deseja realmente deletar esse registro ?');

    if (mustDelete) {
      this.userService.delete(user._id).subscribe(
        () => this.users = this.users.filter(element => element !== user),
        () => alert('Error')
        );
    }
  }

}
