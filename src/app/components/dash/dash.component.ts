import { Component, OnInit } from '@angular/core';
import { User, UserBlog } from '../../models/user/user';
import { AuthService } from '../../services/auth/auth.service';
import { MenuController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.scss'],
})
export class DashComponent implements OnInit {
  public user: User;
  public blog: UserBlog;
  public appPages = [{
    title: 'Posts',
    url: 'posts',
    icon: 'paper'
  }, {
    title: 'Pages',
    url: 'pages',
    icon: 'paper'
  }];

  public showBlogs: boolean;

  constructor(private router: Router, private menu: MenuController, private route: ActivatedRoute,
              private authService: AuthService) {
    // Initially 'showBlogs' should be false.
    this.showBlogs = false;
  }

  ngOnInit() {
    // Dynamically get current user's data.
    this.authService.user.subscribe((user: User): void => {
      this.user = user;
    });

    // Dynamically get current blog's data.
    this.authService.blog.subscribe((blog: UserBlog): void => {
      this.blog = blog;
    });
  }

  changeBlog(blog: UserBlog): void {
    // Change blog.
    this.authService.changeBlog(blog);
    // Close menu then hide blog-s.
    this.menu.close().then(() => this.showBlogs = false);
  }
}
