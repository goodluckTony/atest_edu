import { Locator, Page } from '@playwright/test';

export class StudyFeesSetupPage {
  private page: Page;
  private studyFeesTab: Locator;
  private studyFeesList: Locator;
  private editStudyFeesButton: Locator;
  private addStudyFeeButton: Locator;
  private deleteLastStudyFeeButton: Locator;
  private agreeDeletingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.studyFeesTab = page.locator("href*='/tariffs/list'");
    this.studyFeesList = page.locator("//p[contains(text(), 'урок')]");
    this.editStudyFeesButton = page.locator("button:has-text('Редагувати тарифи')");
    this.addStudyFeeButton = page.locator("//button[contains(text(), 'Додати тариф')]");
    this.deleteLastStudyFeeButton = page.locator("(//button[text()='Видалити тариф'])[last()]");
    this.agreeDeletingButton = page.locator("//button[text()='Видалити']");
  }
  
  async navigateToStudyFeesList(): Promise<void> {
    await this.studyFeesTab.click();
  }

  async getStudyFeesCount(): Promise<number> {
    return await this.studyFeesList.count();
  }

  async deleteStudyFeeElement(): Promise<void> {
    await this.editStudyFeesButton.click();
    await this.deleteLastStudyFeeButton.click();
    await this.agreeDeletingButton.click();
  }

  async createStudyFeeElement(): Promise<void> {
    await this.editStudyFeesButton.click();
    await this.addStudyFeeButton.click();
    // TODO: add filling form for creating study fee
  }

  async manageStudyFees(): Promise<void> {
    const count = await this.getStudyFeesCount();
    console.log(`Study fees count: ${count}`);

    if (count === 5) {
      await this.deleteStudyFeeElement();
      await this.createStudyFeeElement();
    } else if (count < 5) {
      await this.createStudyFeeElement()
    }
  }
}
