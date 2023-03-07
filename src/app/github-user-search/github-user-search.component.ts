import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { merge, of } from 'rxjs';
import { startWith, switchMap, map } from 'rxjs/operators';

export interface Response {
  incomplete_results: boolean,
  items: User[],
  total_count: number
}
export interface User {
  avatar_url: string,
  events_url: string,
  followers_url: string,
  following_url: string,
  gists_url: string,
  gravatar_id: string,
  html_url: string,
  id: number
  login: string,
  node_id: string,
  organizations_url: string
  received_events_url: string,
  repos_url: string,
  site_admin: boolean,
  starred_url: string,
  subscriptions_url: string,
  type: string,
  url: string
}

@Component({
  selector: 'app-github-user-search',
  templateUrl: './github-user-search.component.html',
  styleUrls: ['./github-user-search.component.scss']
})
export class GithubUserSearchComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  searchValue: string = '';
  txtQueryChanged: Subject<string> = new Subject<string>();
  isLoading: boolean = false;
  users: User[] = [];
  dataSource: User[] = [];
  page=1;
  searchQuery: string = '';
  searchGroup: FormGroup = new FormGroup({
    searchValue: new FormControl('')  //Skipping validator as we are calling users list api without wuery param
  });
  constructor(private http: HttpClient) {
    // this.txtQueryChanged.pipe
    //   (debounceTime(1000), distinctUntilChanged())
    //   .subscribe(model => {
    //     if (model) {

    //     }
    //   });
  }
  ngOnInit() {
    this.searchGroup.controls['searchValue'].valueChanges.pipe(debounceTime(500)).subscribe(
      (searchValue) => {
        console.log(searchValue && this.searchQuery != searchValue);
        if (searchValue && this.searchQuery != searchValue) {
          this.search(searchValue);
        } else {
          this.search('');
        }
      }
    );
  }

  search(query: string) {
    this.users = [];
    this.searchQuery = query;
    if (query?.trim()) {
      this.searchUser(query.trim());
    } else {
      this.isLoading = true;
      this.http.get('https://api.github.com/users').subscribe((res: any) => {
        this.users = res;
        this.isLoading = false;
        this.linkListToPaginator();
      });
    }
  }
  searchUser(query:string){
    this.isLoading = true;
      this.http.get('https://api.github.com/search/users?q=' + query+'&page='+this.page+'&per_page=15').subscribe((res: any) => {
        this.users = res.items;
        this.isLoading = false;
        this.linkListToPaginator();
      });
  }

  linkListToPaginator() {
    merge(this.paginator.page).pipe(
      startWith({}),
      switchMap(() => {
        return of(this.users);
      })
    ).subscribe(res => {
      const from = this.paginator.pageIndex * 15;
      const to = from + 15;
      this.dataSource = res.slice(from, to);
    });
  }
  @HostListener("window:scroll", ["$event"])
  onWindowScroll() {
    //In chrome and some browser scroll is given to body tag
    let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
    let max = document.documentElement.scrollHeight;
    // pos/max will give you the distance between scroll bottom and and bottom of screen in percentage.
    if (pos == max) {
      this.page++;
      this.searchUser(this.searchQuery);
      window.scroll(0,0)
    }
  }
}
