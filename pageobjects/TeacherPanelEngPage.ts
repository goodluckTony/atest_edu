import { Locator, Page } from '@playwright/test';

export class TeacherPanelEngPage {
  private page: Page;
  private fillupTeachersStudyButton: Locator;
  private teacherLevelButton: Locator;
  private teacherLevelOption: Locator;
  private experienceInput: Locator;
  private paymentInput: Locator;
  // private studentLevelCheckbox: Locator;
  private teacherCheckboxes: Locator;

  constructor(page: Page) {
    this.page = page;
    this.fillupTeachersStudyButton = page.locator("button:has-text('Заповнити')");
    this.teacherLevelButton = page.locator("[role='combobox']");
    this.teacherLevelOption = page.locator("li:has-text('C2')");
    this.experienceInput = page.locator("[name='experience']");
    this.paymentInput = page.locator("[name='payment_1']");
    // this.studentLevelCheckbox = page.locator("div.css-lqt4hu div.css-1r5to7m span.css-ho3mt1 input.css-1m9pwf3");
    this.teacherCheckboxes = page.locator("//p/preceding-sibling::span/input[@type='checkbox']");
  }
  
  async setupTeacherStudy(): Promise<void> {
    await this.fillupTeachersStudyButton.click();
    await this.page.waitForLoadState("networkidle");
    // await this.teacherLevelButton.click();
    // await this.teacherLevelOption.click();
    // await this.experienceInput.fill('0');
    // await this.paymentInput.fill('350');

    const count = await this.teacherCheckboxes.count();
    console.log("Checkbox count: "+count);
    // for (let i = 0; i < count; i++) {
    //   await this.teacherCheckboxes.nth(i).check();
    // }
    // await this.teacherCheckboxes.check();
  }
}