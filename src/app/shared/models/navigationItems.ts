export interface NavigationItems{
  icon?: string;
  name?: string;
  isSubItemPresent?: boolean;
  submenu?: SubNavigationItems[];
  isActive?: boolean;
  route?: string;
}

export interface SubNavigationItems{
    icon?: string;
    name?: string;
    route?: string;
  }