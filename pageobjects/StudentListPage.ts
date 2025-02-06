import { Locator, Page, expect } from "@playwright/test";

export class StudentListPage {
    private page: Page;
    private addNewStudentBtn: Locator;
    private searchInput: Locator;
    private studentRow: Locator;

    constructor(page: Page) {
        this.page = page;
        this.addNewStudentBtn = page.locator("[href*='students/add-new']");
        this.searchInput = page.locator("[placeholder*='Пошук']");
        // this.studentRow = page.locator("td:nth-child(4)");
        // this.studentRow = page.locator(`//td[contains(text(), '@Rosa')]`);

    }

    async addNewStudentBtnClick(): Promise<void> {
        await this.addNewStudentBtn.click();
    }

    async searchStudentByEmail(email: string, telegram: string): Promise<void> {
        const filterBtn = this.page.locator("button:has-text('Всі учні')");
        await filterBtn.click();
        await this.searchInput.pressSequentially(email);
        await this.page.waitForLoadState("networkidle");
        // await this.page.waitForLoadState("networkidle");
        await this.page.locator("tbody").waitFor();
        // await this.page.pause();
        // await expect(this.studentRow).toBeVisible();
        const rowTelegram = this.page.locator(`//td[contains(text(), '${telegram}')]`);
        await rowTelegram.waitFor();
        // expect(rowTelegram).toBe(telegram);
        await rowTelegram.click();
        await this.page.waitForLoadState("networkidle");
    }
}