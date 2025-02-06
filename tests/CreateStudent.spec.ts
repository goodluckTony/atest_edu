import { test, expect } from '@playwright/test';
import { LoginPage } from '../pageobjects/LoginPage';
import { AdminPanelUsersPage } from '../pageobjects/AdminPanelUsersPage';
import { StudentListPage } from '../pageobjects/StudentListPage';
import { StudentFormPage } from '../pageobjects/StudentFormPage';
// import { StudentProfilePage } from '../pageobjects/StudentProfilePage';
import { AdminCredentials } from '../pageobjects/utils/AdminCredentials';
import { UserDataGenerator } from '../pageobjects/utils/UserDataGenerator';

test.describe("Student creation", () => {
    let loginPage: LoginPage;
    let adminPanelUsersPage: AdminPanelUsersPage;
    let studentListPage: StudentListPage;
    let studentFormPage: StudentFormPage;
    // let studentProfilePage: StudentProfilePage;
    let student;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        adminPanelUsersPage = new AdminPanelUsersPage(page);
        studentListPage = new StudentListPage(page);
        studentFormPage = new StudentFormPage(page);
        // studentProfilePage = new StudentProfilePage(page);
    });

    test('Should create test student', async () => {
        const mainCred = AdminCredentials.admin;
        student = UserDataGenerator.generateStudent();

        // Login as admin
        await loginPage.open();
        await loginPage.login(mainCred.email, mainCred.pass);

        // Navigate to the admin panel
        await adminPanelUsersPage.navigateToStudentsList();
        await studentListPage.addNewStudentBtnClick();

        // Fill student form
        await studentFormPage.fillStudentForm(student);
        await studentFormPage.submitForm();

        // Search for the student in the list and check if the data is correct
        await studentListPage.searchStudentByEmail(student.email, student.telegram);
    });
});