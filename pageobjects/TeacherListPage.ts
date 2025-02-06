import { Locator, Page, expect } from "@playwright/test";

export class TeacherListPage {
    private page: Page;
    private addNewTeacherBtn: Locator;
    private searchInput: Locator;
    private teacherRow: Locator;

    constructor(page: Page) {
        this.page = page;
        this.addNewTeacherBtn = page.locator("[href*='teachers/add-new']");
        this.searchInput = page.locator("[placeholder*='Пошук']");
        this.teacherRow = page.locator("td:nth-child(3)");
    }

    async addNewTeacherBtnClick(): Promise<void> {
        await this.addNewTeacherBtn.click();
    }

    async searchTeacherByEmail(email: string, subject: string): Promise<void> {
        const subjectButton = this.page.locator(`button:has-text('${subject}')`);
        await subjectButton.click();
        await this.searchInput.fill(email);
        await this.page.waitForLoadState("networkidle");
        await expect(this.teacherRow).toBeVisible();
        const rowEmail = await this.teacherRow.innerText();
        expect(rowEmail.trim()).toBe(email.trim());
        await this.teacherRow.click();
        await this.page.waitForLoadState("networkidle");

    }
}