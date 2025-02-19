import { Locator, Page } from '@playwright/test';

export class AdminPanelUsersPage {
  private page: Page;
  private teacherTab: Locator;
  private studentTab: Locator;
  private mainPageButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.teacherTab = page.locator("[href*='teachers/list']");
    this.studentTab = page.locator("[href*='students/list']");
    this.mainPageButton = page.locator("a[href*='admins/list']");
  }
  
  async navigateToTeachersList(): Promise<void> {
    await this.teacherTab.click();
  }

  async navigateToStudentsList(): Promise<void> { 
    await this.studentTab.click();
  }
  
  async navigateToMainPage(): Promise<void> {
    await this.mainPageButton.click();
}
}