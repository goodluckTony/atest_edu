import { Locator, Page } from '@playwright/test';

export class AdminPanelUsersPage {
  private page: Page;
  private teacherTab: Locator;
  // private addNewTeacherBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.teacherTab = page.locator("[href*='teachers/list']");
    // this.addNewTeacherBtn = page.locator("[href*='teachers/add-new']");
  }
  
  async navigateToTeachersList(): Promise<void> {
    await this.teacherTab.click();
  }
  
  // async addNewTeacherBtnClick(): Promise<void> {
  //   await this.addNewTeacherBtn.click();
  // }
}