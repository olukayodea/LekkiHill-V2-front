import { Component, OnInit } from '@angular/core';
import { UserData } from 'src/app/_models/users';
import { ChecksService } from 'src/app/_services/checks.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userData: UserData;

  constructor(
    private checkService: ChecksService,
  ) {
    this.userData = this.checkService.checkSession();
  }

  ngOnInit(): void {
  }

}
