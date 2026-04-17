import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DisplayService } from '../../services/display.service';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'admin-side-navigation',
  templateUrl: './side-navigation.component.html',
  styleUrls: ['./side-navigation.component.scss']
})
export class SideNavigationComponent implements OnInit {

  imageLogoPath: string = '/assets/logo/logo.PNG';
  showFiller = false;
  expandSubNavMenu: boolean = false;
  parentMenu: string = '';
  navigationItems: any[] = [];
  isLoggedIn$: Observable<boolean> | undefined;
  userDetails: any;
  user: any;
  userImage: any;
  @Output() currentScreen = new EventEmitter();
  @Output() selectedTab = new EventEmitter();
  isFullView :boolean = true;
  selectedSidenavIndex: number = 0;

  constructor(
    private sharedService: SharedService, 
    private dialog: MatDialog,
    private router: Router,
    private displayService: DisplayService) {}

  ngOnInit(): void {
    this.getNavbarContents();
  }

  getNavbarContents() {
    this.navigationItems.push(
      {
        id: 0,
        icon: 'dashboard',
        name: 'Dashboard',
        route: '/healthbrize/',
        isSubItemPresent: false,
      },
      {
        id: 1,
        icon: 'person_add',
        name: 'Approve Users Request',
        route: '/healthbrize/admin/approve-users',
        isSubItemPresent: false,
      },
      {
        id: 2,
        icon: 'group',
        name: 'Users',
        route: '/healthbrize/admin/users',
        isSubItemPresent: false,
      },
      {
        id: 3,
        icon: 'category',
        name: 'Categories',
        route: '/healthbrize/admin/categories',
        isSubItemPresent: false,
      },
      {
        id: 4,
        icon: 'format_list_bulleted',
        name: 'Sub Categories',
        route: '/healthbrize/admin/sub-categories',
        isSubItemPresent: false,
      },
      {
        id: 5,
        icon: 'inventory',
        name: 'Products',
        route: '/healthbrize/admin/products',
        isSubItemPresent: false,
      },
      {
        id: 6,
        icon: 'list_alt',
        name: 'Orders',
        route: '/healthbrize/admin/orders',
        isSubItemPresent: false,
      },
      {
        id: 7,
        icon: 'list_alt',
        name: 'Doctors',
        route: '/healthbrize/admin/doctors',
        isSubItemPresent: false,
      }
    );
  }

  expandSubMenu(navItem: any, index: number) {
    this.currentScreen.emit(navItem.name);
    this.parentMenu = navItem.name;
    // if(this.parentMenu === 'Launch Event'){
    //   this.sharedService.selectedIndex = 3;
    //   this.selectedSidenavIndex = 4;
    // }else if(this.parentMenu === 'Drivers'){
    //   this.sharedService.selectedIndex = 2;
    //   this.selectedSidenavIndex = 3;
    // }else if(this.parentMenu === 'Events'){
    //   this.sharedService.selectedIndex = 1;
    //   this.selectedSidenavIndex = 2;
    // }else if(this.parentMenu === 'Response Rate'){
    //   this.sharedService.selectedIndex = 0;
    //   this.selectedSidenavIndex = 1;
    // }else if(this.parentMenu === 'Dashboard'){
    //   this.selectedSidenavIndex = 0;
    //   this.sharedService.selectedIndex = 0;
    // }
    if (navItem.isSubItemPresent) {
      this.expandSubNavMenu = true;
    }
  }

  navigate(item: string, index: number){
    this.selectedSidenavIndex = index;
    if(item === 'Dashboard'){
      this.router.navigate(['/healthbrize']);
    }else if(item === 'Approve Users Request'){
      this.router.navigate(['/healthbrize/admin/approve-users']);
    }else if(item === 'Users'){
      this.router.navigate(['/healthbrize/admin/users']);
    }else if(item === 'Categories'){
      this.router.navigate(['/healthbrize/admin/categories']);
    }else if(item === 'Sub Categories'){
      this.router.navigate(['/healthbrize/admin/sub-categories']);
    }else if(item === 'Products'){
      this.router.navigate(['/healthbrize/admin/products']);
    }else if(item === 'Orders'){
      this.router.navigate(['/healthbrize/admin/orders']);
    }else if(item === 'Doctors'){
      this.router.navigate(['/healthbrize/admin/doctors']);
    }
  }

  async logout(){
    // this.dialog.open(DeleteComponent, {
    //   width: '300px'
    // });
  }

  toggleView(){
    this.isFullView = !this.isFullView;
    this.displayService.changeIsFullViewLoaded(this.isFullView);
    this.displayService.isFullView = !this.displayService.isFullView;
  }
}
