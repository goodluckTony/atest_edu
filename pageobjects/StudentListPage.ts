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
    }

    async addNewStudentBtnClick(): Promise<void> {
        await this.addNewStudentBtn.click();
    }

    async searchStudentByEmail(email: string, telegram: string): Promise<void> {
        const filterBtn = this.page.locator("button:has-text('Всі учні')");
        await filterBtn.click();
        // await this.searchInput.pressSequentially(email);
        await this.searchInput.fill(email);
        await this.page.waitForLoadState("networkidle");
        // await this.page.locator("tbody").waitFor();
        const rowTelegram = this.page.locator(`td:has-text('${telegram}')`);
        await expect(rowTelegram).toBeVisible();
        await rowTelegram.click();
        await this.page.waitForLoadState("networkidle");
    }
}