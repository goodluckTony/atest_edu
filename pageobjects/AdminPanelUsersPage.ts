import { Locator, Page } from '@playwright/test';

export class AdminPanelUsersPage {
  private page: Page;
  private teacherTab: Locator;
  private studentTab: Locator;
  private mainPageButton: Locator;
  private teachersStudy: Locator;

  constructor(page: Page) {
    this.page = page;
    this.teacherTab = page.locator("[href*='teachers/list']");
    this.studentTab = page.locator("[href*='students/list']");
    this.mainPageButton = page.locator("a[href*='admins/list']");
    this.teachersStudy = page.locator("[href*='teachers/study']");
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

  async navigateToTeachersStudy(): Promise<void> {
    await this.teachersStudy.click();
  }
}