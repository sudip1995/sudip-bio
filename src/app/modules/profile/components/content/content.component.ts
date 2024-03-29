import {Component, OnDestroy, OnInit} from '@angular/core';
import {SharedConfig} from '../../../../shared/config/shared.config';
import {ContentModel} from '../../../../shared/models/shared.model';
import {ContentService} from '../../../../shared/services/content.service';
import {ActivatedRoute} from '@angular/router';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit, OnDestroy {
  newContent = new ContentModel();

  unSubscribe$ = new Subject();
  constructor(private contentService: ContentService,
              private activatedRoute: ActivatedRoute,
              private ngxSpinnerService: NgxSpinnerService) { }

  ngOnInit() {
    this.ngxSpinnerService.show();
    this.activatedRoute.params.pipe(takeUntil(this.unSubscribe$)).subscribe(param => {
      if (param && param.id) {
        this.contentService.getContentById(SharedConfig.getContentByIdApi(param.id)).subscribe(res => {
          this.ngxSpinnerService.hide();
          if (res) {
            this.newContent._id = res._id;
            this.newContent.title = res.title;
            this.newContent.body = res.body;
            this.newContent.author = res.author;
            this.newContent.contentType = res.contentType;
            this.newContent.publishedDate = res.publishedDate;
            this.newContent.comments = res.comments;
            this.newContent.isFavourite = res.isFavourite;
            this.newContent.isPosted = res.isPosted;
            this.newContent.meta = res.meta;
          }
        });
      }
    });

  }

  ngOnDestroy(): void {
    this.unSubscribe$.next();
    this.unSubscribe$.complete();
  }

}
