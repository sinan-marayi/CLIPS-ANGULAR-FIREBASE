import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css'],
})
export class ManageComponent implements OnInit {
  videoOrder = '1';
  constructor(private route: ActivatedRoute, private router: Router) {
    route.queryParams.subscribe((query: Params) => {
      this.videoOrder = query.sort === '1' ? query.sort : '2';
    });
  }

  ngOnInit(): void {}

  //videoSort
  clipsOrder(event: Event) {
    const { value } = event.target as HTMLSelectElement;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: value,
      },
    });
  }
}
