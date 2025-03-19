import { Locator, Page } from '@playwright/test';

export class TeacherPanelMathPage {
    private page: Page;
    private fillupTeachersStudyButton: Locator;
    private experienceInput: Locator;
    private paymentInput: Locator;
    private teacherCheckboxes: Locator;
    private teacherDescription: Locator;
    private saveButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.fillupTeachersStudyButton = page.locator("button:has-text('Заповнити')");
        this.experienceInput = page.locator("[name='experience']");
        this.paymentInput = page.locator("[name='payment_4']");
        this.teacherCheckboxes = page.locator("//p/preceding-sibling::span/input[@type='checkbox']");
        this.teacherDescription = page.locator("[name='about']");
        this.saveButton = page.locator("button:has-text('Зберегти')");
    }

    async setupTeacherMathStudy(): Promise<void> {
        await this.fillupTeachersStudyButton.click();
        await this.page.waitForLoadState("networkidle");
        await this.experienceInput.fill('1');
        await this.paymentInput.fill('350');

        const count = await this.teacherCheckboxes.count();
        console.log("Checkbox count: " + count);
        for (let i = 0; i < count; i++) {
          await this.teacherCheckboxes.nth(i).check();
        }
        await this.teacherDescription.fill('I am Math teacher!');
        await this.saveButton.click();
    }
}